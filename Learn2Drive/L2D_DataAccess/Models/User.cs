using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models
{
    public partial class User
    {
        public Guid UserId { get; set; }

        public Guid AccountId { get; set; }

        public string Avatar { get; set; }

        public string Cccd { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }

        public DateTime BirthDate { get; set; } = DateTime.MinValue;

        public string Nationality { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public virtual Account Account { get; set; }

        public virtual ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();

        public virtual ICollection<Rent> Rents { get; set; } = new List<Rent>();

        public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }
}
