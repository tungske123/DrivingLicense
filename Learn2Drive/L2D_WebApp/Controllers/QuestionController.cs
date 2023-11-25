using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using L2D_WebApp.Utils;

namespace L2D_WebApp.Controllers
{
    public class QuestionController : Controller
    {
        private readonly DrivingLicenseContext _context;
        private readonly ImageUtils _imageUtils;
        public QuestionController(DrivingLicenseContext context, ImageUtils imageUtils)
        {
            _context = context;
            _imageUtils = imageUtils;
        }

        public record QuestionFilterData
        {
            public string Keyword { get; set; }
            public string LicenseID { get; set; }
        }

        public async Task<PageResult<T>> GetPagedDataAsync<T>(IQueryable<T> query, int page, int pageSize)
        {
            //Get total number of rows in table
            int totalCount = await query.CountAsync();

            //Calculate total pages
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            int takingNums = pageSize;
            int skipNums = (page - 1) * pageSize;
            if (totalCount < pageSize)
            {
                takingNums = totalCount;
            }
            List<T> items = await query.Skip(skipNums)
                                       .Take(takingNums)
                                       .ToListAsync();
            return new PageResult<T>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                PageNumber = page,
                PageSize = pageSize,
                Items = items
            };
        }

        [HttpPost]
        [Route("api/questions/{page}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionsPaging([FromBody] QuestionFilterData data, [FromRoute] int page = 1)
        {
            var query = _context.Questions.AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(question => question.QuestionText.ToLower().Contains(data.Keyword.ToLower()));
            }
            if (!string.IsNullOrEmpty(data.LicenseID))
            {
                query = query.Where(question => question.LicenseId.Equals(data.LicenseID));
            }
            query = query.OrderBy(question => question.QuestionText);

            const int pageSize = 20;
            var pageResult = await GetPagedDataAsync<Question>(query, page, pageSize);
            return Ok(pageResult);
        }

        [HttpGet]
        [Route("api/questions/{qid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionByID(int qid)
        {
            if (qid <= 0)
            {
                return BadRequest();
            }
            var question = await _context.Questions
                .Include(question => question.Answers)
                .AsNoTracking().SingleOrDefaultAsync(q => q.QuestionId == qid);
            if (question is null)
            {
                return NotFound("Can't find any questions with id {qid}");
            }
            return Ok(question);
        }
        //=========================================================[ CRUD ]========================================================

        [HttpGet]
        [Route("api/question/get/{questid}")]
        public async Task<ActionResult> GetQuestion([FromRoute] int questid)
        {
            var question = await _context.Questions
                .Include(quest => quest.Answers)
                .FirstOrDefaultAsync(quest => quest.QuestionId == questid);
            if (question == null)
            {
                return NotFound("Mã câu hỏi này không khớp với câu hỏi nào!");
            }
            return Ok(question);
        }

        //===================================================================
        [HttpGet]
        [Route("api/question/list/{licenseid}")]
        public async Task<ActionResult> GetQuestionList([FromRoute] string licenseid)
        {
            var questionList = await _context.Questions
                .Where(quest => quest.LicenseId.Equals(licenseid))
                .ToListAsync();
            if (questionList == null)
            {
                return NotFound("Mã bằng lái này không có câu hỏi nào!");
            }
            return Ok(questionList);
        }

        //===================================================================
        [HttpGet]
        [Route("api/question/search")]
        public async Task<ActionResult> SearchQuestion(string keyword, string licenseId)
        {
            var questionList = await _context.Questions.Where(
                    quest => quest.LicenseId.Equals(licenseId)
                    && quest.QuestionText.ToLower().Contains(keyword.ToLower())
                ).ToListAsync();
            if (questionList == null)
            {
                return NotFound("Không tìm thấy câu hỏi nào khớp với bộ lọc!");
            }
            return Ok(questionList);
        }

        //===================================================================
        [HttpPost]
        [Route("api/question/add")]
        public async Task<IActionResult> Create([FromForm] IFormCollection formData)
        {
            //Declare formData as variable
            string licenseId = formData["licenseId"];
            string questionText = formData["questionText"];
            string questionImage = "none";
            string pictureName = "";
            var pictureFile = formData.Files["picture"];
            bool isCritical = Convert.ToBoolean(formData["isCritical"]);

            //Other declare
            bool existPicture = true;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (licenseId.IsNullOrEmpty())
                {
                    return BadRequest("Không được để trống loại bằng của câu hỏi!");
                }
                if (questionText.IsNullOrEmpty())
                {
                    return BadRequest("Không được tạo câu hỏi trống!");
                }

                var existQuestion = _context.Questions.Any(que =>
                que.LicenseId.Equals(licenseId) &&
                que.QuestionText.Equals(questionText)
                );
                if (existQuestion)
                {
                    return BadRequest("Câu hỏi đã tồn tại!");
                }

                if (pictureFile is not null)
                {
                    while (existPicture == true)
                    {
                        pictureName = Guid.NewGuid().ToString();        //Reroll other id
                        existPicture = _context.Questions.Any(que => que.QuestionImage.Equals(pictureName));//Check exist
                    }
                    questionImage = pictureName;
                    var path = $@"img/question/{licenseId}/{pictureName}.png";
                    await _imageUtils.CreateImageAsync(pictureFile, path);
                }
                Question new_question = new Question
                {
                    LicenseId = licenseId,
                    QuestionText = questionText,
                    QuestionImage = questionImage,
                    IsCritical = isCritical
                };
                _context.Questions.Add(new_question);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok("Thêm thành công!");
            }
            catch (System.Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Đã có lỗi xảy ra khi thêm câu hỏi: {ex.Message}");
            }
        }

        //===================================================================
        [HttpPatch]
        [Route("api/question/edit/{questid}")]
        public async Task<IActionResult> Edit([FromRoute] int questid, [FromForm] IFormCollection formData)
        {
            //Edited Question
            string licenseId = formData["licenseId"];
            string questionText = formData["questionText"];
            string questionImage = "none";
            var pictureFile = formData.Files["picture"];
            bool isCritical = Convert.ToBoolean(formData["isCritical"]);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                //Compare edited_Question with old_Question
                if (licenseId.IsNullOrEmpty())
                {
                    return BadRequest("Chưa chọn loại bằng cho câu hỏi");
                }

                var old_question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questid);
                if (old_question is null)
                {
                    return NotFound("Mã câu hỏi này không khớp câu hỏi nào!");
                }
                var old_path = $@"img/question/{old_question.LicenseId}/{old_question.QuestionImage}.png";
                
                //Update variables
                old_question.LicenseId = licenseId;
                old_question.QuestionText = questionText;
                old_question.IsCritical = isCritical;
                if (pictureFile is not null)
                {
                    questionImage = old_question.QuestionImage;   //Get old picture name
                    var new_path = $@"img/question/{licenseId}/{questionImage}.png";
                    await _imageUtils.DeleteImageAsync(old_path);
                    await _imageUtils.CreateImageAsync(pictureFile, new_path);
                }
                old_question.QuestionImage = questionImage;

                _context.Questions.Update(old_question);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(old_question);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Đã có lỗi xảy ra khi cập nhật câu hỏi: {ex.Message}");
            }
        }

        //===================================================================
        [HttpDelete]
        [Route("api/question/delete/{questid}")]
        public async Task<ActionResult> Delete([FromRoute] int questid)
        {
            try
            {
                if (_context.Questions == null)
                {
                    return NotFound("Không có câu hỏi nào trong ngân hàng câu hỏi.");
                }

                var question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questid);
                if (question != null)
                {
                    var path = $@"img/question/{question.LicenseId}/{question.QuestionImage}.png";
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_DeleteQuestion @questID = @p0", questid);
                    await _imageUtils.DeleteImageAsync(path);
                    await _context.SaveChangesAsync();
                    return Ok("Đã xóa!");
                }
                return NotFound("Mã câu hỏi này không khớp với câu hỏi nào!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
