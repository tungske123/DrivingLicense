using Driving_License.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data.Common;
using System.Data;
using Driving_License.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Driving_License.Controllers
{
    public class UserController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public UserController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        //==========================================================================================================
        public async Task<IActionResult> Create(string username, string password, string fullname, string email)
        {
            bool inputNull = false;
            var existUserName = _context.Accounts.Any(a => a.Username.Equals(username));
            if (fullname.IsNullOrEmpty() || email.IsNullOrEmpty() || password.IsNullOrEmpty())
            {
                return Problem("Không được bỏ trống vùng nhập tên hoặc email, hoặc mật khẩu!");
            }
            if (!username.IsNullOrEmpty() && !existUserName && inputNull == false)
            {
                using (DbCommand command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "proc_signUpAccount";
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@username", SqlDbType.NVarChar) { Value = username });
                    command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar) { Value = password });
                    command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar) { Value = email });
                    command.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar) { Value = fullname });

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
                return RedirectToAction("UserList", "Manage");
            }
            return Problem("Tên tài khoản đăng nhập không phù hợp hoặc đã tồn tại!");
        }

        //==========================================================================================================
        public async Task<IActionResult> Delete(Guid userid)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'DrivingLicenseContext.Users'  is null.");
            }

            var user = await _context.Users.FindAsync(userid);
            if (user != null)
            {
                using DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "proc_DeleteUser";
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add(new SqlParameter("@AccountID", SqlDbType.UniqueIdentifier) { Value = user.AccountId });
                command.Parameters.Add(new SqlParameter("@UserID", SqlDbType.UniqueIdentifier) { Value = userid });

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
            }

            return RedirectToAction("UserList", "Manage");
        }

        //==========================================================================================================
        [HttpGet]
        public async Task<IActionResult> Edit(Guid userid)
        {
            var user = await _context.Users
                /*.Include(a => a.Account)
                .AsSplitQuery()*/
                .FirstOrDefaultAsync(u => u.UserId == userid);
            if (user == null)
            {
                return NotFound("Not Found User");
            }
            return View("~/Views/Manage/Users/Update.cshtml", user);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(User edited_User)
        {
            //Compare edited_User with old_User
            if (edited_User == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(edited_User.UserId);

            if (user == null)
            {
                return NotFound();
            }
            else
            {

                try
                {
                    user.Avatar = edited_User.Avatar;
                    user.Cccd = edited_User.Cccd;
                    user.Email = edited_User.Email;
                    user.FullName = edited_User.FullName;
                    user.BirthDate = edited_User.BirthDate;
                    user.Address = edited_User.Address;
                    user.PhoneNumber = edited_User.PhoneNumber;
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(edited_User.UserId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("UserDetail", "Manage", new { userid = edited_User.UserId });
            }
        }
        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
