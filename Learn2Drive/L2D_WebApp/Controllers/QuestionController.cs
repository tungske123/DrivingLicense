using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace L2D_WebApp.Controllers
{
    public class QuestionController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public QuestionController(DrivingLicenseContext context) => _context = context;

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
        public async Task<IActionResult> GetQuestionsPaging([FromBody] QuestionFilterData data, [FromRoute] int page = 1, int pageSize = 30)
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
                return NotFound($"Can't find any questions with id {qid}");
            }
            return Ok(question);
        }

        //===================================================================
        [HttpPost]
        [Route("api/question/add")]
        public async Task<IActionResult> Create([FromBody] Question new_question)
        {
            if (new_question.LicenseId.IsNullOrEmpty())
            {
                return BadRequest("Không được để trống loại bằng của câu hỏi!");
            }
            if (new_question.QuestionText.IsNullOrEmpty())
            {
                return BadRequest("Không được tạo câu hỏi trống!");
            }

            var existQuestion = _context.Questions.Any(que => que.LicenseId.Equals(new_question.LicenseId) && que.QuestionText.Equals(new_question.QuestionText));
            if (existQuestion)
            {
                return BadRequest("Câu hỏi đã tồn tại!");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (new_question.QuestionImage.IsNullOrEmpty())
                {
                    new_question.QuestionImage = "none";
                }

                await _context.Questions.AddAsync(new_question);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok("Thêm thành công!");

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occcured during the request: {ex.Message}");
            }
        }

        //===================================================================
        [HttpPatch]
        [Route("api/question/edit/{questid}")]
        public async Task<IActionResult> Edit([FromRoute] int questid, [FromBody] Question edited_question)
        {
            try
            {
                //Compare edited_Question with old_Question
                if (edited_question == null)
                {
                    return BadRequest($"Không có câu hỏi hoặc không nhận được câu hỏi truyền vào server");
                }

                var old_question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questid);
                if (old_question == null)
                {
                    return BadRequest($"Mã câu hỏi sai hoặc không có câu hỏi nào với mã này");
                }
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    if (!edited_question.LicenseId.IsNullOrEmpty())
                    {
                        old_question.LicenseId = edited_question.LicenseId;
                    }
                    if (!edited_question.QuestionText.IsNullOrEmpty())
                    {
                        old_question.QuestionText = edited_question.QuestionText;
                    }
                    if (!edited_question.QuestionImage.IsNullOrEmpty())
                    {
                        old_question.QuestionImage = edited_question.QuestionImage;
                    }
                    old_question.IsCritical = edited_question.IsCritical;



                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return Ok(old_question);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return BadRequest($"An error occurred during the request: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                    return BadRequest($"Không có câu hỏi nào trong ngân hàng câu hỏi.");
                }

                var question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questid);
                if (question != null)
                {
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_DeleteQuestion @questID = @p0", questid);
                    await _context.SaveChangesAsync();
                    return Ok("Đã xóa!");
                }
                return BadRequest("Mã câu hỏi sai hoặc không có câu hỏi nào với mã này!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/questions/filterQuestions")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionsFilterdData()
        {
            var questionList = await _context.Questions.AsNoTracking().ToListAsync();
            var licenseIdList = questionList.Select(pro => pro.LicenseId).Distinct().ToList();
            var isCriticalList = questionList.Select(pro => pro.IsCritical).Distinct().ToList();
            return Ok(new
            {
                //brandList = brandList,
                isCriticalList = isCriticalList,
                licenseIdList = licenseIdList
            });
        }

        public IActionResult QuestionDetail(int questionID)
        {
            ViewBag.questionId = questionID.ToString();
            return View("~/Views/CRUDAnswer.cshtml");
        }

    }
}
