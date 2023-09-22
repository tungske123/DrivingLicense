using Driving_License.Utils;
using Microsoft.Data.SqlClient;

namespace Driving_License.Models.Accounts
{
    public sealed class AccountDAO
    {
        //Fields
        private static readonly Lazy<AccountDAO> lazy = new Lazy<AccountDAO>(() => new AccountDAO());
        public static AccountDAO Instance { get { return lazy.Value; } }

        //Constructor
        private AccountDAO()
        {

        }

        //Methods
        public async Task<AccountDTO> login(string username, string password)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            string query = "select * from dbo.Account" +
                "\nwhere Username = @username and Password = @password";
            try
            {
                await connection.OpenAsync();   
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@username", username);
                command.Parameters.AddWithValue("@password", password);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new AccountDTO()
                    {
                        AccountID = (Guid)(reader["AccountID"]),
                        Username = reader["Username"] as string,
                        Password = reader["Password"] as string,
                        Role = reader["Role"] as string
                    };
                }
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync("Login error: " + ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }

        public async Task SignUp(string username, string password, string email)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            const string procedureName = "dbo.proc_signUpAccount";
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(procedureName, connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@username", username);
                command.Parameters.AddWithValue("@password", password);
                command.Parameters.AddWithValue("@email", email);
                await command.ExecuteNonQueryAsync();   
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync("Sign up error: " + ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
        }

        public async Task<AccountDTO> CheckAccountExist(string username)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            string query = "select * from dbo.Account" +
                "\nwhere Username = @username";
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@username", username);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new AccountDTO()
                    {
                        AccountID = (Guid)(reader["AccountID"]),
                        Username = reader["Username"] as string,
                        Password = reader["Password"] as string,
                        Role = reader["Role"] as string
                    };
                }
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync("Login error: " + ex.Message);
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }
    }
}
