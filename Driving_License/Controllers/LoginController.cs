using System.Net.NetworkInformation;
using System.Text.Json;
using System.Threading.Tasks;
using Driving_License.Users;
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
            ViewBag.icon_link = "";
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
            var userDAO = await UsersDAO.AsyncInstance();
            var user = await userDAO.login(username, password);
            if (user is not null) //Login success
            {
                //Create session then redirect to home page
                //var serializedUser = JsonSerializer.Serialize(user);
                HttpContext.Session.SetString("usersession", user.UserID.ToString());
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
            string query = "insert into dbo.Users(Email)" +
                "\nvalues(@Email)";
            await userDAO.AddNewUser(query, DBUtils.CreateParameter("@Email", 100, email, DbType.String));
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
            var userDAO = await UsersDAO.AsyncInstance();
            string query = "insert into dbo.Users(Username,Password,Email)" +
                "\nvalues(@username, @password, @email)";
            List<SqlParameter> parameters = new List<SqlParameter>()
            {
                DBUtils.CreateParameter("@username", 100, username, DbType.String),
                DBUtils.CreateParameter("@password", 100, password, DbType.String),
                DBUtils.CreateParameter("@email", 100, email, DbType.String)
            };
            await userDAO.AddNewUser(query, parameters.ToArray());
            return RedirectToAction("Index", "Login");
        }
    }
}