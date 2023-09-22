using Microsoft.EntityFrameworkCore;

namespace Driving_License.ViewModels
{
    public class PageResult<T>
    {
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<T> Items { get; set; }
    }
}
