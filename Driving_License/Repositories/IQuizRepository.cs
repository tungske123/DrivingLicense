using Driving_License.ViewModels;

namespace Driving_License.Repositories
{
    public interface IQuizRepository
    {
        public Task<QuizResult> CalculateQuizResult(Guid AttemptID);
        public Task<List<QuizQuestionData>> GetQuizAttemptStats(Guid AttemptID);
    }
}