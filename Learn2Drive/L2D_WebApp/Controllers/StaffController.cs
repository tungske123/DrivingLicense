using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using L2D_WebApp.Filters;
namespace L2D_WebApp.Controllers
{
    public class StaffController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public StaffController(DrivingLicenseContext context) => _context = context;

        [LoginFilter]
        public async Task<IActionResult> Index()
        {
            var accountsession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(accountsession))
            {
                var account = JsonSerializer.Deserialize<Account>(accountsession);
                if (account.Role.ToLower().Equals("staff"))
                {
                    var staff = await _context.Staff.SingleOrDefaultAsync(s => s.AccountId.Equals(account.AccountId));
                    ViewBag.StaffId = staff.StaffId;
                }
            }
            return View("~/Views/Staff.cshtml");
        }


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
                .Select(s => new
                {
                    StaffId = s.StaffId,
                    FullName = s.FullName,
                    Email = s.Email,
                    ContactNumber = s.ContactNumber,
                    Password = s.Account.Password
                })
                .AsNoTracking().SingleOrDefaultAsync(s => s.StaffId.Equals(sid));
            return (staff is not null) ? Ok(staff) : NotFound($"Can't find any staffs with id {sid}");
        }

        public class StaffUpdateDto
        {
            [Required]
            public string FullName { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            public string ContactNumber { get; set; }

            [Required]
            public string Password { get; set; }
        }


        [HttpPut]
        [Route("api/staff/info/update/{sid:guid}")]
        public async Task<IActionResult> UpdateStaffInfo([FromRoute] Guid sid, [FromForm] StaffUpdateDto formData)
        {
            if (sid == Guid.Empty)
            {
                return BadRequest("Invalid staff id");
            }
            var staff = await _context.Staff
                .SingleOrDefaultAsync(s => s.StaffId.Equals(sid));

            if (staff is null)
            {
                return NotFound($"Can't find any staffs with id {sid}");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                string FullName = formData.FullName;
                string Email = formData.Email;
                string ContactNumber = formData.ContactNumber;
                string Password = formData.Password;
                await _context.Staff.Where(staff => staff.StaffId.Equals(sid))
                    .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.FullName, FullName)
                    .SetProperty(s => s.Email, Email)
                    .SetProperty(s => s.ContactNumber, ContactNumber));
                await _context.Accounts.Where(a => a.AccountId.Equals(staff.AccountId))
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(a => a.Password, Password));
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An error occurred when updating staff");
            }

            return NoContent();
        }
    }
}
