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
        [Route("api/license")]  //https://localhost:7235/license
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
        public async Task<IActionResult> GetLicenseById(string licenseid)
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
            try
            {
                await _context.Licenses.AddAsync(license);
                await _context.SaveChangesAsync();
                return Ok("Them bang lai thanh cong");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred when processing request: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("api/license/update/{lid}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateLicense([FromRoute] string lid, [FromBody] License license)
        {
            if (lid == string.Empty || license is null)
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
            findlicense.Condition = license.Condition;
            findlicense.Cost = license.Cost;
            findlicense.Describe = license.Describe;
            findlicense.LicenseId = lid;
            findlicense.Time = license.Time;
            findlicense.ExamContent = license.ExamContent;
            findlicense.LicenseName = license.LicenseName;
            findlicense.Tips = license.Tips;

            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpDelete]
        [Route("api/license/delete/{lid}")]
        public async Task<IActionResult> DeleteRent([FromRoute] string lid)
        {
            License findlicense = await _context.Licenses.SingleOrDefaultAsync(license => license.LicenseId.Equals( lid));
            if(findlicense is null)
            {
                return NotFound("Khong tim thay bang lai");
            }
            _context.Licenses.Remove(findlicense);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
