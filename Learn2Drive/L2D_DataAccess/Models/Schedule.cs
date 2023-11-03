using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Schedule
{
    public Guid ScheduleId { get; set; }

    public Guid HireId { get; set; }

    public string LicenseId { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public DateTime Date { get; set; }

    public string Address { get; set; }

    public string Status { get; set; }

    public virtual Hire Hire { get; set; }

    public virtual License License { get; set; }
}
