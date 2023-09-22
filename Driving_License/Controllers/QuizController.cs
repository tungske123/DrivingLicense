using Driving_License.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Driving_License.ViewModels;
using System.Text.Json;
using System.ComponentModel;
using Driving_License.Utils;

namespace Driving_License.Controllers
{
    public class QuizController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public QuizController(DrivingLicenseContext context)
        {
            _context = context;
        }
        public async Task<PageResult<T>> GetPagedDataAsync<T>(IQueryable<T> query, int page, int pageSize)
        {
            //Get total number of rows in table
            int totalCount = await query.CountAsync();

            //Calculate total pages
            int totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
            int takingNums = pageSize;
            int skipNums = (page - 1) * pageSize;
            if (totalCount < pageSize)
            {
                takingNums = totalCount;    
            }
            List<T> items = await query.Skip(skipNums)
                                       .Take(takingNums)
                                       .ToListAsync();
            return new PageResult<T>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                PageNumber = page,
                PageSize = pageSize,
                Items = items
            };
        }
        public async Task<string> getUserIDFromSession()
        {
            string AccountID = string.Empty;
            var usersession = HttpContext.Session.GetString("usersession");
            if (!string.IsNullOrEmpty(usersession))
            {
                AccountID = JsonSerializer.Deserialize<Account>(usersession).AccountId.ToString();
            }
            var user = await _context.Users.FirstOrDefaultAsync(user => user.AccountId.Equals(AccountID));
            return (user is not null) ? user.UserId.ToString() : string.Empty;
        }
        public async Task<IActionResult> Index(string licenseid, string status, int page = 1, int pageSize = 4)
        {
            //Get all data from quiz table
            IQueryable<Quiz> query = _context.Quizzes.AsQueryable();
            //Apply filtering
            bool isValidLicenseID = !string.IsNullOrEmpty(licenseid) && !licenseid.Equals("none");
            if (isValidLicenseID)
            {
                query = query.Where(quiz => quiz.LicenseId.Equals(licenseid.ToUpper()));
            }
            if (!string.IsNullOrEmpty(status) && !status.Equals("none"))
            {
                //string UserID = await getUserIDFromSession();
                //Ignore the status 
            }
            query = query.OrderBy(quiz => quiz.Name);
            PageResult<Quiz> pageResult = await GetPagedDataAsync(query, page, pageSize);
            ViewBag.licenseid = (isValidLicenseID) ? licenseid : string.Empty;
            return View("~/Views/SelectQuizPage.cshtml", pageResult);
        }
    }
}
