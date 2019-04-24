import React, { Component } from 'react';
import MaterialTable from 'material-table';

import { MuiThemeProvider } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import moment from 'moment';
import { theme } from '../../getPageContext';


class DietHistory extends Component {
  static propTypes = {
    allFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
    allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
    dietHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentHistoryTime: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const foodLookup = {};
    props.allFoods.slice(0).reduce((acc, food) => {
      acc[food.foodId] = food.food;
      return acc;
    }, foodLookup);

    const unitLookup = {};
    props.allUnits.slice(0).reduce((acc, unit) => {
      acc[unit.unitId] = unit.unit;
      return acc;
    }, unitLookup);

    this.state = {
      foodLookup,
      unitLookup,
      historyLength: this.props.dietHistory.length,
    };
    console.log(this.props.currentHistoryTime);
  }

  render() {
    return (
      <>
        <MuiThemeProvider theme={{
          ...theme,
          overrides: {
            MuiTableCell: {
              root: {
                textAlign: 'center',
                padding: '0px 4px 0px 4px',
              },
              paddingCheckbox: {
                padding: '0px 2px 0px 2px',
              },
            },
            MuiSelect: {
              select: {
                maxWidth: '100px',
              },
            },
            MuiIconButton: {
              root: {
                padding: '5px 5px 5px 5px',
              },
            },
            MuiTableSortLabel: {
              icon: {
                display: 'none',
              },
            },
            MuiIcon: {
              root: {
                width: '1em !important',
              },
            },
          },
        }
        }
        >
          <MaterialTable
            title={`${moment(new Date(this.props.currentHistoryTime)).format(' MM-DD-YYYY h:mm A')} Diet Changes`}
            columns={[
              {
                title: 'Food',
                field: 'foodId',
                lookup: this.state.foodLookup,
              },
              {
                title: 'Ind',
                field: 'indAmount',
                type: 'numeric',
              },
              {
                title: 'Total',
                field: 'amount',
                type: 'numeric',
              },
              {
                title: 'Unit',
                field: 'unitId',
                lookup: this.state.unitLookup,
              },
              {
                title: 'SU',
                field: 'sun',
                type: 'boolean',
              },
              {
                title: 'M',
                field: 'mon',
                type: 'boolean',
              },
              {
                title: 'T',
                field: 'tue',
                type: 'boolean',
              },
              {
                title: 'W',
                field: 'wed',
                type: 'boolean',
              },
              {
                title: 'R',
                field: 'thr',
                type: 'boolean',
              },
              {
                title: 'F',
                field: 'fri',
                type: 'boolean',
              },
              {
                title: 'S',
                field: 'sat',
                type: 'boolean',
              },
              {
                title: 'Sort',
                field: 'sort',
                type: 'numeric',
                defaultSort: 'asc',
              },
              {
                title: 'Bag',
                field: 'tote',
                type: 'numeric',
              },
              {
                title: 'Cycle',
                field: 'freqWeeks',
                type: 'numeric',
              },
              {
                title: 'Week',
                field: 'freqRotation',
                type: 'numeric',
              },
            ]}
            data={this.props.dietHistory}
            options={{
              pageSize: this.state.historyLength,
              search: false,
              emptyRowsWhenPaging: false,
            }}
          />
        </MuiThemeProvider>

      </>
    );
  }
}

export default DietHistory;
