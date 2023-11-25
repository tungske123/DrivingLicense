using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
namespace L2D_WebApp.Utils
{
    public class ImageUtils
    {
        private readonly IHostEnvironment _env;
        public ImageUtils(IHostEnvironment env) => _env = env;

        public async Task CreateImageAsync(IFormFile file, string path)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", path);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        public async Task UpdateImageAsync(IFormFile file, string path)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", path);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        public async Task DeleteImageAsync(string path)
        {
            var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", path);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            //Wait for the delete operation to be completed
            await Task.CompletedTask;
        }
    }
}
