using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class Admin
{
    public Guid AdminId { get; set; }

    public Guid AccountId { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    public string ContactNumber { get; set; }

    public virtual Account Account { get; set; }
}
