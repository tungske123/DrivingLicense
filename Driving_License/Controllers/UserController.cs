using Driving_License.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data.Common;
using System.Data;
using Driving_License.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Driving_License.ViewModels;

namespace Driving_License.Controllers
{
    [Route("api-controller-user")]
    [ApiController]
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
        [HttpGet]
        [Route("getUser/{userid}")]
        public async Task<ActionResult> GetQuiz(Guid userid)
        {
            var user = await _context.Users
                /*.Include(a => a.Account)
                .AsSplitQuery()*/
                .FirstOrDefaultAsync(u => u.UserId == userid);
            if (user == null)
            {
                return Problem("The id is not match any Quizzes in database");
            }
            return Ok(user);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] AccountCreation accountUser)
        {
            bool inputNull = false;
            var existUserName = _context.Accounts.Any(a => a.Username.Equals(accountUser.Username));
            if (accountUser.Fullname.IsNullOrEmpty() || accountUser.Email.IsNullOrEmpty() || accountUser.Password.IsNullOrEmpty())
            {
                return Problem("Không được bỏ trống vùng nhập tên hoặc email, hoặc mật khẩu!");
            }
            if (!accountUser.Username.IsNullOrEmpty() && !existUserName && inputNull == false)
            {
                using (DbCommand command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "proc_signUpAccount";
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new SqlParameter("@username", SqlDbType.NVarChar) { Value = accountUser.Username });
                    command.Parameters.Add(new SqlParameter("@password", SqlDbType.NVarChar) { Value = accountUser.Password });
                    command.Parameters.Add(new SqlParameter("@email", SqlDbType.NVarChar) { Value = accountUser.Email });
                    command.Parameters.Add(new SqlParameter("@name", SqlDbType.NVarChar) { Value = accountUser.Fullname });

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
                return Ok("Created!");
            }
            return Problem("Tên tài khoản đăng nhập không phù hợp hoặc đã tồn tại!");
        }

        //==========================================================================================================
        [HttpDelete]
        [Route("delete/{userid}")]
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
                return Ok("Delete!");
            }

            return Problem("Cannot found or the id is not match!");
        }

        //==========================================================================================================
        [HttpPut]
        [Route("edit/{userid}")]
        public async Task<IActionResult> Edit(Guid userid, [FromBody] User edited_User)
        {
            //Compare edited_User with old_User
            if (edited_User == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(userid);

            if (user == null)
            {
                return NotFound("Mã người dùng không khớp hoặc sai");
            }
            else
            {

                try
                {
                    if (!edited_User.Avatar.IsNullOrEmpty())
                    {
                        user.Avatar = edited_User.Avatar;
                    }
                    if (!edited_User.Cccd.IsNullOrEmpty())
                    {
                        user.Cccd = edited_User.Cccd;
                    }
                    if (!edited_User.Email.IsNullOrEmpty())
                    {
                        user.Email = edited_User.Email;
                    }
                    if (!edited_User.FullName.IsNullOrEmpty())
                    {
                        user.FullName = edited_User.FullName;
                    }
                    if (user.BirthDate != edited_User.BirthDate)
                    {
                        user.BirthDate = edited_User.BirthDate;
                    }
                    if (!edited_User.Address.IsNullOrEmpty())
                    {
                        user.Address = edited_User.Address;

                    }
                    if (!edited_User.PhoneNumber.IsNullOrEmpty())
                    {
                        user.PhoneNumber = edited_User.PhoneNumber;
                    }
                    await _context.SaveChangesAsync();
                    return Ok(user);
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
                return Problem("");
            }
        }
        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
