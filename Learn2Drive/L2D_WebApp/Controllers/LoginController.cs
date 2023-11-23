using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using L2D_DataAccess.Utils;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using L2D_DataAccess.Models;
using Google.Apis.Auth;
//using System.Net.NetworkInformation;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Data.SqlClient;
//using Microsoft.AspNetCore.Authentication.Google;
//using System.Security.Claims;
//using Microsoft.AspNetCore.Authentication.Cookies;
//using Driving_License.Models.Users;

namespace L2D_WebApp.Controllers
{
    public class LoginController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public LoginController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var Message = TempData["Message"] as string;
            if (!string.IsNullOrEmpty(Message))
            {
                ViewBag.Message = Message;
            }
            ViewBag.icon_link = "https://cdn-icons-png.flaticon.com/128/1000/1000997.png";
            return View("~/Views/Login.cshtml");
        }

        public IActionResult Authorize()
        {
            string ControllerName = string.Empty;
            var accountsession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(accountsession))
            {
                var account = JsonSerializer.Deserialize<Account>(accountsession);
                ControllerName = account.Role.ToLower() switch
                {
                    "user" => "User",
                    "lecturer" => "Teacher",
                    "staff" => "Staff",
                    "admin" => "Admin",
                    _ => string.Empty
                };
            }
            return RedirectToAction("Index", ControllerName);
        }

        [HttpPost]
        public async Task<IActionResult> login(IFormCollection form)
        {
            var username = form["username"];
            var password = form["password"];
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                TempData["Message"] = "Please fill all informations in the fields";
                return RedirectToAction("Index", "Login");
            }
            var fakePassword = await Fakepassword(password);
            var account = await _context.Accounts
                .AsNoTracking()
                .SingleOrDefaultAsync(acc => acc.Username.Equals(username) && acc.Password.Equals(fakePassword));
            var accountsystem = await _context.Accounts
                .AsNoTracking()
                .SingleOrDefaultAsync(acc => acc.Username.Equals(username) && acc.Password.Equals(password));
            if (account is not null) //Login success
            {
                //Create session then redirect to home page
                HttpContext.Session.SetString("usersession", JsonSerializer.Serialize(account));
                await HttpContext.Session.CommitAsync();
                return RedirectToAction("Index", "Home");
            }
            else if (accountsystem is not null)
            {
                HttpContext.Session.SetString("usersession", JsonSerializer.Serialize(accountsystem));
                await HttpContext.Session.CommitAsync();
                return RedirectToAction("Index", "Home");
            }
            else
            {
                TempData["Message"] = "Sai tên tài khoản hoặc mật khẩu";
                return RedirectToAction("Index", "Login");
            }
        }

        [HttpPost]
        [Route("api/login/google")]
        public async Task<IActionResult> GoogleLogin([FromBody] string idToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
        new GoogleJsonWebSignature.ValidationSettings());

            // Extract the email from the payload
            var email = payload.Email;

            string password="";
            bool needSignup = true, existEmail = false;
            User user;
            Teacher teacher;
            Staff staff;
            Admin admin;
            for (int role = 1; role <= 4; role++)
            {
                switch (role)
                {
                    case 1:
                        user = await _context.Users
                        .Include(u => u.Account)
                        .SingleOrDefaultAsync(usr => usr.Email.Equals(email));
                        existEmail = (user is not null);
                        password = (user is not null) ? user.Account.Password : string.Empty;
                        break;
                    case 2:
                        teacher = await _context.Teachers
                        .Include(u => u.Account)
                        .SingleOrDefaultAsync(tch => tch.Email.Equals(email));
                        existEmail = (teacher is not null);
                        password = (teacher is not null) ? teacher.Account.Password : string.Empty;
                        break;
                    case 3:
                        staff = await _context.Staff
                        .Include(stf => stf.Account)
                        .SingleOrDefaultAsync(stf => stf.Email.Equals(email));
                        existEmail = (staff is not null);
                        password = (staff is not null) ? staff.Account.Password : string.Empty;
                        break;
                    case 4:
                        admin = await _context.Admins
                        .Include(adm => adm.Account)
                        .SingleOrDefaultAsync(adm => adm.Email.Equals(email));
                        existEmail = (admin is not null);
                        password = (admin is not null) ? admin.Account.Password : string.Empty;
                        break;
                }
                //If exist then stop checking
                if (existEmail){
                    needSignup = false;
                    break;
                }

            }//End loop

            //If not exist then create account
            if (needSignup)
            {
                password = Guid.NewGuid().ToString();
                await _context.Database.ExecuteSqlRawAsync("exec dbo.proc_signUpAccount @username = @p0, @password = @p1, @email = @p2", email, password, email);
            }

            //Then login
            var account = await _context.Accounts
                .AsNoTracking()
                .SingleOrDefaultAsync(acc => acc.Username.Equals(email) && acc.Password.Equals(password));

            HttpContext.Session.SetString("usersession", JsonSerializer.Serialize(account));
            await HttpContext.Session.CommitAsync();
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public async Task<IActionResult> signup(IFormCollection form)
        {
            string username = form["username"];
            string password = form["password"];
            string repass = form["repass"];
            string email = form["email"];
            var account = await _context.Accounts.AsNoTracking().FirstOrDefaultAsync(acc => acc.Username.Equals(username));
            if (!password.Equals(repass))
            {
                TempData["Message"] = "Mật khẩu nhập lại không khớp";
                return RedirectToAction("Index", "Login");
            }
            if (account.Username is not null)
            {
                TempData["Message"] = "Tài khoản đã tồn tại !";
                return RedirectToAction("Index", "Login");
            }
            password = await Fakepassword(password);
            //await AccountDAO.Instance.SignUp(username, password, email);
            var result = await _context.Database.ExecuteSqlRawAsync("EXEC dbo.proc_signUpAccount @username = @p0, @password = @p1, @email = @p2", username, password, email);
            TempData["Message"] = "Đăng kí tài khoản thành công !";
            return RedirectToAction("Index", "Login");
        }

        public async Task<IActionResult> logout()
        {
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("usersession")))
            {
                HttpContext.Session.Remove("usersession");
            }
            await HttpContext.Session.CommitAsync();
            return RedirectToAction("Index", "Home");
        }

        public async Task<string> Fakepassword(string password)
        {
            using var md5 = MD5.Create();
            byte[] fromData = Encoding.UTF8.GetBytes(password);
            byte[] targetData = await Task.Run(() => md5.ComputeHash(fromData));
            string byte25string = null;
            for (int i = 0; i < targetData.Length; i++)
            {
                byte25string += targetData[i].ToString("x2");
            }
            return byte25string;
        }

        [HttpPost]
        [Route("api/login/check")]
        public IActionResult CheckLogin()
        {
            var accountsession = HttpContext.Session.GetString("usersession");
            if (string.IsNullOrEmpty(accountsession))
            {
                return Unauthorized();
            }
            var account = JsonSerializer.Deserialize<Account>(accountsession);
            return Ok(new
            {
                Role = account.Role
            });
        }
    }
}
