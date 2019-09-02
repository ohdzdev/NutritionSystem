using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;

namespace ExcelApp
{
  class Program
  {
    public DBConnection Db { get; set; }


    static void Main(string[] args)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory())
          .AddJsonFile("appsettings.json");

      var configuration = builder.Build();
      int dietId = 0;
      string outputPath = "";
      string dbConnString = "";

      if (args.Length > 0)
      {
        dietId = Int32.Parse(args[0]);
        outputPath = args[1];
        dbConnString = args[2];
      }

      DataTable WeightsInG = new DataTable();
      DataTable WeightsNotInG = new DataTable();
      DataTable SpeciesName = new DataTable();
      DataTable DescriptionName = new DataTable();
      DataTable PivotData = new DataTable();

      using (var conn = new MySqlConnection(dbConnString))
      {
        using (var cmd = new MySqlCommand("GetFoodsInG", conn))
        {
          using (var adapter = new MySqlDataAdapter())
          {
            adapter.SelectCommand = cmd;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("DietId", dietId);
            adapter.Fill(WeightsInG);
          }
        }

        using (var cmd = new MySqlCommand("GetFoodsNotInG", conn))
        {
          using (var adapter = new MySqlDataAdapter())
          {
            adapter.SelectCommand = cmd;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("DietId", dietId);
            adapter.Fill(WeightsNotInG);
          }
        }

        using (var cmd = new MySqlCommand("GetSpeciesName", conn))
        {
          using (var adapter = new MySqlDataAdapter())
          {
            adapter.SelectCommand = cmd;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("DietId", dietId);
            adapter.Fill(SpeciesName);
          }
        }

        using (var cmd = new MySqlCommand("GetDescriptionData", conn))
        {
          using (var adapter = new MySqlDataAdapter())
          {
            adapter.SelectCommand = cmd;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("DietId", dietId);
            adapter.Fill(DescriptionName);
          }
        }

        using (var cmd = new MySqlCommand("GetPivotData", conn))
        {
          using (var adapter = new MySqlDataAdapter())
          {
            adapter.SelectCommand = cmd;
            cmd.CommandType = CommandType.StoredProcedure;
            adapter.Fill(PivotData);
          }
        }
      }

      DataTable inverted = GetInversedDataTable(PivotData, "bgt_Name", "food", "AvgOfNutr_Val", false);

      FileInfo templateFile = new FileInfo("../DietAnalysis.xltm");
      FileInfo newFile = new FileInfo(outputPath);
      if (newFile.Exists)
      {
        newFile.Delete();
        newFile = new FileInfo(outputPath);
      }
      using (ExcelPackage package = new ExcelPackage(newFile, templateFile))
      {
        //fill pivot data
        if (PivotData.Rows.Count > 0)
        {
          ExcelWorksheet worksheet = package.Workbook.Worksheets[configuration["Settings:PivotTab"]];
          worksheet.Cells[configuration["Settings:PivotTabCellStart"]].LoadFromDataTable(inverted, false);//app.config this
        }

        ExcelWorksheet worksheet2 = package.Workbook.Worksheets[configuration["Settings:DietTab"]];
        worksheet2.Cells[configuration["Settings:WeightsInGStart"]].LoadFromDataTable(WeightsInG, false);//app.config this

        if (WeightsNotInG.Rows.Count > 0)
        {
          worksheet2.Cells[configuration["Settings:WeightsNotInGStart"]].LoadFromDataTable(WeightsNotInG, false);//app.config this
        }

        if (SpeciesName.Rows.Count > 0)
        {
          worksheet2.Cells[configuration["Settings:SpeciesCell"]].LoadFromDataTable(SpeciesName, false);//app.config this
        }

        if (DescriptionName.Rows.Count > 0)
        {
          worksheet2.Cells[configuration["Settings:DescriptionCell"]].LoadFromDataTable(DescriptionName, false);//app.config this
        }

        package.Save();
      }
    }

    public static DataTable GetInversedDataTable(DataTable table, string columnX,
         string columnY, string columnZ, bool sumValues)
    {
      //Create a DataTable to Return
      DataTable returnTable = new DataTable();

      if (columnX == "")
      {
        columnX = table.Columns[0].ColumnName;
      }

      //Add a Column at the beginning of the table
      returnTable.Columns.Add(columnY);


      //Read all DISTINCT values from columnX Column in the provided DataTale
      List<string> columnXValues = new List<string>();

      foreach (DataRow dr in table.Rows)
      {

        string columnXTemp = dr[columnX].ToString();
        if (!columnXValues.Contains(columnXTemp))
        {
          //Read each row value, if it's different from others provided, add to 
          //the list of values and creates a new Column with its value.
          columnXValues.Add(columnXTemp);
          returnTable.Columns.Add(columnXTemp);
        }
      }

      //Verify if Y and Z Axis columns re provided
      if (columnY != "" && columnZ != "")
      {
        //Read DISTINCT Values for Y Axis Column
        List<string> columnYValues = new List<string>();

        foreach (DataRow dr in table.Rows)
        {
          if (!columnYValues.Contains(dr[columnY].ToString()))
          {
            columnYValues.Add(dr[columnY].ToString());
          }
        }

        //Loop all Column Y Distinct Value
        columnYValues.Sort();

        foreach (string columnYValue in columnYValues)
        {
          //Creates a new Row
          DataRow drReturn = returnTable.NewRow();
          string columnYNewValue = columnYValue.Replace("'", "");
          drReturn[0] = columnYNewValue;

          //foreach column Y value, The rows are selected distincted
          DataRow[] rows = table.Select(columnY + "='" + columnYNewValue + "'");

          //Read each row to fill the DataTable
          foreach (DataRow dr in rows)
          {
            string rowColumnTitle = dr[columnX].ToString();

            //Read each column to fill the DataTable
            foreach (DataColumn dc in returnTable.Columns)
            {
              if (dc.ColumnName == rowColumnTitle)
              {
                //If Sum of Values is True it try to perform a Sum
                //If sum is not possible due to value types, the value 
                // displayed is the last one read
                if (sumValues)
                {
                  try
                  {
                    drReturn[rowColumnTitle] =
                         Convert.ToDecimal(drReturn[rowColumnTitle]) +
                         Convert.ToDecimal(dr[columnZ]);
                  }
                  catch
                  {
                    drReturn[rowColumnTitle] = dr[columnZ];
                  }
                }
                else
                {
                  if (dr[columnZ] != DBNull.Value)
                  {
                    drReturn[rowColumnTitle] = Convert.ToDecimal(dr[columnZ]);
                  }
                }
              }
            }
          }
          returnTable.Rows.Add(drReturn);
        }
      }
      else
      {
        throw new Exception("The columns to perform inversion are not provided");
      }

      return returnTable;
    }

  }
}
