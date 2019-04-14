using System;
using System.Windows;
using System.Collections.Generic;
using System.Text;
using MySql.Data.MySqlClient;


namespace ExcelApp
{
    public class DBConnection : IDisposable
    {
        public MySqlConnection Connection;

        public void Dispose()
        {
            Connection.Close();
        }

        public DBConnection(string connectionString)
        {
            Connection = new MySqlConnection(connectionString);
        }

    }
}
