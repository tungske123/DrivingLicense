using Driving_License.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Driving_License.ViewModels;
using System.Text.Json;
using Driving_License.Utils;
using System.Text;
using System.Text.Json.Serialization;
using Driving_License.Filters;
using Driving_License.Repositories;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using System.Data.Common;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using System.Drawing.Printing;
using X.PagedList;
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
            var attemptDetails = await _context.AttemptDetails.FirstOrDefaultAsync(att => att.QuestionId == questionid && att.AttemptId.Equals(attemptSession.AttemptId));
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
            var AttemptSession = await _context.Attempts.FirstOrDefaultAsync(att => att.AttemptId.ToString().Equals(AttemptSessionID));
            int QuizID = AttemptSession.QuizId;
            ViewBag.QuizID = QuizID;
            //Calculate the result and forward to the result page
            var quizResultModel = await QuizRepository.Instance.CalculateQuizResult(Guid.Parse(AttemptSessionID));
            var QuizQuestionDataDB = await QuizRepository.Instance.GetQuizAttemptStats(Guid.Parse(AttemptSessionID));
            quizResultModel.QuestionDataList.AddRange(QuizQuestionDataDB);
            //Delete quiz session
            HttpContext.Session.Remove("quizsession");
            await HttpContext.Session.CommitAsync();
            return View("~/Views/QuizResult.cshtml", quizResultModel);
        }

        //-----------------------------------[ FOR ADMIN ]-----------------------------------------
        [HttpPost]
        public async Task<IActionResult> Create(string quizName, string LicenseId, string Description, int quantity)
        {
            var existName = _context.Quizzes.Any(e => e.Name.Equals(quizName));
            if (quizName.IsNullOrEmpty())
            {
                quizName = "Chưa đặt tên";
            }
            else if (Description.IsNullOrEmpty())
            {
                Description = "Không có thông tin gì được để lại!";
            }
            if (existName)
            {
                quizName += "(Trùng tên)";
                Description = "Đề này có tên trùng với đề khác";
            }
            //int cho phép giá trị null để có thể check điều kiện
            if (quantity < 25)
            {
                return Problem("The quantity field is required and must bigger than 25.");
            }
            else
            {
                using (DbCommand command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "proc_CreateQuiz";
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@Name", SqlDbType.NVarChar) { Value = quizName });
                    command.Parameters.Add(new SqlParameter("@LicenseID", SqlDbType.NVarChar) { Value = LicenseId });
                    command.Parameters.Add(new SqlParameter("@Describe", SqlDbType.NVarChar) { Value = Description });
                    command.Parameters.Add(new SqlParameter("@quantity", SqlDbType.Int) { Value = quantity });

                    _context.Database.OpenConnection();

                    try
                    {
                        command.ExecuteNonQuery();
                    }
                    finally
                    {
                        _context.Database.CloseConnection();
                    }
                }
                await _context.SaveChangesAsync();
                return RedirectToAction("QuizList", "Manage");
            }
        }
        //==========================================================================================================
        [HttpGet]
        public async Task<IActionResult> Edit(int quizid)
        {
            var quiz = await _context.Quizzes
                .Include(quiz => quiz.Questions)
                .AsSplitQuery()
                .FirstOrDefaultAsync(m => m.QuizId == quizid);
            if (quiz == null)
            {
                return NotFound();
            }
            ViewData["LicenseId"] = new SelectList(_context.Licenses, "LicenseId", "LicenseId", quiz.LicenseId);
            return View("~/Views/Manage/Quiz/Update.cshtml", quiz);
        }

        [HttpPost]
        public async Task<IActionResult> Edit([FromBody] Quiz edited_Quiz)
        {
            //Compare edited_quiz with old_quiz
            if (edited_Quiz != null)
            {
                var old_Quiz = await _context.Quizzes
                    .Include(q => q.Questions)
                    .FirstOrDefaultAsync(q => q.QuizId == edited_Quiz.QuizId);

                if (old_Quiz != null)
                {
                    if (old_Quiz.Name != edited_Quiz.Name)
                    {
                        old_Quiz.Name = edited_Quiz.Name;
                    }
                    if (old_Quiz.LicenseId != edited_Quiz.LicenseId)
                    {
                        old_Quiz.LicenseId = edited_Quiz.LicenseId;
                    }
                    if (old_Quiz.Description != edited_Quiz.Description)
                    {
                        old_Quiz.Description = edited_Quiz.Description;
                    }

                    //Compare quiz question
                    if (edited_Quiz.Questions != null && edited_Quiz.Questions.Count > 0)
                    {
                        foreach (var edited_Question in edited_Quiz.Questions)
                        {
                            var old_Question = old_Quiz.Questions.FirstOrDefault(q => q.QuestionId == edited_Question.QuestionId);
                            if (old_Question != null)
                            {
                                // Update existing question
                                if (old_Question.QuestionText != edited_Question.QuestionText)
                                {
                                    old_Question.QuestionText = edited_Question.QuestionText;
                                }
                            }
                            else
                            {
                                // Add new question if old don't have
                                old_Quiz.Questions.Add(edited_Question);
                            }
                        }

                        //Get all question in old_quiz don't have in edited_Quiz
                        var deletedQuestions = old_Quiz.Questions.Where(oq => !edited_Quiz.Questions.Any(eq => eq.QuestionId == oq.QuestionId)).ToList();
                        foreach (var deletedQuestion in deletedQuestions)
                        {
                            old_Quiz.Questions.Remove(deletedQuestion);
                        }
                    }

                    await _context.SaveChangesAsync();
                }
            }
            //------------------------------
            /*if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(quiz);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!QuizExists(quiz.QuizId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("QuizList", "Manage");
            }
            ViewData["LicenseId"] = new SelectList(_context.Licenses, "LicenseId", "LicenseId", quiz.LicenseId);*/
            return RedirectToAction("QuizDetail", "Manage", new { quizId = edited_Quiz.QuizId });
        }
        //==========================================================================================================
        public async Task<IActionResult> Delete(int quizid)
        {
            if (_context.Quizzes == null)
            {
                return Problem("Entity set 'DrivingLicenseContext.Quizzes'  is null.");
            }
            var quiz = await _context.Quizzes.FindAsync(quizid);
            if (quiz != null)
            {
                //Delete constrain of Quiz
                using DbCommand command_Foreign = _context.Database.GetDbConnection().CreateCommand();
                command_Foreign.CommandText = "proc_DeleteHave";
                command_Foreign.CommandType = CommandType.StoredProcedure;

                command_Foreign.Parameters.Add(new SqlParameter("@QuizID", SqlDbType.Int) { Value = quiz.QuizId });
                command_Foreign.Parameters.Add(new SqlParameter("@QuestionID", SqlDbType.Int) { Value =  DBNull.Value}); 

                using DbCommand command_Primary = _context.Database.GetDbConnection().CreateCommand();
                command_Primary.CommandText = "proc_DeleteQuiz";
                command_Primary.CommandType = CommandType.StoredProcedure;

                command_Primary.Parameters.Add(new SqlParameter("@quizID", SqlDbType.Int) { Value = quiz.QuizId });
                command_Primary.Parameters.Add(new SqlParameter("@LicenseID", SqlDbType.Int) { Value = DBNull.Value });

                _context.Database.OpenConnection();

                try
                {
                    command_Foreign.ExecuteNonQuery();
                    command_Primary.ExecuteNonQuery();
                }
                finally
                {
                    _context.Database.CloseConnection();
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("QuizList", "Manage");
        }

        public async Task<IActionResult> DeleteQuizQuest(int quizid, int questid)
        {
            if (_context.Quizzes == null)
            {
                return Problem("Entity set 'DrivingLicenseContext.Questions'  is null.");
            }
            var quiz = await _context.Quizzes.FindAsync(quizid);
            if (quiz != null)
            {
                using DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "proc_DeleteQuizQuest";
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add(new SqlParameter("@quizID", SqlDbType.Int) { Value = quizid });
                command.Parameters.Add(new SqlParameter("@questID", SqlDbType.Int) { Value = questid });

                _context.Database.OpenConnection();

                try
                {
                    command.ExecuteNonQuery();
                }
                finally
                {
                    _context.Database.CloseConnection();
                }
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("QuizDetail", "Manage", new { QuizId = quizid });
        }

        private bool QuizExists(int id)
        {
            return _context.Quizzes.Any(e => e.QuizId == id);
        }
    }
}
