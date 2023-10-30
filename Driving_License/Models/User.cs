using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class User
{
    public Guid UserId { get; set; }

    public Guid? AccountId { get; set; }

    public string Avatar { get; set; }

    public string Cccd { get; set; }

    public string Email { get; set; }

    public string FullName { get; set; }

    public DateTime? BirthDate { get; set; }

    public string Nationality { get; set; }

    public string PhoneNumber { get; set; }

    public string Address { get; set; }

    public virtual Account Account { get; set; }

    public virtual ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();

    public virtual ICollection<ExamProfile> ExamProfiles { get; set; } = new List<ExamProfile>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Hire> Hires { get; set; } = new List<Hire>();

    public virtual ICollection<Rent> Rents { get; set; } = new List<Rent>();

    public virtual ICollection<Response> Responses { get; set; } = new List<Response>();
}
