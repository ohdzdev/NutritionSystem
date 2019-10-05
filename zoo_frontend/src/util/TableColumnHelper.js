import camelToNorm from './camelToNorm';

/**
 * Get Material Table columns from your API data
 * @param {Array<JSON>} rawData need raw state data in order to reliably find object that has all your keys
 * @param {Array<String>} ignoredColums columns we want to ignore from our data
 * @param {JSON} replaceColumns key value where key is the original column name and the value is the replacement value
 */
const columnConfigCreator = (rawData, ignoredColumns, replaceColumns) => {
  // find the first data column that is more than just the id and the tableData properties
  const rawSingleEntry = rawData.find((el) => Object.keys(el).length > 2);
  const tableColumns = Object.entries(rawSingleEntry)
    // remove tableData from our columns since its an object and isn't helpful
    .filter((el) => !ignoredColumns.find((item) => item === el[0]))
    // map over ever key from API and make a field that matches the key and a 'title' that is presented to the user
    .map((data) => ({
      title: camelToNorm(replaceColumns ? replaceColumns[data[0]] || data[0] : data[0]),
      field: data[0],
      // enable these only if you need to mess around with cell and header styles of the table.
      // the jank was too much so I left them disabled
      // cellStyle: {
      //   padding: '15px',
      // },
      // headerStyle: {
      //   padding: '15px',
      // },
    }));
  return tableColumns;
};

export default columnConfigCreator;
