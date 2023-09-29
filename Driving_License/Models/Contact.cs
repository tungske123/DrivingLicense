namespace Driving_License.Models
{
    public class Contact
    {
        public Guid ContactID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public virtual ICollection<ContactReply> ContactReplys { get; set; } = new List<ContactReply>;
    }
}
