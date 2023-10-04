using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Driving_License.Models;
using Driving_License.Utils;
using X.PagedList;
using Driving_License.ViewModels;

namespace Driving_License.Controllers
{
    public class ManageController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public ManageController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View("~/Views/Home/Manage.cshtml");
        }

        //action: QuizList
        public async Task<IActionResult> QuizList()
        {
            List<Quiz> QuizList = await _context.Quizzes.ToListAsync();
            ViewBag.QuizList = QuizList;
            return View("~/Views/Manage/Quizzes.cshtml");
        }

        //action: CreateQuiz
        public IActionResult CreateQuiz()
        {
            ViewData["LicenseId"] = new SelectList(_context.Licenses, "LicenseId", "LicenseId");
            return View("~/Views/Manage/Quiz/Create.cshtml");
        }

        //action: QuizDetail
        public async Task<IActionResult> QuizDetail(int QuizId)
        {
            //int page = 1;
            //int amountInP = 5;

            var quiz = await _context.Quizzes
                .Include(quiz => quiz.Questions)
                .AsSplitQuery()
                .FirstOrDefaultAsync(m => m.QuizId == QuizId);

           //List<Question> questionlist = quiz.Questions.ToList();
           //await questionlist.ToPagedListAsync(page, amountInP);
            if (quiz == null)
            {
                return NotFound();
            }

            return View("~/Views/Manage/Quiz/ViewDetail.cshtml", quiz);
        }

    }
}
