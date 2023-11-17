using L2D_DataAccess.Utils;
using L2D_DataAccess.ViewModels;
using Microsoft.Data.SqlClient;
namespace L2D_DataAccess.Repositories
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
                        AttemptID = AttemptID,
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
                        IsCorrect = reader["IsCorrect"] != DBNull.Value ? (int)reader["IsCorrect"] : 0  // Default to 0 if DBNull
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

        public async Task<List<QuizResult>> GetQuizAttemptDataFromUser(Guid UserId)
        {
            var quizResultList = new List<QuizResult>();
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("dbo.proc_getAllAttemptsDataFromUsers", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserId", UserId);
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    quizResultList.Add(new QuizResult
                    {
                        AttemptID = (Guid)(reader["AttemptID"]),
                        QuizName = reader["QuizName"] as string,
                        License = reader["License"] as string,
                        AttemptDate = Convert.ToDateTime(reader["AttemptDate"]),
                        TotalQuestion = Convert.ToInt32(reader["TotalQuestion"]),
                        CorrectQuestion = Convert.ToInt32(reader["CorrectQuestion"]),
                        IncorrectQuestion = Convert.ToInt32(reader["IncorrectQuestion"]),
                        RemainingQuestion = Convert.ToInt32(reader["RemainingQuestion"]),
                        Result = Convert.ToDecimal(reader["Result"])
                    });
                }
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync(ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
            return quizResultList;
        }

        public async Task GenerateQuizQuestions(string QuizName, string LicenseID, string Description, int Quantity = 25)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand("[dbo].[proc_CreateQuiz]", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@Name", QuizName);
                command.Parameters.AddWithValue("@LicenseID", LicenseID);
                command.Parameters.AddWithValue("@Description", Description);
                command.Parameters.AddWithValue("@Quantity", Quantity);
                await command.ExecuteNonQueryAsync();
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync($"Generate quiz questions error: {ex.Message}");
            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        //public async Task DeleteQuiz(int QuizId)
        //{

        //}
    }
}