using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Vehicle
{
    public Guid VehicleId { get; set; }

    public string Name { get; set; }

    public string Image { get; set; }

    public string Brand { get; set; }

    public string Type { get; set; }

    public int Years { get; set; }

    public string ContactNumber { get; set; }

    public string Address { get; set; }

    public decimal RentPrice { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<Rent> Rents { get; set; } = new List<Rent>();
}
