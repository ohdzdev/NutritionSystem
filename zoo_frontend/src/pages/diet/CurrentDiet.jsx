import React, { Component } from 'react';
import MaterialTable from 'material-table';

import { MuiThemeProvider } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { theme } from '../../getPageContext';

class CurrentDiet extends Component {
  static propTypes = {
    allFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
    allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
    dietPlan: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    const foodLookup = {};
    props.allFoods.slice(0).reduce((acc, food) => {
      acc[food.foodId] = food.food;
      return acc;
    }, foodLookup);

    const foodSuggestions = props.allFoods.map((val) => ({
      ...val,
      label: val.food,
      value: val.foodId,
    }));

    const unitLookup = {};
    props.allUnits.slice(0).reduce((acc, unit) => {
      acc[unit.unitId] = unit.unit;
      return acc;
    }, unitLookup);

    this.state = {
      foodSuggestions,
      foodLookup,
      unitLookup,
      dietPlanLength: this.props.dietPlan.length,
    };
    console.log(this.state.foodSuggestions);
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
            title="Current Diet Plan"
            columns={[
              {
                title: 'Food',
                field: 'foodId',
                lookup: this.state.foodLookup,
                cellStyle: {
                  width: '100px !important',
                },
              },
              {
                title: 'Ind',
                field: 'indAmount',
              },
              {
                title: 'Total',
                field: 'groupAmount',
              },
              {
                title: 'Unit',
                field: 'unitId',
                lookup: this.state.unitLookup,
                cellStyle: {
                  width: '30px',
                },
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
                defaultSort: 'asc',
              },
              {
                title: 'Bag',
                field: 'tote',
              },
              {
                title: 'Cycle',
                field: 'freqWeeks',
              },
              {
                title: 'Week',
                field: 'freqRotation',
              },
            ]}
            data={this.props.dietPlan}
            options={{
              pageSize: this.state.dietPlanLength + 10,
              search: false,
              emptyRowsWhenPaging: false,
              addRowPosition: 'first',
            }}
            editable={{
              onRowAdd: (newData) => {
                console.log(newData);
              },
              onRowDelete: (oldData) => {
                console.log(oldData);
              },
              onRowUpdate: (newData, oldData) => {
                console.log(newData, oldData);
              },
            }}
          />
        </MuiThemeProvider>

      </>
    );
  }
}

export default CurrentDiet;
