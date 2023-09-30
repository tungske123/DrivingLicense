using Microsoft.AspNetCore.Mvc;

namespace Driving_License.Controllers
{
    public class ManageController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/Home/Admin.cshtml");
        }
        public IActionResult Quiz()
        {
            return View("~/Views/Manage/Quizzes.cshtml");
        }
    }
}
