using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Response
{
    public Guid ResponseId { get; set; }

    public Guid? StaffId { get; set; }

    public Guid? FeedbackId { get; set; }

    public Guid? UserId { get; set; }

    public DateTime? ResponseDate { get; set; }

    public string ReplierName { get; set; }

    public string ReplyContent { get; set; }

    public virtual Feedback Feedback { get; set; }

    public virtual Staff Staff { get; set; }

    public virtual User User { get; set; }
}
