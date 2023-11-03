using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace L2D_WebApp.Controllers
{
    public class StaffController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public StaffController(DrivingLicenseContext context) => _context = context;

        [HttpGet]
        [Route("api/staff/info/{sid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetStaffInfo([FromRoute] Guid sid)
        {
            if (sid == Guid.Empty)
            {
                return BadRequest("Invalid staff id");
            }
            var staff = await _context.Staff
                .Include(staff => staff.Account)
                .AsNoTracking().SingleOrDefaultAsync(s => s.StaffId.Equals(sid));
            return (staff is not null) ? Ok(staff) : NotFound($"Can't find any staffs with id {sid}");
        }

        [HttpPut]
        [Route("api/staff/info/update/{sid:guid}")]
        public async Task<IActionResult> UpdateStaffInfo([FromRoute] Guid sid, [FromForm] IFormCollection formData)
        {
            if (sid == Guid.Empty)
            {
                return BadRequest("Invalid staff id");
            }
            var staff = await _context.Staff
                .Include(s => s.Account)
                .SingleOrDefaultAsync(s => s.StaffId.Equals(sid));

            if (staff is null)
            {
                return NotFound($"Can't find any staffs with id {sid}");
            }

            string FullName = formData["FullName"];
            string Email = formData["Email"];
            string ContactNumber = formData["ContactNumber"];
            string Password = formData["Password"];

            staff.FullName = FullName;
            staff.Email = Email;
            staff.ContactNumber = ContactNumber;
            staff.Account.Password = Password;

            _context.Update(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
