using Driving_License.Models;

namespace Driving_License.ViewModels
{
    public class QuizViewModels
    {
        public Quiz CurrentQuiz { get; set; }
        public Question CurrentQuestion { get; set; }
        public string AnswerIDString { get; set; }
        public int AnsweredQuestionCount {get; set;}
    }
}