using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Answer
{
    public int AnswerId { get; set; }

    public int QuestionId { get; set; }

    public bool IsCorrect { get; set; }

    public string AnswerText { get; set; }

    public string AnswerImage { get; set; }

    public virtual ICollection<AttemptDetail> AttemptDetails { get; set; } = new List<AttemptDetail>();

    public virtual Question Question { get; set; }
}
