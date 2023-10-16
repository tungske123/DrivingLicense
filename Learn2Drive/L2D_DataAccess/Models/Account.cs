using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Account
{
    public Guid AccountId { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string Role { get; set; }

    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
