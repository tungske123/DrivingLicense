using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class ExamProfile
{
    public Guid ExamProfileId { get; set; }

    public Guid? UserId { get; set; }

    public string LicenseId { get; set; }

    public DateTime? ExamDate { get; set; }

    public string ExamResult { get; set; }

    public string HealthCondition { get; set; }

    public string Status { get; set; }

    public virtual License License { get; set; }

    public virtual User User { get; set; }
}
