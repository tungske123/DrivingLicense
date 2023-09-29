using Driving_License.Utils;
using Driving_License.ViewModels;
using Microsoft.Data.SqlClient;

namespace Driving_License.Repositories
{
    public class QuizRepository : IQuizRepository
    {
        private static readonly Lazy<QuizRepository> lazy = new Lazy<QuizRepository>(() => new QuizRepository());
        public static QuizRepository Instance { get { return lazy.Value; } }
        private QuizRepository()
        {

        }
        public async Task<QuizResult> CalculateQuizResult(Guid AttemptID)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("dbo.proc_CalculateQuizResult", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@AttemptID", AttemptID);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new QuizResult
                    {
                        QuizName = reader["QuizName"] as string,
                        License = reader["License"] as string,
                        AttemptDate = Convert.ToDateTime(reader["AttemptDate"]),
                        TotalQuestion = (int)(reader["TotalQuestion"]),
                        CorrectQuestion = (int)(reader["CorrectQuestion"]),
                        IncorrectQuestion = (int)(reader["IncorrectQuestion"]),
                        RemainingQuestion = (int)(reader["RemainingQuestion"]),
                        Result = (decimal)(reader["Result"])
                    };
                }
            }
            catch (SqlException ex)
            {
                System.Console.WriteLine(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }

        public async Task<List<QuizQuestionData>> GetQuizAttemptStats(Guid AttemptID)
        {
            var QuizQuestionDataList = new List<QuizQuestionData>();
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("dbo.proc_GetQuizAttempStats", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@AttemptID", AttemptID);
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    QuizQuestionDataList.Add(new QuizQuestionData
                    {
                        QuestionText = reader["QuestionText"] as string,
                        UserAnswer = reader["UserAnswer"] as string,
                        CorrectAnswer = reader["CorrectAnswer"] as string,
                        IsCorrect = reader["IsCorrect"] != DBNull.Value ? (bool)reader["IsCorrect"] : false  // Default to 0 if DBNull
                    });
                }
            }
            catch (SqlException ex)
            {
                System.Console.WriteLine(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
            return QuizQuestionDataList;
        }
    }
}