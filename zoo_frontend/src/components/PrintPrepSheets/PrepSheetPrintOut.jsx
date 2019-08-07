import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

// This component must be a class as react-to-print requires a reference to it
class PrepSheetPrintOut extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    date: PropTypes.object.isRequired,
    prepSheetData: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { date, prepSheetData } = this.props;

    const data = prepSheetData.sort((a, b) => (a.food < b.food ? -1 : 1));

    const styles = {
      rowEven: {
        backgroundColor: grey[200],
      },
      rowOdd: {
        backgroundColor: 'white',
      },
      totalText: {
        fontSize: '1rem',
        textAlign: 'right',
        marginRight: 5,
      },
      foodText: {
        fontSize: '1rem',
        marginLeft: 10,
      },
      cell: {
        border: 'none',
      },
      table: {
        marginTop: 20,
        border: 'none',
        borderSpacing: 0,
      },
    };

    return (
      <div>
        <Typography variant="h4" color="secondary">
          PREP AHEAD {date.format('M/D/YYYY')}
        </Typography>
        <Typography variant="h6" color="secondary">
          Prep {date.format('dddd')} (for{' '}
          {date
            .clone()
            .add(1, 'day')
            .format('dddd')}{' '}
          diet prep)
        </Typography>
        <table style={styles.table}>
          <tbody>
            {data.map((line, index) => (
              <tr key={line.food} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.cell}>
                  <Typography style={styles.totalText}>{Math.round(line.total)}</Typography>
                </td>
                <td style={styles.cell}>
                  <Typography>{line.unit}</Typography>
                </td>
                <td style={{ ...styles.cell, width: '100%' }}>
                  <Typography style={styles.foodText}>{line.food}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PrepSheetPrintOut;
