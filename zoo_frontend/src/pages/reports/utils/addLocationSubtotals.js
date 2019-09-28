const addLocationSubtotals = (d) => {
  // our data is already grouped into locations, we must iterate over these and get the subtotals
  // then the sub totals can be added to the orignal dataset
  const locationSubTotals = {};

  Object.keys(d).forEach((key) => {
    const groupTotal = d[key].reduce((acc, curr) => {
      const rowKeys = Object.keys(curr);
      // here we calculate all the number fields into their own subtotals
      rowKeys.forEach((rKey) => {
        if (typeof curr[rKey] === 'number') {
          if (acc[rKey]) {
            acc[rKey] += curr[rKey];
          } else {
            acc[rKey] = curr[rKey];
          }
        }
      });
      return acc;
    }, {});
    locationSubTotals[key] = groupTotal;
  });
  return {
    data: d,
    locationSubTotals,
  };
};

export default addLocationSubtotals;
