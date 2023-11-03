using System;
using System.Collections.Generic;

namespace L2D_DataAccess.Models;

public partial class VwGetAllAccountEmail
{
    public string Role { get; set; }

    public Guid AccountId { get; set; }

    public string Email { get; set; }
}
