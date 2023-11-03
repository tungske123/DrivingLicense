using L2D_DataAccess.Utils;
using L2D_WebApp.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace L2D_WebApp.Controllers
{
    public class AdminController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public AdminController(DrivingLicenseContext context) => _context = context;


        [HttpGet]
        [Route("api/admin/rent/data")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRentChartData()
        {
            var data = await _context.Rents
                .GroupBy(rent => rent.StartDate.Day)
                .Select(g => new { Date = g.Min(r => r.StartDate), Total = g.Sum(r => r.TotalRentPrice) })
                .ToListAsync();
            return Ok(data);
        }

        [HttpGet]
        [Route("api/admin/info/{aid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAdminInfo([FromRoute] Guid aid)
        {
            if (aid == Guid.Empty)
            {
                return BadRequest("Invalid admin id");
            }
            var admin = await _context.Admins
                .Include(admin => admin.Account)
                .AsNoTracking().SingleOrDefaultAsync(admin => admin.AdminId.Equals(aid));
            return (admin is not null) ? Ok(admin) : NotFound($"Can't find any admins with id {aid}");
        }

        [HttpPut]
        [Route("api/admin/info/update/{aid:guid}")]
        public async Task<IActionResult> UpdateAdminInfo([FromRoute] Guid aid, [FromForm] IFormCollection formData)
        {
            if (aid == Guid.Empty)
            {
                return BadRequest("Invalid admin id");
            }
            if (formData is null)
            {
                return BadRequest("Invalid form data");
            }
            var admin = await _context.Admins
                .Include(admin => admin.Account)
                .SingleOrDefaultAsync(admin => admin.AdminId.Equals(aid));
            if (admin is null)
            {
                return NotFound($"Can't find any admin with id {aid}");
            }
            string FullName = formData["FullName"];
            string Email = formData["Email"];
            string Password = formData["Password"];
            string ContactNumber = formData["Phone"];
            admin.FullName = FullName;
            admin.Email = Email;
            admin.ContactNumber = ContactNumber;
            admin.Account.Password = Password;
            _context.Update(admin);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        [Route("api/admin/accounts/add")]
        public async Task<IActionResult> AddAccount([FromForm] IFormCollection formData)
        {
            string Username = formData["Username"];
            string Password = formData["Password"];
            string Email = formData["Email"];
            string Name = formData["Name"];
            string Role = formData["Role"];
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Database.ExecuteSqlRawAsync("EXEC [dbo].[proc_signUpAccount] @username = @p0, @password = @p1, @email = @p2," +
                    "@name = @p3, @roleSet = @p4", Username, Password, Email, Name, Role);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            } catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An error occurred during the request");
            }
            return NoContent();
        }
    }
}
