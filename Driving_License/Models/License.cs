using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class License
{
    public string LicenseId { get; set; }

    public string LicenseName { get; set; }

    public string Describe { get; set; }

    public string Condition { get; set; }

    public string Cost { get; set; }

    public string Time { get; set; }

    public string ExamContent { get; set; }

    public string Tips { get; set; }

    public virtual ICollection<ExamProfile> ExamProfiles { get; set; } = new List<ExamProfile>();

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
