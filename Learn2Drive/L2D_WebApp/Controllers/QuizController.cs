using L2D_DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using L2D_DataAccess.ViewModels;
using System.Text.Json;
using L2D_DataAccess.Utils;
using System.Text;
using System.Text.Json.Serialization;
using L2D_WebApp.Filters;
using L2D_DataAccess.Repositories;
using Microsoft.AspNetCore.JsonPatch;
//using System.ComponentModel;

namespace L2D_WebApp.Controllers
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
            var user = await _context.Users.AsNoTracking().SingleOrDefaultAsync(user => user.AccountId.ToString().Equals(AccountID));
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
                    .AsNoTracking()
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
                                                .AsNoTracking()
                                                .SingleOrDefaultAsync(att => att.AttemptId.Equals(attemptSession.AttemptId));

            var quiz = await _context.Quizzes.Include(quiz => quiz.Questions)
                                             .ThenInclude(question => question.Answers)
                                             .AsSplitQuery()
                                             .AsNoTracking()
                                             .SingleOrDefaultAsync(quiz => quiz.QuizId == quizid);

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
            var ChosenAnswer = await _context.Answers.AsNoTracking().SingleOrDefaultAsync(ans => ans.AnswerId == data.AnswerId);
            var attemptDetail = await _context.AttemptDetails.AsNoTracking().FirstOrDefaultAsync(att =>
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
                                            .AsNoTracking()
                                            .SingleOrDefaultAsync(q => q.QuizId == attemptSession.QuizId);

            var question = quiz.Questions.FirstOrDefault(q => q.QuestionId == questionid);
            var viewModel = new QuizViewModels()
            {
                CurrentQuiz = quiz,
                CurrentQuestion = question,
                AnsweredQuestionCount = await _context.AttemptDetails.CountAsync(att => att.AttemptId.Equals(attemptSession.AttemptId))
            };
            var attemptDetails = await _context.AttemptDetails.AsNoTracking().FirstOrDefaultAsync(att => att.QuestionId == questionid && att.AttemptId.Equals(attemptSession.AttemptId));
            if (attemptDetails is not null)
            {
                viewModel.AnswerIDString = attemptDetails.SelectedAnswerId.ToString();
            }
            return View("~/Views/Quiz.cshtml", viewModel);
        }


        public async Task<IActionResult> FinishQuiz()
        {
            ViewBag.icon_link = "https://cdn-icons-png.flaticon.com/512/4832/4832401.png";
            var AttemptSessionID = HttpContext.Session.GetString("quizsession");
            var AttemptSession = await _context.Attempts.AsNoTracking().SingleOrDefaultAsync(att => att.AttemptId.ToString().Equals(AttemptSessionID));
            int QuizID = AttemptSession.QuizId;
            ViewBag.QuizID = QuizID;
            //Calculate the result and forward to the result page
            var quizResultModel = await QuizRepository.Instance.CalculateQuizResult(Guid.Parse(AttemptSessionID));
            var QuizQuestionDataDB = await QuizRepository.Instance.GetQuizAttemptStats(Guid.Parse(AttemptSessionID));
            if (quizResultModel is not null)
            {
                quizResultModel.QuestionDataList.AddRange(QuizQuestionDataDB);
                quizResultModel.AttemptID = Guid.Parse(AttemptSessionID);
            }
            //Delete quiz session
            HttpContext.Session.Remove("quizsession");
            await HttpContext.Session.CommitAsync();
            return View("~/Views/QuizResult.cshtml", quizResultModel);
        }

        //CRUD

        public record QuizFilterData
        {
            public string Keyword { get; set; }
            public string LicenseID { get; set; }
        };

        [HttpPost]
        [Route("api/quizzes")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizzesPaging([FromBody] QuizFilterData data, int page = 1)
        {
            var query = _context.Quizzes.AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(quiz => quiz.Name.ToLower().Contains(data.Keyword.ToLower()));
            }
            if (!string.IsNullOrEmpty(data.LicenseID))
            {
                query = query.Where(quiz => quiz.LicenseId.Equals(data.LicenseID));
            }
            query = query.OrderBy(quiz => quiz.Name);
            const int pageSize = 5;
            var pageResult = await GetPagedDataAsync<Quiz>(query, page, pageSize);
            return Ok(pageResult);
        }

        [HttpGet]
        [Route("api/quiz/{qid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuizByID([FromRoute] int qid)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .AsNoTracking()
                .SingleOrDefaultAsync(q => q.QuizId == qid);
            return (quiz is not null) ? Ok(quiz) : NotFound($"Can't find any quiz with id {qid}");
        }

        public record QuizFormData
        {
            public string QuizName { get; set; }
            public string LicenseID { get; set; }
            public int Quantity { get; set; }
            public string Description { get; set; }
            public bool HasRandomQuestions { get; set; }
            public List<int> QuestionIDList { get; set; }
        };

        [HttpPost]
        [Route("api/quizzes/generate")]
        public async Task<IActionResult> GenerateQuizQuestionsRandomly([FromBody] QuizFormData data)
        {
            if (data is null)
            {
                return BadRequest();
            }
            if (data.HasRandomQuestions)
            {
                await QuizRepository.Instance.GenerateQuizQuestions(data.QuizName, data.LicenseID, data.Description, data.Quantity);
                return NoContent();
            }
            if (data.QuestionIDList is null || data.QuestionIDList.Count == 0)
            {
                return BadRequest();
            }
            var quiz = new Quiz
            {
                Name = data.QuizName,
                LicenseId = data.LicenseID,
                Description = data.Description
            };

            var questionList = await _context.Questions
                .Where(question => data.QuestionIDList.Contains(question.QuestionId))
                .ToListAsync();
            //Add to have table
            foreach (var question in questionList)
            {
                quiz.Questions.Add(question);
            }

            await _context.Quizzes.AddAsync(quiz);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch]
        [Route("api/quizzes/update/{qid}")]
        public async Task<IActionResult> UpdateQuiz([FromRoute] int qid, [FromBody] QuizFormData FormData)
        {
            if (FormData is null)
            {
                return BadRequest();
            }

            if (!await _context.Quizzes.AnyAsync(quiz => quiz.QuizId == qid))
            {
                return NotFound($"Can't find any quiz with id {qid}");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Quizzes.Where(quiz => quiz.QuizId == qid)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(q => q.Name, FormData.QuizName)
                    .SetProperty(q => q.LicenseId, FormData.LicenseID)
                    .SetProperty(q => q.Description, FormData.Description));
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An error ocurred when updating quiz");
            }
            return NoContent();
        }

        [HttpDelete]
        [Route("api/quizzes/delete/{qid}")]
        public async Task<IActionResult> DeleteQuiz([FromRoute] int qid)
        {
            if (qid <= 0)
            {
                return BadRequest("Invalid quiz id");
            }

            var quiz = await _context.Quizzes.Include(quiz => quiz.Questions)
                .SingleOrDefaultAsync(q => q.QuizId == qid);
            if (quiz is null)
            {
                return NotFound($"Can't find any quizzes");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var quizAttemptList = await _context
                    .Attempts.Where(attempt => attempt.QuizId == qid)
                    .ToListAsync();
                foreach (var attempt in quizAttemptList)
                {
                    await _context.AttemptDetails.Where(at => at.AttemptId.Equals(attempt.AttemptId)).ExecuteDeleteAsync();
                }

                await _context.Attempts.Where(a => a.QuizId == qid).ExecuteDeleteAsync();

                foreach (var question in quiz.Questions)
                {
                    quiz.Questions.Remove(question);
                }

                await _context.Quizzes.Where(quiz => quiz.QuizId == qid).ExecuteDeleteAsync();

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An error occurred when deleting quiz");
            }

            return NoContent();
        }
    }
}
