/**
 * takes raw API data and on number fields
 * @param {Array<JSON>} rawData
 */
const getTotals = (rawData) => {
  return rawData.reduce((acc, curr) => {
    const currKeys = Object.keys(curr);
    currKeys.forEach((key) => {
      if (typeof curr[key] === 'number') {
        // declare the start of a total field
        if (acc[key] === undefined) {
          acc[key] = 0;
        }
      }
    });
    const keys = Object.keys(acc);

    keys.forEach((key) => {
      if (curr[key]) {
        acc[key] += curr[key];
      }
    });
    return acc;
  }, {});
};

export default getTotals;
