using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Schedule
{
    public Guid ScheduleId { get; set; }

    public Guid? TeacherId { get; set; }

    public Guid? UserId { get; set; }

    public string LicenseId { get; set; }

    public TimeSpan? StartTime { get; set; }

    public TimeSpan? EndTime { get; set; }

    public DateTime? Date { get; set; }

    public decimal? Price { get; set; }

    public string Address { get; set; }

    public string Status { get; set; }

    public virtual License License { get; set; }

    public virtual Teacher Teacher { get; set; }

    public virtual User User { get; set; }
}
