using Driving_License.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Driving_License.ViewModels;
using System.Text.Json;
using Driving_License.Utils;
//using System.ComponentModel;

namespace Driving_License.Controllers
{
    public class QuizController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public QuizController(DrivingLicenseContext context)
        {
            _context = context;
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
        public async Task<string> getUserIDFromSession()
        {
            string AccountID = string.Empty;
            var usersession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(usersession))
            {
                AccountID = JsonSerializer.Deserialize<Account>(usersession).AccountId.ToString();
            }
            var user = await _context.Users.FirstOrDefaultAsync(user => user.AccountId.ToString().Equals(AccountID));
            return (user is not null) ? user.UserId.ToString() : string.Empty;
        }
        public async Task<IActionResult> Index(string licenseid, string status, int page = 1, int pageSize = 4)
        {
            bool isValidLicenseID = !string.IsNullOrEmpty(licenseid) && !licenseid.Equals("none");
            bool isValidStatus = !string.IsNullOrEmpty(status) && !status.Equals("none");
            //Get all data from quiz table
            IQueryable<Quiz> query = _context.Quizzes.AsQueryable();
            if (isValidLicenseID)
            {
                //Apply filtering
                query = query.Where(quiz => quiz.LicenseId.Equals(licenseid.ToUpper()));
            }

            string UserID = await getUserIDFromSession();
            if (isValidStatus)
            {
                if (status.Equals("done"))
                {
                    var quizIdsAttempted = await _context.Attempts
                        .Where(attempt => attempt.UserId.ToString().Equals(UserID))
                        .Select(attempt => attempt.QuizId)
                        .ToListAsync();

                    query = query.Where(quiz => quizIdsAttempted.Contains(quiz.QuizId));
                }
                else if (status.Equals("notdone"))
                {
                    var quizIdsNotAttempted = await _context.Attempts
                        .Where(attempt => attempt.UserId.ToString().Equals(UserID))
                        .Select(attempt => attempt.QuizId)
                        .ToListAsync();

                    query = query.Where(quiz => !quizIdsNotAttempted.Contains(quiz.QuizId));
                }
            }

            query = query.OrderBy(quiz => quiz.Name);
            PageResult<Quiz> pageResult = await GetPagedDataAsync(query, page, pageSize);
            ViewBag.licenseid = (isValidLicenseID) ? licenseid : string.Empty;
            ViewBag.status = (isValidStatus) ? status : string.Empty;
            return View("~/Views/SelectQuizPage.cshtml", pageResult);
        }

        [HttpPost]
        public async Task<IActionResult> APIQuizStatus()
        {
            string UserID = await getUserIDFromSession();
            List<int> UserQuizList = await _context.Attempts.Where(attempt => attempt.UserId.ToString().Equals(UserID))
                                                            .Select(attempt => attempt.QuizId)
                                                            .ToListAsync();
            return Json(UserQuizList);
        }

        public async Task<IActionResult> startQuiz(int quizid)
        {
            var quiz = await _context.Quizzes
                                            .Include(quiz => quiz.Questions)
                                            .ThenInclude(question => question.Answers)
                                            .FirstOrDefaultAsync(quiz => quiz.QuizId == quizid);
            if (quiz is null)
            {
                return NotFound();
            }
            var firstQuestion = quiz.Questions.FirstOrDefault();
            //Intialize session
            var quizSessionString = HttpContext.Session.GetString("quizsession");
            QuizViewModels quizViewModels = new QuizViewModels(){
                CurrentQuiz = quiz,
                CurrentQuestion = firstQuestion,
                AnsweredQuestions = new List<Question>(),
                currentQuestionNo = 1                
            };
            if (string.IsNullOrEmpty(quizSessionString))
            {
                //Quiz
                //List of questions (include answers)
                //UserID 
                HttpContext.Session.SetString("quizsession", JsonSerializer.Serialize(quizViewModels));
            }
            //Make sure sesssion is saved
            await HttpContext.Session.CommitAsync();
            return View("~/Views/Quiz.cshtml", quizViewModels);
        }

        public async Task<IActionResult> ChangeQuestion(int questionid)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(question => question.QuestionId == questionid);
            if (question is null)
            {
                return NotFound();
            }

            return Ok();
        }

        //Receive:
        //Question
        //ChosenAnswer
        [HttpPost]
        public async Task<IActionResult> SaveQuestionToSession([FromBody] int QuestionNo,[FromBody] Question question, [FromBody] Answer answer)
        {

            return Ok();
        }
    }
}
