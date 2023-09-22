using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Teacher
{
    public Guid TeacherId { get; set; }

    public Guid? AccountId { get; set; }

    public string FullName { get; set; }

    public string Information { get; set; }

    public string ContactNumber { get; set; }

    public string Email { get; set; }

    public virtual Account Account { get; set; }

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
