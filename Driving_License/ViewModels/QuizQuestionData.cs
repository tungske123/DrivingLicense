using System.ComponentModel.DataAnnotations;
namespace Driving_License.ViewModels
{
    public class QuizQuestionData
    {
        [Key]
        public string QuestionText { get; set; }
        public string UserAnswer { get; set; }
        public string CorrectAnswer { get; set; }
        public bool IsCorrect { get; set; }
    }
}