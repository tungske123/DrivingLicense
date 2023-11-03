using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace L2D_WebApp.Controllers
{
    public class TeacherController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public TeacherController(DrivingLicenseContext context)
        {
            _context = context;
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
        [Route("api/teacher/{tid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTeacherProfile([FromRoute] Guid tid)
        {
            if (tid == Guid.Empty)
            {
                return BadRequest();
            }

            var teacher = await _context.Teachers.Include(t => t.Account)
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
            IFormFile Avatar = FormData.Files["Avatar"];
            string FullName = FormData["FullName"];
            string PhoneNumber = FormData["PhoneNumber"];
            string Email = FormData["Email"];
            string Description = FormData["Description"];
            string Password = FormData["Password"];

            if (Avatar is not null)
            {
                string AvatarImagePath = await SaveTeacherImage(FullName, Avatar);
                teacher.Avatar = AvatarImagePath;
            }

            teacher.FullName = FullName;
            teacher.ContactNumber = PhoneNumber;
            teacher.Email = Email;
            teacher.Information = Description;
            teacher.Account.Password = Password;

            _context.Update(teacher);
            await _context.SaveChangesAsync();
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
                .Where(hire => hire.TeacherId.Equals(tid))
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
               .Where(hire => hire.TeacherId.Equals(tid))
               .SelectMany(hire => hire.Schedules)
               .Where(schedule => schedule.Date == date)
               .OrderBy(schedule => schedule.Date)
               .AsNoTracking()
               .AsSplitQuery()
               .ToListAsync();
            return Ok(hireList);
        }
    }
}
