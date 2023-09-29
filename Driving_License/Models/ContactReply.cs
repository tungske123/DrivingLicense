namespace Driving_License.Models
{
    public class ContactReply
    {
        public Guid ReplyId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string ReplyTitle { get; set; }
        public string ReplyMessage { get; set; }
        public Guid ContactID { get; set; }//Reference Contact.cs

    }
}
