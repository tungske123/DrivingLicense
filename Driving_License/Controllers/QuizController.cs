using Driving_License.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Driving_License.ViewModels;
using System.Text.Json;
using Driving_License.Utils;
using System.Text;
using System.Text.Json.Serialization;
using Driving_License.Filters;
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

        public async Task<Attempt> GetAttemptFromSession()
        {
            var attemptIdString = HttpContext.Session.GetString("quizsession");
            Attempt attemptSession = null;
            if (Guid.TryParse(attemptIdString, out var attemptId))
            {
                attemptSession = await _context.Attempts
                    .Include(att => att.AttemptDetails)
                    .AsSplitQuery()
                    .FirstOrDefaultAsync(att => att.AttemptId == attemptId);

            }
            return attemptSession;
        }

        [LoginFilter]
        public async Task<IActionResult> StartQuiz(int quizid)
        {
            var attempSessionID = HttpContext.Session.GetString("quizsession");
            //Clean session if exist
            if (!string.IsNullOrEmpty(attempSessionID))
            {
                HttpContext.Session.Remove("quizsession");
            }
            var UserIDString = await getUserIDFromSession();
            var attemptSession = new Attempt()
            {
                AttemptId = Guid.NewGuid(),
                UserId = Guid.Parse(UserIDString),
                QuizId = quizid,
                AttemptDate = DateTime.Now,
                AttemptDetails = new List<AttemptDetail>()
            };
            await _context.Attempts.AddAsync(attemptSession);
            await _context.SaveChangesAsync();

            var insertedAtttempt = await _context.Attempts
                                                .Include(att => att.AttemptDetails)
                                                .AsSplitQuery()
                                                .FirstOrDefaultAsync(att => att.AttemptId.Equals(attemptSession.AttemptId));

            var quiz = await _context.Quizzes.Include(quiz => quiz.Questions)
                                             .ThenInclude(question => question.Answers)
                                             .AsSplitQuery()
                                             .FirstOrDefaultAsync(quiz => quiz.QuizId == quizid);

            var viewModel = new QuizViewModels()
            {
                CurrentQuiz = quiz,
                CurrentQuestion = quiz.Questions.FirstOrDefault(),
                AnsweredQuestionCount = 0
            };


            //Initialize quizsession
            HttpContext.Session.SetString("quizsession", insertedAtttempt.AttemptId.ToString());
            //Ensure session is saved
            await HttpContext.Session.CommitAsync();
            return View("~/Views/Quiz.cshtml", viewModel);
        }

        [HttpPost]
        public async Task<IActionResult> SaveQuestionToSession([FromBody] QuizRequestData data)
        {
            if (data is null)
            {
                return BadRequest("Invalid quiz data");
            }


            var AttemptSessionID = HttpContext.Session.GetString("quizsession");
            var ChosenAnswer = await _context.Answers.FirstOrDefaultAsync(ans => ans.AnswerId == data.AnswerId);
            var attemptDetail = await _context.AttemptDetails.FirstOrDefaultAsync(att =>
    att.QuestionId == data.CurrentQuestionID && att.AttemptId == Guid.Parse(AttemptSessionID));
            if (attemptDetail is null) //not answered
            {
                await _context.AttemptDetails.AddAsync(new AttemptDetail
                {
                    AttemptId = Guid.Parse(AttemptSessionID),
                    QuestionId = data.CurrentQuestionID,
                    SelectedAnswerId = data.AnswerId,
                    IsCorrect = ChosenAnswer.IsCorrect
                });
            }
            else
            {
                attemptDetail.SelectedAnswerId = data.AnswerId;
                _context.AttemptDetails.Update(attemptDetail);
            }
            await _context.SaveChangesAsync();
            return Ok("Quiz Data saved successfully"); //200
        }

        public async Task<IActionResult> LoadQuestion(int questionid)
        {
            var attemptSession = await GetAttemptFromSession();

            var quiz = await _context.Quizzes
                                            .Include(quiz => quiz.Questions)
                                            .ThenInclude(question => question.Answers)
                                            .AsSplitQuery()
                                            .FirstOrDefaultAsync(q => q.QuizId == attemptSession.QuizId);

            var question = quiz.Questions.FirstOrDefault(q => q.QuestionId == questionid);
            var viewModel = new QuizViewModels()
            {
                CurrentQuiz = quiz,
                CurrentQuestion = question,
                AnsweredQuestionCount = await _context.AttemptDetails.CountAsync(att => att.AttemptId.Equals(attemptSession.AttemptId))
            };
            var attemptDetails = await _context.AttemptDetails.FirstOrDefaultAsync(att => att.QuestionId == questionid);
            if (attemptDetails is not null)
            {
                viewModel.AnswerIDString = attemptDetails.SelectedAnswerId.ToString();
            }
            return View("~/Views/Quiz.cshtml", viewModel);
        }

        // [HttpPost]
        // public async Task<IActionResult> FinishQuiz()
        // {

        //     HttpContext.Session.Remove("quizsession");

        //     //Calculate the result and forward to the homepage
        //     return Ok();
        // }
    }
}
