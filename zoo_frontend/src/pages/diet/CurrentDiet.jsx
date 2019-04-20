import React, { Component } from 'react';
import MaterialTable from 'material-table';

import { MuiThemeProvider } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { theme } from '../../getPageContext';

import SingleSelect from '../../components/ReactSingleSelect';

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

    const unitLookup = {};
    props.allUnits.slice(0).reduce((acc, unit) => {
      acc[unit.unitId] = unit.unit;
      return acc;
    }, unitLookup);

    this.state = {
      foodLookup,
      unitLookup,
      dietPlanLength: this.props.dietPlan.length,
    };
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
                padding: '4px 0px 4px 12px',
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
                editComponent: (props) => {
                  console.log(props);
                  return (
                    <SingleSelect
                      onChange={(v) => {
                        console.log(v);
                        props.onChange(v);
                      }}
                    />
                  );
                },
              },
              {
                title: 'Ind',
                field: 'indAmount',
                type: 'numeric',
              },
              {
                title: 'Total',
                field: 'groupAmount',
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
            data={this.props.dietPlan}
            options={{
              pageSize: this.state.dietPlanLength + 10,
              search: false,
              emptyRowsWhenPaging: false,
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
