using L2D_WebApp.Filters;
using L2D_DataAccess.Models;
using L2D_DataAccess.Repositories;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;
using System;

namespace L2D_WebApp.Controllers
{
    //[LoginFilter]
    public class UserController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public UserController(DrivingLicenseContext context)
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

        [HttpGet]
        [Route("api/user/info/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserInfo([FromRoute] Guid uid)
        {
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }
            var user = await _context.Users
            .Include(user => user.Account)
            .Select(user => new
            {
                UserId = user.UserId,
                Avatar = user.Avatar,
                Cccd = user.Cccd,
                Email = user.Email,
                FullName = user.FullName,
                BirthDate = user.BirthDate,
                Nationality = user.Nationality,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Password = user.Account.Password
            }).AsNoTracking().SingleOrDefaultAsync(user => user.UserId.Equals(uid));
            if (user is not null)
            {

                return Ok(user);
            }

            return NotFound($"Can't find any users with id {uid}");
        }


        private async Task<string> HandleUserAvatar(IFormFile avatarFile, Guid UserId)
        {
            string finalPath = string.Empty;
            var filePath = Path.Combine("wwwroot/img/Avatar", UserId.ToString() + Path.GetExtension(avatarFile.FileName));
            System.Console.WriteLine($"File path: {filePath}");
            using var filestream = new FileStream(filePath, FileMode.Create);
            try
            {
                await avatarFile.CopyToAsync(filestream);
                finalPath = UserId.ToString() + Path.GetExtension(avatarFile.FileName);
            }
            catch (Exception ex)
            {
                System.Console.WriteLine("Update user avatar error: " + ex.Message);
            }
            finally
            {
                filestream.Close();
            }
            return finalPath;
        }

        [HttpPut]
        [Route("api/user/info/update/{uid:guid}")]
        public async Task<IActionResult> UpdateUserInfo([FromRoute] Guid uid, [FromForm] IFormCollection formData)
        {
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }
            var user = await _context.Users
            .Include(user => user.Account)
            .SingleOrDefaultAsync(user => user.UserId.Equals(uid));
            if (user is null)
            {
                return NotFound($"Can't find any users with id {uid}");
            }
            string FullName = formData["FullName"];
            string Email = formData["Email"];
            string Nationality = formData["Nationality"];
            string CCCD = formData["CCCD"];
            string Address = formData["Address"];
            string PhoneNumber = formData["PhoneNumber"];
            string BirthDate = formData["BirthDate"];
            var avatarFile = formData.Files["Avatar"];
            string Password = formData["Password"];

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                user.FullName = FullName;
                user.BirthDate = !string.IsNullOrEmpty(BirthDate) ? Convert.ToDateTime(BirthDate) : DateTime.MinValue;
                user.Email = Email;
                user.Nationality = Nationality;
                user.PhoneNumber = PhoneNumber;
                user.Address = Address;
                user.Cccd = CCCD;
                user.Account.Password = Password;
                if (avatarFile is not null)
                {
                    string avatarPath = await HandleUserAvatar(avatarFile, uid);
                    user.Avatar = avatarPath;
                }

                _context.Update(user);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (System.Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred during the request: {ex.Message}");
            }

            return NoContent();
        }

        [LoginFilter]
        public async Task<IActionResult> Index()
        {
            const string UserProfileViewPath = "~/Views/UserProfile.cshtml";
            var accountsession = System.Text.Json.JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));

            var userData = await _context.Users
                .Select(user => new
                {
                    UserId = user.UserId,
                    AccountId = user.AccountId
                })
                .AsNoTracking()
                .SingleOrDefaultAsync(u => u.AccountId.Equals(accountsession.AccountId));
            ViewBag.UserId = userData.UserId;

            return View(UserProfileViewPath);
        }

        [HttpPost]
        public async Task<IActionResult> EditInfo(IFormCollection form)
        {
            string FullName = form["FullName"];
            string Email = form["Email"];
            string Nationality = form["Nationality"];
            string CCCD = form["CCCD"];
            string Address = form["Address"];
            string PhoneNumber = form["PhoneNumber"];
            string BirthDate = form["BirthDate"];
            var filesend = form.Files["Avatar"];
            string Password = form["Password"];
            var usersession = System.Text.Json.JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));
            var user = await _context.Users
                .Include(u => u.Account)
                .SingleOrDefaultAsync(u => u.AccountId.Equals(usersession.AccountId));

            user.FullName = FullName;
            user.BirthDate = !BirthDate.IsNullOrEmpty() ? DateTime.Parse(BirthDate) : DateTime.MinValue;
            user.Email = Email;
            user.Nationality = Nationality;
            user.PhoneNumber = PhoneNumber;
            user.Address = Address;
            user.Cccd = CCCD;
            user.Account.Password = Password;


            if (filesend is not null)
            {
                var filePath = Path.Combine("wwwroot/img/Avatar", user.UserId.ToString() + Path.GetExtension(filesend.FileName));
                System.Console.WriteLine($"File path: {filePath}");
                using var filestream = new FileStream(filePath, FileMode.Create);
                try
                {
                    await filesend.CopyToAsync(filestream);
                    user.Avatar = user.UserId.ToString() + Path.GetExtension(filesend.FileName);
                }
                catch (Exception ex)
                {

                    System.Console.WriteLine("Update user error: " + ex.Message);
                }
                finally
                {

                    filestream.Close();
                }
            }
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "User");
        }

        public async Task<IActionResult> ViewExamForm()
        {
            var usersession = System.Text.Json.JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));
            var user = await _context.Users
                .AsNoTracking().SingleOrDefaultAsync(u => u.AccountId.Equals(usersession.AccountId));
            ViewBag.user = user;
            return View("~/Views/ExamResigter.cshtml");
        }

        [HttpGet]
        [Route("api/users/profile/{id:guid}")]
        [Produces("application/json")]

        public async Task<IActionResult> GetUserProfileInfo([FromRoute] Guid id)
        {

            var QuizAttemptData = await QuizRepository.Instance.GetQuizAttemptDataFromUser(id);
            var UserData = await _context.Users
            .Where(u => u.UserId.Equals(id))
            .Select(u => new
            {
                UserID = u.UserId,
                AccountID = u.AccountId,
                Avatar = u.Avatar ?? string.Empty,
                CCCD = u.Cccd ?? string.Empty,
                Email = u.Email ?? string.Empty,
                FullName = u.FullName ?? string.Empty,
                BirthDate = u.BirthDate,
                Nationality = u.Nationality ?? string.Empty,
                PhoneNumber = u.PhoneNumber ?? string.Empty,
                Address = u.Address ?? string.Empty,
                RentData = _context.Rents
                .Where(rent => rent.UserId.Equals(id))
                .Select(rent => new
                {
                    RentId = rent.RentId,
                    VehicleName = _context.Vehicles
                    .Where(v => v.VehicleId.Equals(rent.VehicleId))
                    .Select(v => v.Name).AsNoTracking().FirstOrDefault(),
                    StartDate = rent.StartDate,
                    EndDate = rent.EndDate,
                    TotalRentPrice = rent.TotalRentPrice,
                    Status = rent.Status
                })
                .AsSplitQuery()
                .ToList(),
                QuizAttemptData = QuizAttemptData
            })
            .AsNoTracking()
            .FirstOrDefaultAsync();
            if (UserData is null)
            {
                return NotFound($"Can't find any users with id {id}");
            }
            return Ok(UserData);
        }

        [HttpPatch]
        [Route("api/user/profile/update/{uid:guid}")]
        public async Task<IActionResult> UpdateUserProfile([FromRoute] Guid uid, [FromBody] JsonPatchDocument<User> patchDoc)
        {
            if (patchDoc is null)
            {
                return BadRequest();
            }
            var user = await _context.Users.SingleOrDefaultAsync(user => user.UserId.Equals(uid));
            if (user is null)
            {
                return NotFound();
            }
            patchDoc.ApplyTo(user, ModelState);
            await _context.SaveChangesAsync();
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            return Ok(user);
        }

        [HttpGet]
        [Route("api/user/profile/quiz/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserQuizData([FromRoute] Guid uid, Guid aid)
        {
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }
            if (await _context.Users.AnyAsync(user => user.UserId.Equals(uid)) == false)
            {
                return NotFound("Can't find any users");
            }
            var QuizAttemptData = await QuizRepository.Instance.GetQuizAttemptDataFromUser(uid);
            if (aid == Guid.Empty)
            {
                return Ok(QuizAttemptData.OrderByDescending(att => att.AttemptDate));
            }
            return Ok(QuizAttemptData.SingleOrDefault(q => q.AttemptID.Equals(aid)));
        }

        [HttpGet]
        [Route("api/user/profile/quiz/questions/{aid:guid}")] //AttemptID
        [Produces("application/json")]
        public async Task<IActionResult> GetUserAttemptDetailsData([FromRoute] Guid aid)
        {
            if (aid == Guid.Empty)
            {
                return BadRequest();
            }
            if (await _context.Attempts.AnyAsync(att => att.AttemptId.Equals(aid)) == false)
            {
                return NotFound();
            }
            var QuestionDataList = await QuizRepository.Instance.GetQuizAttemptStats(aid);
            return Ok(QuestionDataList);
        }

        struct TimeData
        {
            public int StartTime { get; set; }
            public int EndTime { get; set; }
        }

        private TimeData GetTimeDataFromSlot(string slot)
        {
            TimeData data = slot switch
            {
                "morning" => new TimeData { StartTime = 7, EndTime = 11 },
                "afternoon" => new TimeData { StartTime = 14, EndTime = 18 },
                "evening" => new TimeData { StartTime = 17, EndTime = 21 },
                _ => new TimeData { StartTime = -1, EndTime = -1 }
            };
            return data;
        }

        [HttpDelete]
        [Route("api/users/quizattempt/delete/{aid:guid}")]
        public async Task<IActionResult> DeleteAttempt([FromRoute] Guid aid)
        {
            if (aid == Guid.Empty)
            {
                return BadRequest("Invalid attempt id");
            }
            if (!await _context.Attempts.AnyAsync(attempt => attempt.AttemptId.Equals(aid)))
            {
                return NotFound($"Can't find any attempt with id {aid}");
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.AttemptDetails.Where(attempt => attempt.AttemptId.Equals(aid)).ExecuteDeleteAsync();
                await _context.Attempts.Where(attempt => attempt.AttemptId.Equals(aid)).ExecuteDeleteAsync();

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"Error: {ex.Message}");
            }

            return NoContent();
        }

        [HttpPost]
        [Route("api/hire/register/{uid:guid}")]
        public async Task<IActionResult> RegisterWithLecturer([FromRoute] Guid uid, [FromForm] IFormCollection formData)
        {
            if (uid == Guid.Empty || formData is null)
            {
                return BadRequest();
            }
            string Slot = formData["Slot"];
            string LicenseID = formData["licenseid"];
            string StartDateString = formData["courseStartDate"];
            string EndDateString = formData["courseEndDate"];
            string Address = formData["address"];
            string TeacherID = formData["teacherid"];
            var StartDate = Convert.ToDateTime(StartDateString);
            var EndDate = Convert.ToDateTime(EndDateString);
            var hireData = new Hire
            {
                UserId = uid,
                TeacherId = Guid.Parse(TeacherID),
                HireDate = DateTime.Now,
                Status = "Chờ duyệt"
            };
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                await _context.Hires.AddAsync(hireData);
                await _context.SaveChangesAsync();
                var timeData = GetTimeDataFromSlot(Slot);
                var scheduleList = new List<Schedule>();
                for (DateTime date = StartDate; date <= EndDate; date = date.AddDays(1))
                {
                    scheduleList.Add(new Schedule
                    {
                        HireId = hireData.HireId,
                        LicenseId = LicenseID,
                        StartTime = TimeSpan.FromHours(timeData.StartTime),
                        EndTime = TimeSpan.FromHours(timeData.EndTime),
                        Date = date,
                        Address = Address,
                        Status = "Sắp tới"
                    });
                }

                await _context.Schedules.AddRangeAsync(scheduleList);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An Error occurred when processing request");
            }

            return NoContent();
        }

        [HttpGet]
        [Route("api/user/schedules/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserSchedules([FromRoute] Guid uid, int month)
        {
            if (month <= 0 || month > 12)
            {
                return BadRequest("Invalid month");
            }
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }
            if (await _context.Users.AnyAsync(user => user.UserId.Equals(uid)) == false)
            {
                return NotFound($"Can't find any users with id {uid}");
            }
            var hireList = await _context.Hires
                .Include(hire => hire.Schedules)
                .Where(hire => hire.UserId.Equals(uid) && !hire.Status.Equals("Chờ duyệt"))
                .SelectMany(hire => hire.Schedules)
                .Where(schedule => schedule.Date.Month == month)
                .OrderBy(schedule => schedule.Date)
                .AsNoTracking()
                .AsSplitQuery()
                .ToListAsync();
            return Ok(hireList);
        }

        [HttpGet]
        [Route("api/user/schedules/date/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserScheduleByDate([FromRoute] Guid uid, DateTime? date)
        {
            if (date is null)
            {
                return BadRequest();
            }
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }
            if (await _context.Users.AnyAsync(user => user.UserId.Equals(uid)) == false)
            {
                return NotFound($"Can't find any users with id {uid}");
            }
            var hireList = await _context.Hires
               .Include(hire => hire.Schedules)
               .Where(hire => hire.UserId.Equals(uid) && !hire.Status.Equals("Chờ duyệt"))
               .SelectMany(hire => hire.Schedules)
               .Where(schedule => schedule.Date == date)
               .OrderBy(schedule => schedule.Date)
               .AsNoTracking()
               .AsSplitQuery()
               .ToListAsync();
            return Ok(hireList);
        }

        [HttpPost]
        [Route("api/user/examregister/{uid:guid}")]
        public async Task<IActionResult> RegisterExamProfile([FromRoute] Guid uid, [FromForm] IFormCollection formData)
        {
            if (uid == Guid.Empty)
            {
                return BadRequest("Invalid user id");
            }

            if (!await _context.Users.AnyAsync(user => user.UserId.Equals(uid)))
            {
                return BadRequest($"Can't find any users with id {uid}");
            }

            if (formData is null)
            {
                return BadRequest("Invalid data");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                string LicenseId = formData["LicenseId"];
                DateTime ExamDate = Convert.ToDateTime(formData["ExamDate"]);
                string HealthCondition = formData["HealthCondition"];

                await _context.ExamProfiles.AddAsync(new ExamProfile
                {
                    UserId = uid,
                    LicenseId = LicenseId,
                    ExamDate = ExamDate,
                    HealthCondition = HealthCondition,
                    ExamResult = "...",
                    Status = "Chờ duyệt"
                });

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred during the request: {ex.Message}");
            }

            return NoContent();
        }
    }
}
