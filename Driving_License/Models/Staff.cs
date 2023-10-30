using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Staff
{
    public Guid StaffId { get; set; }

    public Guid? AccountId { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    public string ContactNumber { get; set; }

    public virtual Account Account { get; set; }

    public virtual ICollection<Response> Responses { get; set; } = new List<Response>();

    public virtual ICollection<Statistic> Statistics { get; set; } = new List<Statistic>();
}
