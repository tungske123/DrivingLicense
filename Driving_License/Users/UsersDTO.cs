using System;

namespace Driving_License.Users
{
    public class UsersDTO
    {
        public Guid UserID { get; set; }
        public string Avatar { get; set; }
        public string CCCD { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public string Nationality { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
    }
}