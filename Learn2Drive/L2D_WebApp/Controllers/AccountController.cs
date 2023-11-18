using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;

namespace Driving_License.Controllers
{
    public class AccountController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public AccountController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
        //==========================================================================================================
        [HttpGet]
        [Route("api/account")]
        public async Task<IActionResult> GetAll()
        {
            var accounts = await _context.Accounts.ToListAsync();
            if(accounts == null)
            {
                return NotFound();
            }
            return Ok(accounts);
        }
        
        [HttpGet]
        [Route("api/account/{accountid}")]
        public async Task<ActionResult> GetQuiz(Guid accountid)
        {
            var acc = await _context.Accounts.FirstOrDefaultAsync(acc => acc.AccountId == accountid);
            if (acc == null)
            {
                return NotFound("The id is valid");
            }
            return Ok(acc);
        }

        //==========================================================================================================
        [HttpPatch]
        [Route("api/account/update/{accountid}")]
        public async Task<IActionResult> Edit(Guid accountid, [FromBody] Account edited_account)
        {
            var account = await _context.Accounts.SingleOrDefaultAsync(a=>a.AccountId.Equals(accountid));
            if (account == null)
            {
                return NotFound("Cannot find account");
            }
            //Compare edited_User with old_User
            if (edited_account == account)
            {
                return NoContent();
            }
            if(!edited_account.Role.Equals(account.Role))
            {
                var result = await _context.Database.ExecuteSqlRawAsync("EXEC dbo.proc_changeRole @accountID = @p0, @roleNew = @p1, @LicenseSet = @p2", accountid, edited_account.Role, "A1");
            }
            account.Username = edited_account.Username;
            account.Password = edited_account.Password;
            _context.SaveChanges();
            return Ok("Update successfully");
        }

        //==========================================================================================================
        [HttpDelete]
        [Route("api/account/delete/{accountid}")]
        public async Task<IActionResult> Delete(Guid accountid)
        {
            Account acc = await _context.Accounts.SingleOrDefaultAsync(a => a.AccountId.Equals(accountid));
            if (acc == null)
            {
                return NotFound("Can't find account");
            }
            if (acc.Role.Equals("user"))
            {
                User user = (User)await _context.Users.SingleOrDefaultAsync(u=>u.AccountId.Equals(accountid));
                var result = await _context.Database.ExecuteSqlRawAsync("EXEC dbo.proc_DeleteUser @AccountID = @p0, @UserID = @p1, @confirm_DeleteAccount = @p2", accountid, user.UserId, "yes");
                return Ok("Delete user successfully");
            }
            if (acc.Role.Equals("lecturer"))
            {
                Teacher teacher = (Teacher)await _context.Teachers.SingleOrDefaultAsync(t => t.AccountId.Equals(accountid));
                var result = await _context.Database.ExecuteSqlRawAsync("EXEC dbo.proc_DeleteLecturer @AccountID = @p0, @TeacherID = @p1, @confirm_DeleteAccount = @p2", accountid, teacher.TeacherId, "yes");
                return Ok("Delete teahcer successfully");
            }
            if (acc.Role.Equals("staff"))
            {   
                Staff staff = (Staff)await _context.Staff.SingleOrDefaultAsync(s => s.AccountId.Equals(accountid));
                var result = await _context.Database.ExecuteSqlRawAsync("EXEC dbo.proc_DeleteStaff @AccountID = @p0, @StaffID = @p1, @confirm_DeleteAccount = @p2", accountid, staff.StaffId, "yes");
                return Ok("Delete staff successfully");
            }
            return BadRequest("Account is invaliid");
        }
    }
}
