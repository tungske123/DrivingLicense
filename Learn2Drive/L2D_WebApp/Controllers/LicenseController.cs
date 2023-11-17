using L2D_DataAccess.Models;
using L2D_DataAccess.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace L2D_WebApp.Controllers
{
    [ApiController]
    public class LicenseController : ControllerBase
    {
        private readonly DrivingLicenseContext _context;

        public LicenseController(DrivingLicenseContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("api/licenses")]  //https://localhost:7235/licenses
        [Produces("application/json")]
        public async Task<IActionResult> GetAllLicense()
        {
            try
            {
                var licenselist = await _context.Licenses.AsNoTracking().ToListAsync();
                return Ok(licenselist);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred when processing request: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("api/license/{licenseid}")] //https://localhost:7235/license/A2
        [Produces("application/json")]
        public async Task<IActionResult> GetLicenseById([FromRoute] string licenseid)
        {
            try
            {
                var license = await _context.Licenses.AsNoTracking().SingleOrDefaultAsync(license => license.LicenseId.Equals(licenseid));
                if (license is null)
                {
                    return NotFound($"Can't find any license with id {licenseid}");
                }
                return Ok(license);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred when processing request: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("api/license/insert")]
        [Produces("application/json")]
        public async Task<IActionResult> AddLicense([FromBody] License license)
        {
            if (license is null)
            {
                return BadRequest("Can't find any license data to insert");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Licenses.AddAsync(license);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok("Them bang lai thanh cong");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred when processing request: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("api/license/update/{lid}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateLicense([FromRoute] string lid, [FromBody] License license)
        {
            if (string.IsNullOrEmpty(lid))
            {
                return BadRequest();
            }

            var findlicense = await _context.Licenses.SingleOrDefaultAsync(license => license.LicenseId.Equals(lid));

            if (findlicense is null)
            {
                return NotFound("Can't find any license");
            }

            if (!lid.Equals(license.LicenseId))
            {
                return BadRequest("licenseid do not match");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Licenses.Where(l => l.LicenseId.Equals(lid))
                    .ExecuteUpdateAsync(setters => setters
                    .SetProperty(l => l.Condition, license.Condition)
                    .SetProperty(l => l.Cost, license.Cost)
                    .SetProperty(l => l.Describe, license.Describe)
                    .SetProperty(l => l.Time, license.Time)
                    .SetProperty(l => l.ExamContent, license.ExamContent)
                    .SetProperty(l => l.LicenseName, license.LicenseName)
                    .SetProperty(l => l.Tips, license.Tips));

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred during the request: {ex.Message}");
            }

            return Ok();
        }


        [HttpDelete]
        [Route("api/license/delete/{lid}")]
        public async Task<IActionResult> DeleteRent([FromRoute] string lid)
        {
            License findlicense = await _context.Licenses.SingleOrDefaultAsync(license => license.LicenseId.Equals(lid));

            if (findlicense is null)
            {
                return NotFound($"Can't find any license with id {lid}");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Licenses.Where(l => l.LicenseId.Equals(lid)).ExecuteDeleteAsync();
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest($"An error occurred during the request: {ex.Message}");
            }
            return Ok();
        }
    }
}
