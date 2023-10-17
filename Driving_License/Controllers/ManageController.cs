using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Driving_License.Models;
using Driving_License.Utils;
using X.PagedList;
using Driving_License.ViewModels;
using Microsoft.IdentityModel.Tokens;

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
        //============================[ QUIZ ]=================================
        //action: QuizList
        public async Task<IActionResult> QuizList(int page = 1, int pagesize = 5)
        {
            page = page < 1 ? 1 : page;
            var QuizList = await _context.Quizzes.ToListAsync();
            var pagedQuizzes = QuizList.ToPagedList(page, pagesize);//(Start at, how mane)
            return View("~/Views/Manage/Quizzes.cshtml", pagedQuizzes);
        }

        //action: SearchQuiz(keyword) ---------------------------------------
        public async Task<IActionResult> SearchQuiz(string name, int page = 1, int pagesize = 5)
        {
            ViewBag.searchedQuiz = name;
            if (string.IsNullOrEmpty(name))
            {
                return RedirectToAction("QuizList");
            }
            var QuizList = await _context.Quizzes.Where(q => q.Name.Contains(name)).ToListAsync();
            var pagedQuizzes = QuizList.ToPagedList(page, pagesize);//(Start at, how mane)

            return View("~/Views/Manage/Quizzes.cshtml", pagedQuizzes);
        }

        //action: CreateQuiz ---------------------------------------
        public IActionResult CreateQuiz()
        {
            ViewData["LicenseId"] = new SelectList(_context.Licenses, "LicenseId", "LicenseId");
            return View("~/Views/Manage/Quiz/Create.cshtml");
        }

        //action: QuizDetail ---------------------------------------
        public async Task<IActionResult> QuizDetail(int quizId, int page = 1, int pagesize = 10)
        {
            var quiz = await _context.Quizzes
                .Include(quiz => quiz.Questions)
                .AsSplitQuery()
                .FirstOrDefaultAsync(m => m.QuizId == quizId);

            if (quiz == null)
            {
                return NotFound();
            }
            ViewBag.quiz = quiz;
            var pagedQuizzes = quiz.Questions.ToPagedList(page, pagesize);//(Start at, how mane)

            return View("~/Views/Manage/Quiz/ViewDetail.cshtml", pagedQuizzes);
        }

        //============================[ USER ]=================================
        //action: UserList
        public async Task<IActionResult> UserList(int page = 1, int pagesize = 5)
        {
            page = page < 1 ? 1 : page;

            var UserList = await _context.Users.ToListAsync();
            var pagedUsers = UserList.ToPagedList(page, pagesize);//(Start at, how mane)
            return View("~/Views/Manage/Users.cshtml", pagedUsers);
        }

        //action: CreateUser ---------------------------------------
        public IActionResult CreateUser()
        {
            return View("~/Views/Manage/Users/Create.cshtml");
        }

        //action: UserDetail ---------------------------------------
        public async Task<IActionResult> UserDetail(Guid userid)
        {
            var user = await _context.Users
                .Include(acc => acc.Account)
                .FirstOrDefaultAsync(u => u.UserId == userid);

            if (user == null)
            {
                return NotFound();
            }

            return View("~/Views/Manage/Users/ViewDetail.cshtml", user);
        }

        //action: SearchUser ---------------------------------------
        public async Task<IActionResult> SearchUser(string name, int page = 1, int pagesize = 5)
        {
            ViewBag.searchedQuiz = name;
            if (name.IsNullOrEmpty())
            {
                return RedirectToAction("UserList");
            }
            var user_list = await _context.Users.Where(u => u.FullName.Contains(name)).ToListAsync();
            var pagedQuizzes = user_list.ToPagedList(page, pagesize);//(Start at, how mane)

            return View("~/Views/Manage/Users.cshtml", pagedQuizzes);
        }
    }
}
