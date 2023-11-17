using L2D_DataAccess.Models;

namespace L2D_DataAccess.ViewModels
{
    public class QuizViewModels
    {
        public Quiz CurrentQuiz { get; set; }
        public Question CurrentQuestion { get; set; }
        public string AnswerIDString { get; set; }
        public int AnsweredQuestionCount {get; set;}
    }
}