using Driving_License.Models;
using Driving_License.Users;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Driving_License.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.icon_link = "/img/favicon_1.ico";
            UsersDTO user = null;
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("usersession")))
            {
                var Userid = HttpContext.Session.GetString("usersession");
                var userDAO = await UsersDAO.AsyncInstance();
                user = await userDAO.loadFromUserID(Userid);
            }
            ViewBag.user = user;
            return View("~/Views/Home/Home.cshtml");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}