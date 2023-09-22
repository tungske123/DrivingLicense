namespace Driving_License.Models.Accounts
{
    public class AccountDTO
    {
        public Guid AccountID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
