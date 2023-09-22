using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Quiz
{
    public int QuizId { get; set; }

    public string LicenseId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public virtual ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();

    public virtual License License { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
