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
        public async Task<IActionResult> QuizList(int page = 1, int pagesize=5)
        {
            page = page < 1 ? 1 : page;
            var QuizList = await _context.Quizzes.ToListAsync();
            var pagedQuizzes = QuizList.ToPagedList(page,pagesize);//(Start at, how mane)
            return View("~/Views/Manage/Quizzes.cshtml",pagedQuizzes);
        }
        public async Task<IActionResult> SearchQuiz(string name,int page=1, int pagesize = 5)
        {
            ViewBag.searched = name;
            if (string.IsNullOrEmpty(name))
            {
                return RedirectToAction("QuizList");
            }
            var QuizList = await _context.Quizzes.Where(q=>q.Name.Contains(name)).ToListAsync();
            var pagedQuizzes = QuizList.ToPagedList(page, pagesize);//(Start at, how mane)
            
            return View("~/Views/Manage/Quizzes.cshtml", pagedQuizzes);
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

        public async Task<IActionResult> UserList(int page = 1)
        {
            int pagesize = 5;
            page = page < 1 ? 1 : page;
            var UserList = await _context.Users.ToListAsync();
            var pagedUsers = UserList.ToPagedList(page, pagesize);//(Start at, how mane)
            return View("~/Views/Manage/Users.cshtml", pagedUsers);
        }
    }
}
