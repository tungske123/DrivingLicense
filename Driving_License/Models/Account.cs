using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class Account
{
    public Guid AccountId { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string Role { get; set; }

    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
