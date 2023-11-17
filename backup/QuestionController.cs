using Driving_License.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using Driving_License.Models;
using Driving_License.Utils;
using Microsoft.IdentityModel.Tokens;

namespace Driving_License.Controllers
{
    [Route("api-controller-question")]
    [ApiController]
    public class QuestionController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public QuestionController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
        //==========================================================================================================
        [HttpGet]
        [Route("getQuestion/{questionid}")]
        public async Task<ActionResult> GetQuestion(int questionid)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questionid);
            if (question == null)
            {
                return Problem("Mã id không trùng với câu hỏi nào!");
            }
            return Ok(question);
        }

        //==========================================================================================================
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] Question new_question)
        {
            var existQuestion = _context.Questions.Any(que => que.QuestionText.Equals(new_question.QuestionText));
            if (existQuestion)
            {
                return Problem("Câu hỏi đã tồn tại!");
            }
            else
            {
                if (new_question.LicenseId.IsNullOrEmpty())
                {
                    return Problem("Không được để trống loại bằng của câu hỏi!");
                }
                if (new_question.QuestionText.IsNullOrEmpty())
                {
                    return Problem("Không được tạo câu hỏi trống!");
                }
                if (new_question.QuestionImage.IsNullOrEmpty())
                {
                    new_question.QuestionImage = "none";
                }

                _context.Questions.Add(new_question);
                await _context.SaveChangesAsync();
                return Ok("Created!");
            }


        }

        //==========================================================================================================
        [HttpPatch]
        [Route("edit/{questionid}")]
        public async Task<IActionResult> Edit(int questionid, [FromBody] Question edited_question)
        {
            //Compare edited_User with old_User
            if (edited_question == null)
            {
                return NotFound("Không có câu hỏi hoặc không nhận được câu hỏi truyền vào server");
            }

            var old_question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questionid);

            if (old_question == null)
            {
                return NotFound("Mã câu hỏi sai hoặc không có câu hỏi nào với mã này");
            }
            else
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
                old_question.License = edited_question.License;
                await _context.SaveChangesAsync();
                return Ok(old_question);
            }
        }

        //==========================================================================================================
        [HttpDelete]
        [Route("delete/{questionid}")]
        public async Task<IActionResult> Delete(int questionid)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'DrivingLicenseContext.Questions'  is null.");
            }

            var question = await _context.Questions.FirstOrDefaultAsync(quest => quest.QuestionId == questionid);
            if (question != null)
            {
                _context.Questions.Remove(question);
                await _context.SaveChangesAsync();
                return Ok("Delete!");
            }

            return Problem("Cannot found or the id is not match!");
        }
    }
}
