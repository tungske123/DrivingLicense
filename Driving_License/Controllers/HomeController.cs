using Driving_License.Models;
using Driving_License.Utils;
using Driving_License.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging.Rules;
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
            //    //Key: LicenseID, Value: the link to the icon img of the page
            //    IDictionary<string, string> licenseIcons = new Dictionary<string, string>()
            //{
            //    {"A1", "https://cdn-icons-png.flaticon.com/512/3721/3721619.png"},
            //    {"B1", "https://cdn-icons-png.flaticon.com/512/2554/2554896.png"},
            //    {"C", "https://cdn-icons-png.flaticon.com/512/2554/2554978.png" }
            //};

            //    string icon_link = string.Empty;
            //    if (licenseIcons.TryGetValue(licenseid.ToUpper(), out icon_link))
            //    {
            //        icon_link = licenseIcons[licenseid.ToUpper()];
            //    }
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

                _ => string.Empty
            };
            ViewBag.icon_link = icon_link;
            ViewBag.image_link = image_link;
            ViewBag.licenseid = licenseid;
            return View(@$"~/Views/LicensePage/License.cshtml");
        }

        [HttpGet]
        [Route("license")]  //https://localhost:7002/license
        public async Task<IActionResult> GetAllLicense()
        {
            var _context = new DrivingLicenseContext();
            try
            {
                var licenselist = await _context.Licenses.ToListAsync();
                return Ok(licenselist);
            } catch (Exception ex)
            {
                return BadRequest("Lỗi trong quá trình xử lý yêu cầu");
            }
        }
        [HttpGet]
        [Route("license/{licenseid}")] //https://localhost:7002/license/A2
        public async Task<IActionResult> GetLicenseById(string licenseid)
        {
            var _context = new DrivingLicenseContext();
            try
            {
                var license = await _context.Licenses.SingleOrDefaultAsync(license => license.LicenseId.Equals(licenseid));
                if(license == null)
                {
                    return NotFound("Không tìm thấy bằng lái.");
                }
                return Ok(license);
            }catch (Exception ex)
            {
                return BadRequest("Lỗi trong quá trình xử lý yêu cầu");
            }
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