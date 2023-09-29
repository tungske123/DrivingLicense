using Microsoft.AspNetCore.Mvc;

namespace Driving_License.Controllers
{
    public class ManageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Quiz()
        {
            return View("~/Views/Manage/Quizzes.cshtml");
        }
        public IActionResult Contact()
        {
            return View("~/Views/Manage/Feedbacks.cshtml");
        }
    }
}
