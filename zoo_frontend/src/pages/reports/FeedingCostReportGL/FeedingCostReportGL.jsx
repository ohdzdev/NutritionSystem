import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';

import Typography from '@material-ui/core/Typography';
import Table from 'react-bootstrap/Table';

import FoodAPI from '../../../api/Food';

import apiData from './test.json';

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
      } else {
        console.log(`key: ${key} is not a number`);
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
  budgetId: 'G/L Code',
  SumOfCostGPerDay: 'Cost Per Day',
  SumOfCostGPerMonth: 'Cost Per Month',
  SumOfCostGPerYear: 'Yearly Cost',
};

const styleMap = {
  budgetId: 'rightText',
  SumOfCostGPerDay: 'rightText',
  SumOfCostGPerMonth: 'rightText',
  SumOfCostGPerYear: 'rightText',
};

class FeedingCostReport extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    // api helpers on server side
    const foodAPI = new FoodAPI(authToken);

    // server side grab all data for list view
    const res = await foodAPI.getFoodCostReportByGL();
    return {
      reportData: res.data,
    };
  }

  static propTypes = {
    classes: PropTypes.shape({
      rightText: PropTypes.object.isRequired,
    }).isRequired,
    reportData: PropTypes.array.isRequired,
  };

  render() {
    const { data, locationSubTotals } = addLocationSubtotals(
      prepFeedCostData(this.props.reportData),
    );
    console.log(data);
    console.log(locationSubTotals);
    const totals = getTotals(apiData);
    console.log(totals);
    const { classes } = this.props;
    return (
      <div>
        <div>
          <Table bordered striped size="sm">
            <thead key="header">
              <tr>
                <th />
                {Object.keys(titleMap).map((key) => (
                  <th className={classes[styleMap[key]]}>{titleMap[key]}</th>
                ))}
              </tr>
            </thead>
            {Object.keys(data).map((locationGroup) => {
              return (
                <tbody key={locationGroup}>
                  <tr>
                    <th colSpan={2} style={{ paddingLeft: '20px' }}>
                      {locationGroup}
                    </th>
                    <th className={classes.rightText}>
                      {locationSubTotals[locationGroup].SumOfCostGPerDay.toFixed(2)}
                    </th>
                    <th className={classes.rightText}>
                      {locationSubTotals[locationGroup].SumOfCostGPerMonth.toFixed(2)}
                    </th>
                    <th className={classes.rightText}>
                      {locationSubTotals[locationGroup].SumOfCostGPerYear.toFixed(2)}
                    </th>
                  </tr>
                  {data[locationGroup].map((line) => (
                    <tr key={line.dietId}>
                      <td style={{ width: '8em' }} />
                      <td className={classes.rightText}>
                        <Typography>{line.budgetId}</Typography>
                      </td>
                      <td className={classes.rightText}>
                        <Typography>{line.SumOfCostGPerDay}</Typography>
                      </td>
                      <td className={classes.rightText}>
                        <Typography>{line.SumOfCostGPerMonth}</Typography>
                      </td>
                      <td className={classes.rightText}>
                        <Typography>{line.SumOfCostGPerYear}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
            <thead>
              <tr>
                <th colSpan={2} style={{ paddingLeft: '20px' }}>
                  Grand Totals:
                </th>
                <th className={classes.rightText}>{totals.SumOfCostGPerDay}</th>
                <th className={classes.rightText}>{totals.SumOfCostGPerMonth}</th>
                <th className={classes.rightText}>{totals.SumOfCostGPerYear}</th>
              </tr>
            </thead>
          </Table>
        </div>
      </div>
    );
  }
}

export default FeedingCostReport;
