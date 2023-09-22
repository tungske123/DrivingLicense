using Driving_License.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Driving_License.Controllers
{
    public class QuizController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public QuizController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            List<Quiz> quizList = await _context.Quizzes.ToListAsync();
            int totalQuiz = quizList.Count();
            ViewBag.currentPage = 1;
            ViewBag.quizList = quizList.Take(4).ToList();
            return View("~/Views/SelectQuizPage.cshtml");
        }
    }
}
