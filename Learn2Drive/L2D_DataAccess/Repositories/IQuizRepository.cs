using L2D_DataAccess.ViewModels;
namespace L2D_DataAccess.Repositories
{
    public interface IQuizRepository
    {
        public Task<QuizResult> CalculateQuizResult(Guid AttemptID);
        public Task<List<QuizQuestionData>> GetQuizAttemptStats(Guid AttemptID);
    }
}