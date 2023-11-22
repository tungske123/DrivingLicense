//using Driving_License.Models;
//using Driving_License.Models.Users;
using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.Json;

namespace L2D_WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly DrivingLicenseContext _context;

        public HomeController(ILogger<HomeController> logger, DrivingLicenseContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var accountsession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(accountsession))
            {
                var account = JsonSerializer.Deserialize<Account>(accountsession);
                if (account.Role.Equals("user"))
                {
                    var user = await _context.Users.SingleOrDefaultAsync(u => u.AccountId.Equals(account.AccountId));
                    ViewBag.UserId = user.UserId;
                }
            }
            ViewBag.icon_link = "/img/favicon_1.ico";
            return View("~/Views/Home/Home.cshtml");
        }
        public IActionResult License(string licenseid)
        {
            string icon_link = licenseid switch
            {
                "A1" => "https://cdn-icons-png.flaticon.com/512/3721/3721619.png",
                "B1" => "https://cdn-icons-png.flaticon.com/512/2554/2554896.png",
                "C" => "https://cdn-icons-png.flaticon.com/512/2554/2554978.png",
                _ => string.Empty
            };
            string image_link = licenseid switch
            {
                "A1" => "https://vcdn-vnexpress.vnecdn.net/2022/04/14/SYM-Elegant-110-8477-1649899780.jpg",
                "A2" => "https://vcdn-vnexpress.vnecdn.net/2022/04/14/SYM-Elegant-110-8477-1649899780.jpg",
                "A3" => "https://vcdn-vnexpress.vnecdn.net/2022/04/14/SYM-Elegant-110-8477-1649899780.jpg",
                "A4" => "https://vcdn-vnexpress.vnecdn.net/2022/04/14/SYM-Elegant-110-8477-1649899780.jpg",
                "B1" => "https://cdn.diemnhangroup.com/seoulacademy/2023/02/thi-sat-hach-lai-xe-b1-gom-nhung-gi-2.jpg",
                "B2" => "https://cdn.diemnhangroup.com/seoulacademy/2023/02/thi-sat-hach-lai-xe-b1-gom-nhung-gi-2.jpg",
                "C" => "https://banglaixeotohanoi.com/wp-content/uploads/2018/12/thi-bang-lai-xe-o-to-hang-c-1.jpg",
                "D" => "https://hoclaixethanhcong.vn/images/tin-tuc/tin-tuc-2/13/bang-lai-xe-hang-d-bao-nhieu-tuoi.jpg",
                _ => "https://static.chotot.com/storage/chotot-kinhnghiem/c2c/2019/11/bang-lai-xe-container.jpg"
            };

            ViewBag.icon_link = icon_link;
            ViewBag.image_link = image_link;
            ViewBag.licenseid = licenseid;
            return View(@$"~/Views/License.cshtml");
        }



        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Error404()
        {
            return View("~/Views/404NotFound.cshtml");
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