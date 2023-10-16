using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Rent
{
    public Guid RentId { get; set; }

    public Guid VehicleId { get; set; }

    public Guid UserId { get; set; }

    public DateTime StartDate { get; set; } = DateTime.MinValue;

    public DateTime EndDate { get; set; } = DateTime.MinValue;

    public decimal TotalRentPrice { get; set; }

    public string Status { get; set; }

    public virtual User User { get; set; }

    public virtual Vehicle Vehicle { get; set; }
}
