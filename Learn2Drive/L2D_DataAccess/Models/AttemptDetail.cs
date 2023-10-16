using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class AttemptDetail
{
    public Guid AttemptDetailId { get; set; }

    public Guid? AttemptId { get; set; }

    public int QuestionId { get; set; }

    public int SelectedAnswerId { get; set; }

    public bool IsCorrect { get; set; }

    public virtual Attempt Attempt { get; set; }

    public virtual Question Question { get; set; } = null!;

    public virtual Answer SelectedAnswer { get; set; }
}
