using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class License
{
    public string LicenseId { get; set; }

    public string LicenseName { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
