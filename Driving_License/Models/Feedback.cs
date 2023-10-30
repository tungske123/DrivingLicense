using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public Guid? UserId { get; set; }

    public DateTime? FeedbackDate { get; set; }

    public string SenderName { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public string Status { get; set; }

    public virtual ICollection<Response> Responses { get; set; } = new List<Response>();

    public virtual User User { get; set; }
}
