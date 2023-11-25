using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using Microsoft.IdentityModel.Tokens;
using L2D_DataAccess.ViewModels;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        //=========================================================[ CRUD ]========================================================
        [HttpGet]
        [Route("api/account/list")]
        public async Task<ActionResult> GetAccountList(string keyword = "", string role = "", int page = 1)
        {

            var accounts = _context.Accounts.Include(x => x.User).AsQueryable();
            if (!string.IsNullOrEmpty(keyword))
            {
                accounts = accounts.Where(acc => acc.Username.ToLower().Contains(keyword.ToLower()));
            }
            if (!string.IsNullOrEmpty(role))
            {
                accounts = accounts.Where(acc => acc.Role.Equals(role));
            }
            accounts = accounts.OrderBy(acc => acc.Username);
            int pageSize = 10;
            var pageResult = await GetPagedDataAsync<Account>(accounts, page, pageSize);
            return Ok(pageResult);
        }


        //===================================================================
        [HttpGet]
        [Route("api/account/get/{accountid}")]
        public async Task<ActionResult> GetAccount(Guid accountid)
        {
            var acc = await _context.Accounts.Include(x => x.User).FirstOrDefaultAsync(acc => acc.AccountId == accountid);
            if (acc == null)
            {
                return NotFound("Mã tài khoản này không khớp tài khoản nào!");
            }
            return Ok(acc);
        }

        //===================================================================
        [HttpGet]
        [Route("api/account/detail/{accountid}")]
        public async Task<ActionResult> GetAccountDetail(Guid accountid)
        {
            Account acc = await _context.Accounts.SingleOrDefaultAsync(acc => acc.AccountId == accountid);
            if (acc == null)
            {
                return NotFound("Mã tài khoản này không khớp tài khoản nào!");
            }
            switch (acc.Role)
            {
                case "user":
                    return Ok(await _context.Users.SingleOrDefaultAsync(usr => usr.AccountId.Equals(acc.AccountId)));
                case "lecturer":
                    return Ok(await _context.Teachers.SingleOrDefaultAsync(tch => tch.AccountId.Equals(acc.AccountId)));
                case "staff":
                    return Ok(await _context.Staff.SingleOrDefaultAsync(stf => stf.AccountId.Equals(acc.AccountId)));
                case "admin":
                    return Ok(await _context.Admins.SingleOrDefaultAsync(adm => adm.AccountId.Equals(acc.AccountId)));
            }
            return NotFound("Không có thông tin chi tiết của tài khoản này!");
        }

        //===================================================================
        public record NewAccount
        {
            public Account Account { get; set; }
            public string Email { get; set; }
        }
        [HttpPost]
        [Route("api/account/add")]
        public async Task<IActionResult> Create([FromBody] NewAccount model)
        {
            try
            {
                //Declare
                Account new_account = model.Account;
                string email = model.Email;

                if (new_account == null)
                {
                    return BadRequest("Không có tài khoản với tham số hợp lệ truyền vào server!");
                }
                if (new_account.Username.IsNullOrEmpty())
                {
                    return BadRequest("Không được tạo tài khoản trống!");
                }

                var existAccount = _context.Accounts
                    .Any(acc => acc.Username.ToLower().Equals(new_account.Username.ToLower()) &&
                    acc.Role.ToLower().Equals(new_account.Role.ToLower()));
                if (existAccount)
                {
                    return BadRequest("Tài khoản này đã tồn tại!");
                }

                if (new_account.Role.ToLower().Equals("user".ToLower()) || new_account.Role.IsNullOrEmpty())
                {
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_signUpAccount @username = @p0, @password = @p1, @email = @p2",
                        new_account.Username, new_account.Password, email);
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_signUpAccount @username = @p0, @password = @p1, @email = @p2, @roleSet = @p3",
                        new_account.Username, new_account.Password, email, new_account.Role);
                }
                await _context.SaveChangesAsync();
                return Ok("Thêm thành công!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //==========================================================================================================
        public record AccountInfo
        {
            public Account EditedAccount { get; set; }
            public string LicenseID { get; set; }
        }
        [HttpPatch]
        [Route("api/account/update/{accountid}")]
        public async Task<IActionResult> Edit([FromRoute] Guid accountid, [FromBody] AccountInfo info)
        {
            try
            {
                //Declare
                Account edited_account = info.EditedAccount;
                string licenseID = info.LicenseID;

                Account old_account = await _context.Accounts.SingleOrDefaultAsync(a => a.AccountId.Equals(accountid));
                if (old_account == null)
                {
                    return NotFound("Mã tài khoản này không khớp với tài khoản nào!");
                }

                edited_account.AccountId = accountid;
                if (await _context.Accounts.AnyAsync(acc => acc.Username.ToLower().Equals(edited_account.Username.ToLower())))
                {
                    return BadRequest("Tên tài khoản đã tồn tại!");
                }

                if (!edited_account.Username.ToLower().Equals(old_account.Username.ToLower()))
                {
                    old_account.Username = edited_account.Username;
                }
                if (!edited_account.Password.ToLower().Equals(old_account.Password.ToLower()))
                {
                    old_account.Password = edited_account.Password;
                }
                if (!edited_account.Role.Equals(old_account.Role))
                {
                    if (licenseID.IsNullOrEmpty())
                    {
                        await _context.Database.ExecuteSqlRawAsync(
                            "exec dbo.proc_changeRole @accountID= @p0, @roleNew = @p1",
                            accountid, edited_account.Role);
                    }
                    else
                    {
                        await _context.Database.ExecuteSqlRawAsync(
                            "exec dbo.proc_changeRole @accountID= @p0, @roleNew = @p1, @LicenseSet = @p2",
                            accountid, edited_account.Role, licenseID);
                    }
                }
                await _context.SaveChangesAsync();
                return Ok(edited_account);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //==========================================================================================================
        [HttpDelete]
        [Route("api/account/delete/{accountid}")]
        public async Task<IActionResult> Delete(Guid accountid)
        {
            Account acc = await _context.Accounts.SingleOrDefaultAsync(a => a.AccountId.Equals(accountid));
            if (acc == null)
            {
                return NotFound("Mã tài khoản này không khớp với tài khoản nào!");
            }
            switch (acc.Role)
            {
                case "user":
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_DeleteUser @AccountID = @p0, @UserID = @p1, @confirm_DeleteAccount = @p2", accountid, null, "yes");
                    return Ok("Xóa người dùng thành công!");
                case "lecturer":
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_DeleteLecturer @AccountID = @p0, @TeacherID = @p1, @confirm_DeleteAccount = @p2", accountid, null, "yes");
                    return Ok("Xóa giảng viên thành công!");
                case "staff":
                    await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_DeleteStaff @AccountID = @p0, @StaffID = @p1, @confirm_DeleteAccount = @p2", accountid, null, "yes");
                    return Ok("Xóa nhân viên thành công!");
                default:
                    return BadRequest("Xóa thất bại hoặc đã có lỗi xảy ra!");
            }
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
    }
}