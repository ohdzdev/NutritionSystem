import React, { Component, createRef } from 'react';

import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';
import { Button } from '@material-ui/core';

import FoodAPI from '../../../api/Food';

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const moneyFormatterUS = (raw) => formatter.format(raw);

/**
 * groups data coming back from API into a JSON with locations as the keys
 * and the values as arrays of the original data
 *
 * if the data comes back presorted on dietId then this will add it to the groups in least to highest order
 * @param {Array<JSON>} rawData
 */
const prepFeedCostData = (rawData) => {
  return rawData.reduce((acc, curr) => {
    const keys = Object.keys(acc);
    const dex = keys.findIndex((i) => i === curr.location);
    if (dex !== -1) {
      acc[keys[dex]] = [...acc[keys[dex]], curr];
    } else {
      acc[curr.location] = [curr];
    }
    return acc;
  }, {});
};

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

const titleMap = {
  dietId: 'Diet ID',
  species: ' Species',
  numAnimals: 'Number Animals',
  SumOfCostGPerDay: 'Daily Cost',
  SumOfCostGPeryear: 'Yearly Cost',
};

const styleMap = {
  dietId: 'rightText',
  species: '',
  numAnimals: 'rightText',
  SumOfCostGPerDay: 'rightText',
  SumOfCostGPeryear: 'rightText',
};

class FeedingCostReport extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    // api helpers on server side

    const foodAPI = new FoodAPI(authToken);

    // server side grab all data for list view
    const res = await foodAPI.getFoodCostReport();
    return {
      reportData: res.data,
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    reportData: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.tableRef = createRef();
    this.printer = createRef();
  }

  print = () => {
    this.printer.current.handlePrint();
  };

  render() {
    const { data, locationSubTotals } = addLocationSubtotals(
      prepFeedCostData(this.props.reportData),
    );
    const totals = getTotals(this.props.reportData);
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.buttonContainer}>
          <Button variant="contained" color="secondary" onClick={this.print}>
            Print
          </Button>
        </div>
        <ReactToPrint
          ref={this.printer}
          trigger={() => <div style={{ display: 'none' }} />}
          content={() => this.tableRef.current}
          pageStyle={
            '@page { size: auto;  margin: 6% 5%; } @media print { body { -webkit-print-color-adjust: exact; } }'
          }
        />
        <div ref={this.tableRef}>
          <table className={classes.table}>
            <thead key="header">
              <tr className={classes.headerTr}>
                {Object.keys(titleMap).map((key) => (
                  <th key={key} className={classes[styleMap[key]]}>
                    <Typography variant="subtitle1">{titleMap[key]}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {Object.keys(data).map((locationKey) => {
              return (
                <tbody key={locationKey}>
                  <tr className={classes.sectionHeaderTr}>
                    <th colSpan={2} className={classes.th} style={{ paddingLeft: '20px' }}>
                      <Typography variant="subtitle1" align="left">
                        {locationKey}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {locationSubTotals[locationKey].num_animals}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {moneyFormatterUS(locationSubTotals[locationKey].SumOfCostGPerDay)}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {moneyFormatterUS(locationSubTotals[locationKey].SumOfCostGPerDay * 365)}
                      </Typography>
                    </th>
                  </tr>
                  {data[locationKey].map((line) => (
                    <tr key={line.diet_id} className={classes.tr}>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{line.diet_id}</Typography>
                      </td>
                      <td className={classes.td}>
                        <Typography>{line.species}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{line.num_animals}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{moneyFormatterUS(line.SumOfCostGPerDay)}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{moneyFormatterUS(line.SumOfCostGPerDay * 365)}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
            <thead>
              <tr className={classes.totalTr}>
                <th colSpan={2} style={{ paddingLeft: '20px' }} className={classes.th}>
                  <Typography variant="subtitle1" align="left">
                    Grand Totals:
                  </Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">{totals.num_animals}</Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">
                    {moneyFormatterUS(totals.SumOfCostGPerDay)}
                  </Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">
                    {moneyFormatterUS(totals.SumOfCostGPerDay * 365)}
                  </Typography>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    );
  }
}

export default FeedingCostReport;
