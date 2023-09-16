using System.Net.NetworkInformation;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Driving_License.Utils;
using System.Data;
using Driving_License.Models.Users;
using Driving_License.Models.Account;

namespace Driving_License.Controllers
{
    public class LoginController : Controller
    {
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
            var account = await AccountDAO.Instance.login(username, password);
            if (account is not null) //Login success
            {
                //Create session then redirect to home page
                HttpContext.Session.SetString("usersession", JsonSerializer.Serialize(account));
                await HttpContext.Session.CommitAsync();
                return RedirectToAction("Index", "Home");
            }
            TempData["Message"] = "Wrong username or password";
            return RedirectToAction("Index", "Login");
        }

        [AllowAnonymous]
        public IActionResult GoogleLogin(string returnUrl = null)
        {
            //Request a redirect to google
            var redirectUrl = Url.Action(nameof(GoogleLoginCallback), "Login", new
            {
                returnUrl
            });
            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUrl
            };
            return Challenge(properties, "Google");
        }
        private async Task handleUserEmail(string email)
        {
            var userDAO = await UsersDAO.AsyncInstance();
            var username = email.Split('@')[0];
            string query = "insert into dbo.Users(Username, Email)" +
                "\nvalues(@Username, @Email)";
            SqlParameter[] parameters = new SqlParameter[]
            {
                DBUtils.CreateParameter("@Username", 100, username, DbType.String),
                DBUtils.CreateParameter("@Email", 100, email, DbType.String)
            };
            await userDAO.AddNewUser(query, parameters);
        }
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLoginCallback(string returnUrl = null, string remoteError = null)
        {
            if (remoteError is not null)
            {
                TempData["Message"] = "Login with Google Error";
                return RedirectToAction("Index", "Login");
            }

            //get user information from google
            var info = await HttpContext.AuthenticateAsync();
            if (info is null)
            {
                TempData["Message"] = "No login info";
                return RedirectToAction("Index", "Login");
            }
            var emailClaim = info.Principal.FindFirstValue(ClaimTypes.Email);
            var userDAO = await UsersDAO.AsyncInstance();
            if (await userDAO.loadFromUserEmail(emailClaim) is null)
            {
                await handleUserEmail(emailClaim);
            }
            var user = await userDAO.loadFromUserEmail(emailClaim);
            if (user is not null)
            {
                HttpContext.Session.SetString("usersession", user.UserID.ToString());
            }
            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> signup(string username, string password, string email)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(email))
            {
                TempData["Message"] = "Please fill all missing fields";
                return RedirectToAction("Index", "Login");
            }
            await AccountDAO.Instance.SignUp(username, password, email);
            return RedirectToAction("Index", "Login");
        }
    }
}