using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace L2D_WebApp.Controllers
{
    public class QuestionController : Controller
    {
        private readonly DrivingLicenseContext _context;
        public QuestionController(DrivingLicenseContext context) => _context = context;

        public record QuestionFilterData
        {
            public string Keyword { get; set; } 
            public string LicenseID { get; set; } 
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

        [HttpPost]
        [Route("api/questions/{page}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionsPaging([FromBody] QuestionFilterData data, [FromRoute] int page = 1)
        {
            var query = _context.Questions.AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(question => question.QuestionText.ToLower().Contains(data.Keyword.ToLower()));
            }
            if (!string.IsNullOrEmpty(data.LicenseID))
            {
                query = query.Where(question => question.LicenseId.Equals(data.LicenseID));
            }
            query = query.OrderBy(question => question.QuestionText);

            const int pageSize = 20;
            var pageResult = await GetPagedDataAsync<Question>(query, page, pageSize);
            return Ok(pageResult);
        }

        [HttpGet]
        [Route("api/questions/{qid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetQuestionByID(int qid)
        {
            if (qid <= 0)
            {
                return BadRequest();
            }
            var question = await _context.Questions
                .Include(question => question.Answers)
                .AsNoTracking().SingleOrDefaultAsync(q => q.QuestionId == qid);
            if (question is null)
            {
                return NotFound($"Can't find any questions with id {qid}");
            }
            return Ok(question);
        }
    }
}
