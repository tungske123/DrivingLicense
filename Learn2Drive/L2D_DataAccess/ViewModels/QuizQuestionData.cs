using System.ComponentModel.DataAnnotations;
namespace L2D_DataAccess.ViewModels
{
    public class QuizQuestionData
    {
        [Key]
        public string QuestionText { get; set; }
        public string UserAnswer { get; set; }
        public string CorrectAnswer { get; set; }
        public int IsCorrect { get; set; }
    }
}