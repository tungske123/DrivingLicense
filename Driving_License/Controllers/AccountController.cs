using Driving_License.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using Driving_License.Models;

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
        [Route("getAccount/{accountid}")]
        public async Task<ActionResult> GetQuiz(Guid accountid)
        {
            var acc = await _context.Accounts.FirstOrDefaultAsync(acc => acc.AccountId == accountid);
            if (acc == null)
            {
                return Problem("The id is not match any Accounts in database");
            }
            return Ok(acc);
        }

        //==========================================================================================================
        [HttpPatch]
        [Route("edit/{accountid}")]
        public async Task<IActionResult> Edit(Guid accountid, [FromBody] Account edited_account)
        {
            //Compare edited_User with old_User
            if (edited_account == null)
            {
                return Ok("Không có thông tin gì thay đổi!");
            }

            var account = await _context.Accounts.FindAsync(accountid);

            if (account == null)
            {
                return NotFound("Mã tài khoản không khớp hoặc sai");
            }
            else
            {
                _context.Accounts.Update(edited_account);
                await _context.SaveChangesAsync();
                return Ok(account);
            }
        }
        
        //==========================================================================================================
        [HttpDelete]
        [Route("delete/{accountid}")]
        public async Task<IActionResult> Delete(Guid accountid)
        {
            if (_context.Accounts == null)
            {
                return Problem("Entity set 'DrivingLicenseContext.Users'  is null.");
            }

            var acc = await _context.Accounts.FindAsync(accountid);
            if (acc != null)
            {
                using DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "proc_DeleteUser";
                command.CommandType = CommandType.StoredProcedure;

                //command.Parameters.Add(new SqlParameter("@AccountID", SqlDbType.UniqueIdentifier) { Value = User.AccountId });
                //command.Parameters.Add(new SqlParameter("@UserID", SqlDbType.UniqueIdentifier) { Value = userid });

                _context.Database.OpenConnection();

                try
                {
                    command.ExecuteNonQuery();
                }
                finally
                {
                    _context.Database.CloseConnection();
                }
                await _context.SaveChangesAsync();
                return Ok("Delete!");
            }

            return Problem("Cannot found or the id is not match!");
        }
    }
}
