import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import ReactToPrint from 'react-to-print';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';

import FoodAPI from '../../../api/Food';

import usdFormatter from '../utils/usdFormatter';
import addLocationSubtotals from '../utils/addLocationSubtotals';
import getTotals from '../utils/getTotals';

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
            <PrintIcon />
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
                    <th className={classes.th} style={{ paddingLeft: '20px' }}>
                      <Typography variant="subtitle1" align="left">
                        {locationKey}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {usdFormatter(locationSubTotals[locationKey].SumOfCostGPerDay)}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {usdFormatter(locationSubTotals[locationKey].SumOfCostGPerMonth)}
                      </Typography>
                    </th>
                    <th className={`${classes.rightText} ${classes.th}`}>
                      <Typography variant="subtitle1">
                        {usdFormatter(locationSubTotals[locationKey].SumOfCostGPerYear)}
                      </Typography>
                    </th>
                  </tr>
                  {data[locationKey].map((line) => (
                    <tr key={line.budgetId}>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{line.budgetId}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{usdFormatter(line.SumOfCostGPerDay)}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{usdFormatter(line.SumOfCostGPerMonth)}</Typography>
                      </td>
                      <td className={`${classes.rightText} ${classes.td}`}>
                        <Typography>{usdFormatter(line.SumOfCostGPerYear)}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              );
            })}
            <thead>
              <tr className={classes.totalTr}>
                <th style={{ paddingLeft: '20px' }} className={classes.th}>
                  <Typography variant="subtitle1" align="left">
                    Grand Totals:
                  </Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">
                    {usdFormatter(totals.SumOfCostGPerDay)}
                  </Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">
                    {usdFormatter(totals.SumOfCostGPerMonth)}
                  </Typography>
                </th>
                <th className={`${classes.rightText} ${classes.th}`}>
                  <Typography variant="subtitle1">
                    {usdFormatter(totals.SumOfCostGPerYear)}
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
