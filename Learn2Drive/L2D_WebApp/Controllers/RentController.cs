using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Driving_License.Filters;
using System.Net.Mail;
using System.Text.Json;
using X.PagedList;
using Microsoft.VisualBasic;

namespace Driving_License.Controllers
{
    public record VehicleRequestData
    {
        public string Keyword { get; set; }
        public List<string> Types { get; set; }
        public List<string> Brands { get; set; }
        public decimal StartPrice { get; set; } = Decimal.MinusOne;
        public decimal EndPrice { get; set; } = Decimal.MinusOne;
    }
    public record RentHistoryData
    {
        public string Keyword { get; set; }
        public int DayRangeValue { get; set; } = -1;
    }
    //[LoginFilter]
    public class RentController : Controller
    {

        private readonly DrivingLicenseContext _context;

        public RentController(DrivingLicenseContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var rentViewModel = new RentViewModel();
            rentViewModel.BrandList = await _context.Vehicles.Select(vehicle => vehicle.Brand).Distinct().AsNoTracking().ToListAsync();
            rentViewModel.TypeList = await _context.Vehicles.Select(vehicle => vehicle.Type).Distinct().AsNoTracking().ToListAsync();
            return View("~/Views/Rent.cshtml", rentViewModel);
        }

        public async Task<IActionResult> RentDetail(Guid vid)
        {
            var vehicle = await _context.Vehicles.AsNoTracking().SingleOrDefaultAsync(v => v.VehicleId.Equals(vid));
            return View("~/Views/RentDetail.cshtml", vehicle);
        }

        public async Task<string> getUserIDFromSession()
        {
            string AccountID = string.Empty;
            var usersession = JsonSerializer.Deserialize<Account>(HttpContext.Session.GetString("usersession"));

            var user = await _context.Users.SingleOrDefaultAsync(user => user.AccountId.Equals(usersession.AccountId));
            return (user is not null) ? user.UserId.ToString() : string.Empty;
        }

        [HttpPost]
        [Route("api/rent/insert/{id:guid}")]
        public async Task<IActionResult> AddRentAPI([FromRoute] Guid id, [FromBody] Rent rent)
        {
            var UserIDString = await getUserIDFromSession();
            rent.UserId = Guid.Parse(UserIDString);
            rent.Status = "true";
            await _context.AddAsync(rent);
            await _context.SaveChangesAsync();
            return Ok();
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

        public async Task<PageResult<Rent>> GetRentHistoryDataPaging(IQueryable<Rent> query, int page, int pageSize)
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
            List<Rent> items = await query.Include(rent => rent.Vehicle)
                                       .Skip(skipNums)
                                       .Take(takingNums)
                                       .ToListAsync();
            return new PageResult<Rent>
            {
                TotalCount = totalCount,
                TotalPages = totalPages,
                PageNumber = page,
                PageSize = pageSize,
                Items = items
            };
        }

        [HttpGet]
        [Route("api/vehicles")]
        [Produces("application/json")]
        public async Task<IActionResult> Vehicles()
        {
            var vehicleList = await _context.Vehicles.AsNoTracking().ToListAsync();
            return Ok(vehicleList);
        }

        [HttpPost]
        [Route("api/rent/{page}")]
        [Produces("application/json")]
        public async Task<IActionResult> Page([FromBody] VehicleRequestData data, [FromRoute] int page = 1)
        {
            const int pageSize = 8;
            IQueryable<Vehicle> query = _context.Vehicles.AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(vehicle => EF.Functions.Like(vehicle.Name, $"%{data.Keyword}%"));
                //query = query.Where(vehicle => vehicle.Name.Contains(data.Keyword));
            }
            if (data.Types.Count > 0)
            {
                foreach (var type in data.Types)
                {
                    query = query.Where(vehicle => data.Types.Contains(vehicle.Type));
                }
            }
            if (data.Brands.Count > 0)
            {
                foreach (var brand in data.Brands)
                {
                    query = query.Where(vehicle => data.Brands.Contains(vehicle.Brand));
                }
            }
            if (data.StartPrice != Decimal.MinusOne)
            {
                query = query.Where(vehicle => vehicle.RentPrice >= data.StartPrice);
            }
            if (data.EndPrice != Decimal.MinusOne)
            {
                query = query.Where(vehicle => vehicle.RentPrice <= data.EndPrice);
            }
            query = query.OrderBy(vehicle => vehicle.Name);
            PageResult<Vehicle> pageResult = await GetPagedDataAsync<Vehicle>(query, page, pageSize);
            return Ok(pageResult);
        }

        [HttpGet]
        [Route("api/rent/topone")]
        [Produces("application/json")]
        public async Task<IActionResult> GetTop1RentVehicle()
        {
            int RentCount = await _context.Rents.CountAsync();
            if (RentCount == 0)
            {
                return NotFound();
            }
            var vehicleWithMostRents = await _context.Rents
                .GroupBy(r => r.VehicleId)
                .Select(g => new
                {
                    VehicleID = g.Key,
                    RentCount = g.Count()
                })
                .OrderByDescending(g => g.RentCount)
                .Join(_context.Vehicles, rent => rent.VehicleID,
                vehicle => vehicle.VehicleId, (rent, vehicle) => new
                {
                    Vehicle = vehicle,
                    RentCount = rent.RentCount
                }).AsNoTracking().FirstOrDefaultAsync();
            return Ok(vehicleWithMostRents);
        }


        [HttpPost]
        [Route("api/rent/filter/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRentByDate([FromRoute] Guid uid, [FromBody] RentHistoryData data)
        {
            if (await _context.Users.AnyAsync(user => user.UserId.Equals(uid)) == false)
            {
                return NotFound();
            }
            var query = _context.Rents.Where(rent => rent.UserId.Equals(uid)).AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(rent => EF.Functions.Like(rent.Vehicle.Name, $"%{data.Keyword}%"));
            }
            if (data.DayRangeValue > 0)
            {
                DateTime Today = DateTime.Today;
                DateTime MarkDay = Today.AddDays((-1) * data.DayRangeValue);
                query = query.Where(rent => rent.StartDate >= MarkDay && rent.StartDate <= Today);
            }
            var rentDataList = await query
            .OrderBy(rent => rent.StartDate)
            .Select(rent => new
            {
                RentId = rent.RentId,
                VehicleName = rent.Vehicle.Name,
                StartDate = rent.StartDate,
                EndDate = rent.EndDate,
                TotalRentPrice = rent.TotalRentPrice,
                Status = rent.Status
            }).ToListAsync();
            return Ok(rentDataList);
        }

        [HttpPost]
        [Route("api/rent/filter/page/{uid:guid}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetRentDataPaging([FromRoute] Guid uid, [FromBody] RentHistoryData data, int page = 1)
        {
            if (await _context.Users.AnyAsync(user => user.UserId.Equals(uid)) == false)
            {
                return NotFound();
            }
            var query = _context.Rents.Where(rent => rent.UserId.Equals(uid)).AsQueryable();
            if (!string.IsNullOrEmpty(data.Keyword))
            {
                query = query.Where(rent => EF.Functions.Like(rent.Vehicle.Name, $"%{data.Keyword}%"));
            }
            if (data.DayRangeValue > 0)
            {
                DateTime Today = DateTime.Today;
                DateTime MarkDay = Today.AddDays((-1) * data.DayRangeValue);
                query = query.Where(rent => rent.StartDate >= MarkDay && rent.StartDate <= Today);
            }
            query = query.OrderBy(rent => rent.StartDate);


            const int pageSize = 8;
            var PagingResult = await GetRentHistoryDataPaging(query, page, pageSize);
            var finalRentHistoryData = new
            {
                TotalCount = PagingResult.TotalCount,
                TotalPages = PagingResult.TotalPages,
                PageNumber = PagingResult.PageNumber,
                PageSize = PagingResult.PageSize,
                rentData = PagingResult.Items.Select(rent => new
                {
                    RentId = rent.RentId,
                    VehicleName = rent.Vehicle.Name,
                    StartDate = rent.StartDate,
                    EndDate = rent.EndDate,
                    TotalRentPrice = rent.TotalRentPrice,
                    Status = rent.Status
                }).ToList()
            };
            return Ok(finalRentHistoryData);
        }

        [HttpDelete]
        [Route("api/rent/delete/{uid:guid}")]
        public async Task<IActionResult> DeleteRent([FromRoute] Guid uid, Guid rid)
        {
            var userRent = await _context.Rents.FirstOrDefaultAsync(rent => rent.UserId.Equals(uid) && rent.RentId.Equals(rid));
            if (userRent is null)
            {
                return NotFound();
            }
            _context.Rents.Remove(userRent);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
