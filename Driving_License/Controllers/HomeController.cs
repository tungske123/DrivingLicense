//using Driving_License.Models;
//using Driving_License.Models.Users;
using Driving_License.ViewModels;
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

        public IActionResult Index()
        {
            ViewBag.icon_link = "/img/favicon_1.ico";
            return View("~/Views/Home/Home.cshtml");
        }
        public IActionResult License(string licenseid)
        {
            //Key: LicenseID, Value: the link to the icon img of the page
            IDictionary<string, string> licenseIcons = new Dictionary<string, string>()
        {
            {"A1", "https://cdn-icons-png.flaticon.com/512/3721/3721619.png"},
            {"B1", "https://cdn-icons-png.flaticon.com/512/2554/2554896.png"},
            {"C", "https://cdn-icons-png.flaticon.com/512/2554/2554978.png" }
        };
            string icon_link = string.Empty;
            if (licenseIcons.TryGetValue(licenseid.ToUpper(), out icon_link))
            {
                icon_link = licenseIcons[licenseid.ToUpper()];
            }
            ViewBag.icon_link = icon_link;
            return View(@$"~/Views/LicensePage/{licenseid.ToUpper()}.cshtml");
        }
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult Intro()
        {
            ViewBag.icon_link = "https://cdn-icons-png.flaticon.com/512/3930/3930246.png";
            return View("~/Views/AboutUs.cshtml");
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}