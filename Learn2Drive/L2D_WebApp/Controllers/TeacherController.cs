using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_WebApp.Filters;
using L2D_WebApp.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace L2D_WebApp.Controllers
{
    public class TeacherController : Controller
    {
        private readonly DrivingLicenseContext _context;
        private readonly ImageUtils _imageUtils;
        public TeacherController(DrivingLicenseContext context, ImageUtils imageUtils)
        {
            _context = context;
            _imageUtils = imageUtils;
        }
        
        [LoginFilter]
        public async Task<IActionResult> Index()
        {
            var accountsession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(accountsession))
            {
                var account = JsonSerializer.Deserialize<Account>(accountsession);
                var teacherData = await _context.Teachers
                    .Select(teacher => new
                    {
                        AccountId = teacher.AccountId,
                        TeacherId = teacher.TeacherId
                    })
                    .AsNoTracking().SingleOrDefaultAsync(t => t.AccountId.Equals(account.AccountId));
                ViewBag.TeacherId = teacherData.TeacherId;
            }
            return View("~/Views/Teacher.cshtml");
        }

        private async Task<string> SaveTeacherImage(string FullName, IFormFile Image)
        {
            if (Image is null)
            {
                return string.Empty;
            }
            string FinalImagePath = string.Empty;
            string FormattedName = FullName.Replace(" ", "");
            var filePath = Path.Combine("wwwroot/img/avatar", FormattedName + Path.GetExtension(Image.FileName));
            using var fileStream = new FileStream(filePath, FileMode.CreateNew);
            try
            {
                await Image.CopyToAsync(fileStream);
                FinalImagePath = FormattedName + Path.GetExtension(Image.FileName);
            }
            catch (Exception ex)
            {
                await Console.Out.WriteLineAsync($"Save teacher image error: {ex.Message}");
            }
            finally
            {
                fileStream.Close();
            }
            return FinalImagePath;
        }

        [HttpGet]
        [Route("api/teachers")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teacherList = await _context.Teachers.AsNoTracking().ToListAsync();
            return Ok(teacherList);
        }

        [HttpGet]
        [Route("api/teacher/{tid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTeacherProfile([FromRoute] Guid tid)
        {
            if (tid == Guid.Empty)
            {
                return BadRequest();
            }

            var teacher = await _context.Teachers.Include(t => t.Account)
                .Select(t => new
                {
                    TeacherId = t.TeacherId,
                    LicenseId = t.LicenseId,
                    Avatar = t.Avatar,
                    FullName = t.FullName,
                    Information = t.Information,
                    ContactNumber = t.ContactNumber,
                    Email = t.Email,
                    Password = t.Account.Password
                })
                .AsNoTracking().SingleOrDefaultAsync(t => t.TeacherId.Equals(tid));

            if (teacher is null)
            {
                return NotFound($"Can't find any teachers with id {tid}");
            }

            return Ok(teacher);
        }

        [HttpPut]
        [Route("api/teacher/update/{tid:guid}")]
        public async Task<IActionResult> UpdateTeacherProfile([FromRoute] Guid tid, [FromForm] IFormCollection FormData)
        {
            if (tid == Guid.Empty)
            {
                return BadRequest();
            }
            var teacher = await _context.Teachers
                .Include(t => t.Account)
                .SingleOrDefaultAsync(t => t.TeacherId.Equals(tid));
            if (teacher is null)
            {
                return BadRequest($"Can't find any teacher with id {tid}");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                IFormFile Avatar = FormData.Files["Avatar"];
                string FullName = FormData["FullName"];
                string PhoneNumber = FormData["PhoneNumber"];
                string Email = FormData["Email"];
                string Description = FormData["Description"];
                string Password = FormData["Password"];
                string LicenseId = FormData["LicenseId"];

                if (Avatar is not null)
                {
                    string AvatarImagePath = teacher.TeacherId + Path.GetExtension(Avatar.FileName);
                    await _imageUtils.UpdateImageAsync(Avatar, $@"img/Avatar/{AvatarImagePath}");
                    teacher.Avatar = AvatarImagePath;
                }

                teacher.FullName = FullName;
                teacher.ContactNumber = PhoneNumber;
                teacher.Email = Email;
                teacher.Information = Description;
                teacher.LicenseId = LicenseId;
                teacher.Account.Password = Password;

                _context.Update(teacher);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred when updating teacher profile: {ex.Message}");
            }
            return NoContent();
        }

        [HttpGet]
        [Route("api/teacher/schedules/{tid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTeacherSchedulesData([FromRoute] Guid tid, int month)
        {
            if (tid == Guid.Empty)
            {
                return BadRequest("Invalid teacher id");
            }
            if (!await _context.Teachers.AnyAsync(teacher => teacher.TeacherId.Equals(tid)))
            {
                return BadRequest($"Can't find any teachers with id {tid}");
            }
            if (month <= 0 && month > 12)
            {
                return BadRequest("Invalid month data");
            }
            var hireList = await _context.Hires
                .Include(hire => hire.Schedules)
                .Where(hire => hire.TeacherId.Equals(tid) && !hire.Status.Equals("Chờ duyệt"))
                .SelectMany(hire => hire.Schedules)
                .Where(schedule => schedule.Date.Month == month)
                .OrderBy(schedule => schedule.Date)
                .AsNoTracking()
                .AsSplitQuery()
                .ToListAsync();
            return Ok(hireList);
        }

        [HttpGet]
        [Route("api/teacher/schedules/date/{tid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTeacherSchedulesByDate([FromRoute] Guid tid, DateTime? date)
        {
            if (date is null)
            {
                return BadRequest();
            }
            if (tid == Guid.Empty)
            {
                return BadRequest("Invalid user teacher id");
            }
            if (await _context.Teachers.AnyAsync(teacher => teacher.TeacherId.Equals(tid)) == false)
            {
                return NotFound($"Can't find any teachers with id {tid}");
            }

            var hireList = await _context.Hires
               .Include(hire => hire.Schedules)
               .Where(hire => hire.TeacherId.Equals(tid) && !hire.Status.Equals("Chờ duyệt"))
               .SelectMany(hire => hire.Schedules)
               .Where(schedule => schedule.Date == date)
               .OrderBy(schedule => schedule.Date)
               .AsNoTracking()
               .AsSplitQuery()
               .ToListAsync();
            return Ok(hireList);
        }

        [HttpGet]
        [Route("api/teacher/hirerequest/{tid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetHireRequests([FromRoute] Guid tid)
        {
            if (tid == Guid.Empty)
            {
                return BadRequest("Invalid teacher id");
            }
            if (!await _context.Teachers.AnyAsync(teacher => teacher.TeacherId.Equals(tid)))
            {
                return NotFound($"Can't find any teachers with id ${tid}");
            }
            var hireList = await _context.Hires
                .Include(hire => hire.User)
                .Include(hire => hire.Schedules)
                .Select(hire => new
                {
                    HireId = hire.HireId,
                    TeacherId = hire.TeacherId,
                    LicenseId = hire.Schedules.FirstOrDefault(s => s.HireId.Equals(hire.HireId)).LicenseId,
                    UserId = hire.UserId,
                    UserName = hire.User.FullName,
                    HireDate = hire.HireDate,
                    Status = hire.Status
                })
                .Where(hire => hire.TeacherId.Equals(tid))
                .AsNoTracking()
                .ToListAsync();
            return Ok(hireList);
        }

        [HttpPut]
        [Route("api/teacher/hirerequest/update/{hid:guid}")]
        public async Task<IActionResult> UpdateHireRequestStatus([FromRoute] Guid hid, string status)
        {
            if (hid == Guid.Empty)
            {
                return BadRequest("Invalid hire id");
            }

            if (!await _context.Hires.AnyAsync(hire => hire.HireId.Equals(hid)))
            {
                return BadRequest($"Can't find any hire requests with id {hid}");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                await _context.Hires.Where(hire => hire.HireId.Equals(hid))
                    .ExecuteUpdateAsync(setters => setters.SetProperty(hire => hire.Status, status));
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

        [HttpGet]
        [Route("api/teacherdata")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAllTeachersRegisterData()
        {
            var teacherList = await _context.Teachers
                .Select(teacher => new
                {
                    TeacherId = teacher.TeacherId,
                    FullName = teacher.FullName
                })
                .AsNoTracking().ToListAsync();
            return Ok(teacherList);
        }
    }
}
