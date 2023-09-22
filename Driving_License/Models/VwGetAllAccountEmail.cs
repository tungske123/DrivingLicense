using System;
using System.Collections.Generic;

namespace Driving_License.Models;

public partial class VwGetAllAccountEmail
{
    public string Role { get; set; }

    public Guid? AccountId { get; set; }

    public string Email { get; set; }
}
