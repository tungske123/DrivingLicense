using Driving_License.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;

namespace Driving_License.Users
{
    public class UsersDAO
    {
        //Fields
        private static UsersDAO instance = null;
        /*
         Creates a semaphore that can be entered by only one thread at a time. 
        The first parameter 1 is the initial count (number of threads that can enter the semaphore), 
        and the second parameter 1 is the maximum count.
         */
        private static readonly SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);
        private static readonly object instanceLock = new object();


        //Constructor
        private UsersDAO()
        {

        }

        //Methods

        //For non async
        public static UsersDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance is null)
                    {
                        instance = new UsersDAO();
                    }
                    return instance;
                }
            }
        }

        //For async
        public static async Task<UsersDAO> AsyncInstance()
        {
            //If instance does not exist
            if (instance is null)
            {
                /*
                 Acquire Semaphore: If no instance exists, 
                it tries to acquire the semaphore using await semaphoreSlim.WaitAsync(). 
                This line will block until the semaphore is available.
                 */
                await semaphoreSlim.WaitAsync();

                /*
                 Double-Check Locking: Inside the try block, it checks again if an instance exists. 
                This is known as double-check locking.
                It’s used to prevent race conditions where two threads might pass 
                the initial null check simultaneously 
                and end up creating two instances of the singleton class.
                 */
                try
                {
                    if (instance is null)
                    {
                        instance = new UsersDAO();
                    }
                }
                finally
                {
                    /*
                     Release Semaphore: Whether an instance was created or not, 
                    it always releases the semaphore in the finally block using semaphoreSlim.Release().
                    This ensures that other threads blocked on WaitAsync() can proceed.
                     */
                    semaphoreSlim.Release();
                }
            }
            return instance;
        }

        /// <summary>
        /// Load user from UserID
        /// </summary>
        /// <param name="UserID">UserID</param>
        /// <returns>A UsersDTO object contain user value if the user exists else return null</returns>
        public async Task<UsersDTO> loadFromUserID(string UserID)
        {
            string query = "select * from dbo.Users" +
                "\nwhere UserID = @userid";
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@userid", Guid.Parse(UserID));
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new UsersDTO()
                    {
                        UserID = (Guid)(reader["UserID"]),
                        Avatar = reader["Avatar"] as string,
                        CCCD = reader["CCCD"] as string,
                        Email = reader["Email"] as string,
                        Username = reader["Username"] as string,
                        Password = reader["Password"] as string,
                        FullName = reader["FullName"] as string,
                        BirthDate = (reader["BirthDate"] == DBNull.Value) ? string.Empty : reader["BirthDate"].ToString(),
                        Nationality = reader["Nationality"] as string,
                        PhoneNumber = reader["PhoneNumber"] as string,
                        Address = reader["Address"] as string,
                        Role = reader["Role"] as string
                    };
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Load users error: {ex.Message}");
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }
        /// <summary>
        /// Load user from an email
        /// </summary>
        /// <param name="email">an email to check</param>
        /// <returns>UsersDTO object with user data if email exists else return null</returns>
        public async Task<UsersDTO> loadFromUserEmail(string email)
        {
            string query = "select * from dbo.Users" +
                "\nwhere Email = @email";
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@email", email);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new UsersDTO()
                    {
                        UserID = (Guid)(reader["UserID"]),
                        Avatar = reader["Avatar"] as string,
                        CCCD = reader["CCCD"] as string,
                        Email = reader["Email"] as string,
                        Username = reader["Username"] as string,
                        Password = reader["Password"] as string,
                        FullName = reader["FullName"] as string,
                        BirthDate = (reader["BirthDate"] == DBNull.Value) ? string.Empty : reader["BirthDate"].ToString(),
                        PhoneNumber = reader["PhoneNumber"] as string,
                        Address = reader["Address"] as string,
                        Role = reader["Role"] as string
                    };
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Load users error: {ex.Message}");
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }

        /// <summary>
        /// Login with username and password
        /// </summary>
        /// <param name="username">username.</param>
        /// <param name="password">password.</param>
        /// <returns>A UsersDTO object contains the value of user if login is success else null</returns>
        [HttpPost]
        public async Task<UsersDTO> login(string username, string password)
        {
            string query = "select * from dbo.Users" +
                "\nwhere Username = @username and Password = @password";
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@username", username);
                command.Parameters.AddWithValue("@password", password);
                using var reader = await command.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new UsersDTO()
                    {
                        UserID = (Guid)(reader["UserID"]),
                        Avatar = reader["Avatar"] as string,
                        CCCD = reader["CCCD"] as string,
                        Email = reader["Email"] as string,
                        Username = reader["Username"] as string,
                        Password = reader["Password"] as string,
                        FullName = reader["FullName"] as string,
                        BirthDate = (reader["BirthDate"] == DBNull.Value) ? string.Empty : reader["BirthDate"].ToString(),
                        Nationality = reader["Nationality"] as string,
                        PhoneNumber = reader["PhoneNumber"] as string,
                        Address = reader["Address"] as string,
                        Role = reader["Role"] as string
                    };
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
            }
            finally
            {
                await connection.CloseAsync();
            }
            return null;
        }



        public async Task AddNewUser(string commandText, params SqlParameter[] parameters)
        {
            using var connection = new SqlConnection(DBUtils.getConnectionString());
            try
            {
                await connection.OpenAsync();
                using var command = new SqlCommand(commandText, connection);
                command.CommandType = System.Data.CommandType.Text;
                if (parameters is not null && parameters.Count() > 0)
                {
                    foreach (var param in parameters)
                    {
                        command.Parameters.Add(param);
                    }
                }
                await command.ExecuteNonQueryAsync();
            }
            catch (SqlException ex)
            {
                await Console.Out.WriteLineAsync($"Add new user error: {ex.Message}");
            }
            finally
            {
                await connection.CloseAsync();
            }
        }
    }
}