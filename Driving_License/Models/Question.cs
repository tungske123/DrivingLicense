using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Question
{
    public int QuestionId { get; set; }

    public string LicenseId { get; set; }

    public string QuestionText { get; set; }

    public string QuestionImage { get; set; }

    public bool? IsCritical { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual ICollection<AttemptDetail> AttemptDetails { get; set; } = new List<AttemptDetail>();

    public virtual License License { get; set; }

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
