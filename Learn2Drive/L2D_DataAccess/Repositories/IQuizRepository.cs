using L2D_DataAccess.ViewModels;
namespace L2D_DataAccess.Repositories
{
    public interface IQuizRepository
    {
        public Task<QuizResult> CalculateQuizResult(Guid AttemptID);
        public Task<List<QuizQuestionData>> GetQuizAttemptStats(Guid AttemptID);
        public Task<List<QuizResult>> GetQuizAttemptDataFromUser(Guid UserId);
        public Task GenerateQuizQuestions(string QuizName, string LicenseID, string Description, int Quantity = 25);
    }
}