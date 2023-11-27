using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static L2D_WebApp.Controllers.QuestionController;

namespace L2D_WebApp.Controllers
{
    public class AnswerController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public AnswerController(DrivingLicenseContext context) => _context = context;

        public record AnswerFilterData
        {
            public string Keyword { get; set; }
            public string QuestionKeyword { get; set; }
            public string LicenseID { get; set; }
        }

        //=========================================================[ CRUD ]========================================================
        [HttpGet]
        [Route("api/answer/get/{answerid}")]
        public async Task<ActionResult> GetAnswer([FromRoute] int answerid)
        {
            var answer = await _context.Answers.FirstOrDefaultAsync(ans => ans.AnswerId == answerid);
            if (answer == null)
            {
                return NotFound("Mã câu trả lời này không khớp với câu trả lời nào!");
            }
            return Ok(answer);
        }

        //===================================================================
        [HttpGet]
        [Route("api/answer/list/{questid}")]
        public async Task<ActionResult> GetAnswerList([FromRoute] int questid)
        {
            var answerList = await _context.Answers
                .Where(ans => ans.QuestionId==questid)
                .ToListAsync();
            if (answerList == null)
            {
                return NotFound("Mã câu hỏi này không có câu trả lời nào!");
            }
            return Ok(answerList);
        }

        //===================================================================
        [HttpGet]
        [Route("api/answer/search")]
        public async Task<ActionResult> SearchAnswer([FromBody] AnswerFilterData data)
        {
            var answerList = await _context.Answers.Where(
                    ans => ans.AnswerText.ToLower().Contains(data.Keyword.ToLower())||
                    (ans.Question.LicenseId.Equals(data.LicenseID) &&
                    ans.Question.QuestionText.ToLower().Contains(data.QuestionKeyword.ToLower()))
                ).ToListAsync();
            if (answerList == null)
            {
                return NotFound("Không tìm thấy câu trả lời nào khớp với bộ lọc!");
            }
            return Ok(answerList);
        }

        //===================================================================
        [HttpPost]
        [Route("api/answer/add")]
        public async Task<IActionResult> Create([FromBody] Answer new_answer)
        {
            try
            {
                if (new_answer == null)
                {
                    return BadRequest("Không có câu trả lời với tham số hợp lệ truyền vào server!");
                }
                if (new_answer.AnswerText.IsNullOrEmpty())
                {
                    return BadRequest("Không được tạo câu trả lời trống!");
                }

                var existAnswer = _context.Answers
                    .Any(ans => ans.QuestionId == new_answer.QuestionId && ans.AnswerText.ToLower().Equals(new_answer.AnswerText.ToLower()));
                if (existAnswer)
                {
                    return BadRequest("Câu trả lời đã tồn tại trong câu hỏi này!");
                }
                if (new_answer.AnswerImage.IsNullOrEmpty())
                {
                    new_answer.AnswerImage = "none";
                }

                _context.Answers.Add(new_answer);
                await _context.SaveChangesAsync();
                return Ok("Thêm thành công!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //===================================================================
        [HttpPatch]
        [Route("api/answer/edit/{answerid}")]
        public async Task<IActionResult> Edit([FromRoute] int answerid, [FromBody] Answer edited_answer)
        {
            try
            {
                //Compare edited_answer with old_answer
                if (edited_answer == null)
                {
                    return BadRequest("Không nhận được câu trả lời với tham số hợp lệ truyền vào server");
                }

                var old_answer = await _context.Answers.FirstOrDefaultAsync(ans => ans.AnswerId == answerid);

                if (old_answer == null)
                {
                    return NotFound("Mã câu trả lời đã chọn không khớp với câu trả lời nào");
                }

                if (!edited_answer.AnswerText.ToLower().Equals(old_answer.AnswerText.ToLower()))
                {
                    old_answer.AnswerText = edited_answer.AnswerText;
                }
                if (!edited_answer.AnswerImage.ToLower().Equals(old_answer.AnswerImage.ToLower()))
                {
                    old_answer.AnswerImage = edited_answer.AnswerImage;
                }
                old_answer.IsCorrect = edited_answer.IsCorrect;

                await _context.SaveChangesAsync();
                return Ok(old_answer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //===================================================================
        [HttpDelete]
        [Route("api/answer/delete/{answerid}")]
        public async Task<ActionResult> Delete([FromRoute] int answerid)
        {
            try
            {
                if (_context.Answers == null)
                {
                    return NotFound("Không có câu trả lời nào trong ngân hàng câu trả lời.");
                }

                var answer = await _context.Answers.FirstOrDefaultAsync(ans => ans.AnswerId == answerid);
                if (answer != null)
                {
                    //Remove constraint
                    await _context.AttemptDetails.Where(attmpDt => attmpDt.SelectedAnswerId == answerid).ExecuteDeleteAsync();

                    //Delete Answer
                    await _context.Answers.Where(ans => ans.AnswerId == answerid).ExecuteDeleteAsync();

                    //Save to database
                    await _context.SaveChangesAsync();
                    return Ok("Đã xóa!");
                }
                return NotFound("Mã câu trả lời này không khớp câu trả lời nào!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
