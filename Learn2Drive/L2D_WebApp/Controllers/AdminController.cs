using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using L2D_WebApp.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace L2D_WebApp.Controllers
{
    public class AdminController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public AdminController(DrivingLicenseContext context) => _context = context;

        [LoginFilter]
        public async Task<IActionResult> Index()
        {
            var accountsession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(accountsession))
            {
                var account = JsonSerializer.Deserialize<Account>(accountsession);
                var admin = await _context.Admins.AsNoTracking().SingleOrDefaultAsync(ad => ad.AccountId.Equals(account.AccountId));
                ViewBag.AdminId = admin.AdminId;
            }

            return View("~/Views/Admin.cshtml");
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
            }
            catch
            {
                await transaction.RollbackAsync();
                return BadRequest("An error occurred during the request");
            }
            return NoContent();
        }

        private async Task DeleteUser(Guid AccountId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _context.Users.SingleOrDefaultAsync(user => user.AccountId.Equals(AccountId));

                await _context.Rents.Where(rent => rent.UserId.Equals(user.UserId)).ExecuteDeleteAsync();
                //delete schedules from hire
                var HireList = await _context.Hires.Where(hire => hire.UserId.Equals(user.UserId)).ToListAsync();
                await _context.Users.Where(u => u.UserId.Equals(user.UserId)).ExecuteDeleteAsync();
                await _context.Accounts.Where(acc => acc.AccountId.Equals(AccountId)).ExecuteDeleteAsync();
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex) 
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }

        [HttpDelete]
        [Route("api/admin/accounts/delete/{aid:guid}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid aid)
        {
            if (aid == Guid.Empty)
            {
                return BadRequest("Invalid account id");
            }
            var account = await _context.Accounts.SingleOrDefaultAsync(acc => acc.AccountId.Equals(aid));
            if (account is null)
            {
                return NotFound($"Can't find any accounts with id {aid}");
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                switch (account.Role.ToLower())
                {
                    case "user":
                        await _context.Users.Where(user => user.AccountId.Equals(aid)).ExecuteDeleteAsync();
                        break;
                    case "teacher":
                        await _context.Teachers.Where(teacher => teacher.AccountId.Equals(aid)).ExecuteDeleteAsync();
                        break;
                    case "staff":
                        await _context.Staff.Where(staff => staff.AccountId.Equals(aid)).ExecuteDeleteAsync();
                        break;
                    default:
                        break;
                }

                await _context.Accounts.Where(acc => acc.AccountId.Equals(aid)).ExecuteDeleteAsync();

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred when processing request: {ex.Message}");
            }
            return NoContent();
        }

        [HttpGet]
        [Route("api/accounts")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAccountsPaging(int page = 1)
        {
            if (page <= 0)
            {
                return BadRequest("Invalid page value");
            }
            var query = _context.Accounts.AsQueryable();
            const int pageSize = 10;
            var pageResult = await GetPagedDataAsync<Account>(query, page, pageSize);

            return Ok(pageResult);
        }

       

        

    }
}
