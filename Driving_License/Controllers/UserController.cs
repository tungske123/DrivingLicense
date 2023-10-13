using Driving_License.Utils;
using Microsoft.AspNetCore.Mvc;

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
    }
}
