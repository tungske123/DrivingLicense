namespace Driving_License.ViewModels
{
    public class QuizResult
    {
        public int CorrectQuestion {get; set;}
        public int IncorrectQuestion {get; set;}
        public int RemainingQuestion {get; set;}
        public int TotalQuestion {get; set;}
        public decimal Result {get; set;}
        
    }
}