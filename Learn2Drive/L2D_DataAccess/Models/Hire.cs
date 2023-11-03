using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Hire
{
    public Guid HireId { get; set; }

    public Guid TeacherId { get; set; }

    public Guid UserId { get; set; }

    public DateTime HireDate { get; set; }

    public string Status { get; set; }

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();

    public virtual Teacher Teacher { get; set; }

    public virtual User User { get; set; }
}
