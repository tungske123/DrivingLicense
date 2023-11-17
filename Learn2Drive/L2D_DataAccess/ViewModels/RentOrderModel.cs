using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace L2D_DataAccess.ViewModels
{
    public class RentOrderModel
    {
        public Guid VehicleID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalRentPrice { get; set; }
    }
}
