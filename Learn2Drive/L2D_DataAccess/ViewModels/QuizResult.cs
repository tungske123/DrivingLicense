using System.ComponentModel.DataAnnotations;

namespace L2D_DataAccess.ViewModels
{
    public class QuizResult
    {
        public Guid AttemptID { get; set; }
        public string QuizName { get; set; }
        public string License { get; set; }
        public DateTime AttemptDate { get; set; }
        public int TotalQuestion { get; set; }
        public int CorrectQuestion { get; set; }
        public int IncorrectQuestion { get; set; }
        public int RemainingQuestion { get; set; }
        public decimal Result { get; set; }
        public List<QuizQuestionData> QuestionDataList { get; set; } = new List<QuizQuestionData>();
    }

}