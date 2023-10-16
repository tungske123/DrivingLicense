using Driving_License.Filters;
using L2D_DataAccess.Models;
using L2D_DataAccess.Repositories;
using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace Driving_License.Controllers
{
    [LoginFilter]
    public class UserController : Controller
    {
        private readonly DrivingLicenseContext _context;

        public UserController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            const string UserProfileViewPath = "~/Views/UserProfile.cshtml";
            var usersession = JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));
            if (usersession.Role.Equals("user"))
            {
                var user = await _context.Users
                    .AsNoTracking()
                    .SingleOrDefaultAsync(u => u.AccountId.Equals(usersession.AccountId));
                ViewBag.user = user;
            }
            return View(UserProfileViewPath);
        }

        [HttpPost]
        public async Task<IActionResult> EditInfo(IFormCollection form)
        {
            string FullName = form["FullName"];
            string Email = form["Email"];
            string Nationality = form["Nationality"];
            string CCCD = form["CCCD"];
            string Address = form["Address"];
            string PhoneNumber = form["PhoneNumber"];
            string BirthDate = form["BirthDate"];
            System.Console.WriteLine("User birthdate: " + BirthDate);
            var filesend = form.Files["Avatar"];
            var usersession = JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));
            var user = await _context.Users
                .AsNoTracking().SingleOrDefaultAsync(u => u.AccountId.Equals(usersession.AccountId));

            user.FullName = FullName;
            user.BirthDate = !BirthDate.IsNullOrEmpty() ? DateTime.Parse(BirthDate) : DateTime.MinValue;
            user.Email = Email;
            user.Nationality = Nationality;
            user.PhoneNumber = PhoneNumber;
            user.Address = Address;
            user.Cccd = CCCD;

            if (filesend is not null)
            {
                var filePath = Path.Combine("wwwroot/img/Avatar", user.UserId.ToString() + Path.GetExtension(filesend.FileName));
                using var filestream = new FileStream(filePath, FileMode.Create);
                try
                {
                    await filesend.CopyToAsync(filestream);
                    user.Avatar = user.UserId.ToString() + Path.GetExtension(filesend.FileName);
                }
                catch (Exception ex)
                {

                    System.Console.WriteLine("Update user error: " + ex.Message);
                }
                finally
                {

                    filestream.Close();
                }
            }
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "User");
        }

        public async Task<IActionResult> ViewExamForm()
        {
            var usersession = JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));
            var user = await _context.Users
                .AsNoTracking().SingleOrDefaultAsync(u => u.AccountId.Equals(usersession.AccountId));
            ViewBag.user = user;
            return View("~/Views/ExamResigter.cshtml");
        }

        [HttpGet]
        [Route("api/users/profile/{id:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetUserProfileInfo([FromRoute] Guid id)
        {

            var QuizAttemptData = await QuizRepository.Instance.GetQuizAttemptDataFromUser(id);
            var UserData = await _context.Users
            .Where(u => u.UserId.Equals(id))
            .Select(u => new
            {
                UserID = u.UserId,
                AccountID = u.AccountId,
                Avatar = u.Avatar ?? string.Empty,
                CCCD = u.Cccd ?? string.Empty,
                Email = u.Email ?? string.Empty,
                FullName = u.FullName ?? string.Empty,
                BirthDate = u.BirthDate,
                Nationality = u.Nationality ?? string.Empty,
                PhoneNumber = u.PhoneNumber ?? string.Empty,
                Address = u.Address ?? string.Empty,
                RentData = _context.Rents
                .Where(rent => rent.UserId.Equals(id))
                .Select(rent => new
                {
                    RentId = rent.RentId,
                    VehicleName = _context.Vehicles
                    .Where(v => v.VehicleId.Equals(rent.VehicleId))
                    .Select(v => v.Name).AsNoTracking().FirstOrDefault(),
                    StartDate = rent.StartDate,
                    EndDate = rent.EndDate,
                    TotalRentPrice = rent.TotalRentPrice,
                    Status = rent.Status
                })
                .ToList(),
                QuizAttemptData = QuizAttemptData
            })
            .AsNoTracking()
            .FirstOrDefaultAsync();
            if (UserData is null)
            {
                return NotFound($"Can't find any users with id {id}");
            }
            return Ok(UserData);
        }
    }
}
