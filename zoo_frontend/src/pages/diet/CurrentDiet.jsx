import React, { Component } from 'react';
import MaterialTable from 'material-table';

import { MuiThemeProvider } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { Button, CircularProgress, TextField } from '@material-ui/core';
import { theme } from '../../getPageContext';

/**
 * This function helps check if required fields have been met for new and edits on records
 */
const dietPlanRequiredFieldCheck = (rowUpdated, showNotification) => {
  if (!rowUpdated.foodId) {
    showNotification('error', 'Food is a required field.');
    return false;
  }

  if (!rowUpdated.indAmount) {
    showNotification('error', 'Individual amount is a required field.');
    return false;
  }
  if (Number.isNaN(parseInt(rowUpdated.indAmount, 10))) {
    showNotification(
      'error',
      'Individual Amount is a number field. Please enter a number',
    );
    return false;
  }

  if (!rowUpdated.unitId) {
    showNotification('error', 'Unit is a required field.');
    return false;
  }

  if (!rowUpdated.sort) {
    showNotification('error', 'Sort is a required field.');
    return false;
  }

  if (Number.isNaN(parseInt(rowUpdated.sort, 10))) {
    showNotification('error', 'Sort is a number field. Please enter a number.');
    return false;
  }

  if (!rowUpdated.tote) {
    showNotification('error', 'Bag is a required field.');
    return false;
  }

  if (Number.isNaN(parseInt(rowUpdated.tote, 10))) {
    showNotification('error', 'Bag is a number field. Please enter a number.');
    return false;
  }

  if (!rowUpdated.freqRotation) {
    showNotification('error', 'Cycle is a required field.');
    return false;
  }

  if (Number.isNaN(parseInt(rowUpdated.freqRotation, 10))) {
    showNotification(
      'error',
      'Cycle is a number field. Please enter a number.',
    );
    return false;
  }

  if (!rowUpdated.freqWeeks) {
    showNotification('error', 'Week is a required field.');
    return false;
  }

  if (Number.isNaN(parseInt(rowUpdated.freqWeeks, 10))) {
    showNotification('error', 'Week is a number field. Please enter a number.');
    return false;
  }

  return true;
};

class CurrentDiet extends Component {
  static propTypes = {
    allFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
    allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
    dietPlan: PropTypes.arrayOf(PropTypes.object),
    onSave: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    numAnimals: PropTypes.number,
    currentDiet: PropTypes.object.isRequired,
    onDietPlanAdd: PropTypes.func.isRequired,
    onDietPlanUpdate: PropTypes.func.isRequired,
    onDietPlanDelete: PropTypes.func.isRequired,
    onNumAnimalsChange: PropTypes.func.isRequired,
    pendingChanges: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    numAnimals: 1,
    dietPlan: [],
  };

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
      deletedDietPlans: [],
      foodLookup,
      unitLookup,
      isLoading: false,
    };
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MuiThemeProvider
          theme={{
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
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              variant="outlined"
              type="number"
              value={this.props.numAnimals}
              onChange={e => {
                let val = parseInt(e.target.value, 10);
                if (val <= 0) {
                  val = 1;
                }

                this.props.onNumAnimalsChange(val);
              }}
              style={{ margin: '10px' }}
              label="Number of Animals"
            />
            <div style={{ display: 'flex' }}>
              <Button
                onClick={() => {
                  this.setState({ isLoading: true }, () => {
                    // isloading and pending changes get changed via ref. This is because changelog dialog
                    // can only be opened via state change which can't be listend to via a promise chain
                    // when it is completed.
                    this.props.onSave(this.state.deletedDietPlans);
                  });
                }}
                variant="contained"
                color="primary"
                style={{
                  marginRight: '15px',
                  marginTop: '10px',
                  marginBottom: '10px',
                  width: '200px',
                }}
                disabled={!this.props.pendingChanges}
              >
                Submit Changes
              </Button>
            </div>
          </div>
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
                readonly: true,
                // editable: 'never', // this lands in the next material-table release
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
                field: 'freqRotation',
              },
              {
                title: 'Week',
                field: 'freqWeeks',
              },
            ]}
            data={this.props.dietPlan}
            options={{
              pageSize: this.props.dietPlan.length + 10,
              search: false,
              emptyRowsWhenPaging: false,
              addRowPosition: 'first',
            }}
            editable={{
              onRowAdd: newData => new Promise((res, rej) => {
                const valid = dietPlanRequiredFieldCheck(
                  newData,
                  this.props.showNotification,
                );

                const localData = { ...newData };
                localData.groupAmount =
                  this.props.numAnimals * parseInt(localData.indAmount, 10);
                localData.dietId = this.props.currentDiet.dietId;
                if (!valid) {
                  rej();
                  return;
                }

                // update via props to prevent issues with updating state once diets have been created via 'submit changes' button
                this.props.onDietPlanAdd(localData).then(() => {
                  res();
                });
              }),
              onRowDelete: row => new Promise((res, rej) => {
                this.props
                  .onDietPlanDelete(row)
                  .then(() => {
                    this.setState(
                      prevState => ({
                        deletedDietPlans: [...prevState.deletedDietPlans, row],
                      }),
                      () => {
                        res();
                      },
                    );
                  })
                  .catch(err => {
                    console.error(err);
                    rej();
                  });
              }),
              onRowUpdate: (rowUpdated, prevRow) => new Promise(async (res, rej) => {
                const valid = dietPlanRequiredFieldCheck(
                  rowUpdated,
                  this.props.showNotification,
                );
                if (!valid) {
                  rej();
                  return;
                }

                const updatedCopy = { ...rowUpdated };
                updatedCopy.groupAmount = this.props.numAnimals * parseInt(updatedCopy.indAmount, 10);
                let fieldUpdated = false;
                const updatedFields = Object.entries(updatedCopy)
                  .filter(column => prevRow[column[0]] !== column[1])
                  .map(entry => entry[0]);
                if (updatedFields && updatedFields.length > 0) {
                  fieldUpdated = true;
                }
                if (fieldUpdated) {
                  const updatedFieldsToServer = {};
                  updatedFields.forEach(fieldToKeep => {
                    updatedFieldsToServer[fieldToKeep] =
                      updatedCopy[fieldToKeep];
                  });
                  await this.props.onDietPlanUpdate(updatedFieldsToServer, updatedCopy.id).catch((err) => {
                    console.error(err);
                    rej();
                  });
                  res();
                  return;
                }
                this.props.showNotification(
                  'info',
                  'No pending changes detected',
                );
                rej();
              }),
            }}
          />
          {this.state.isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 999999,
              }}
            >
              <div
                style={{
                  display: 'table',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FFFFFFAA',
                }}
              >
                <div
                  style={{
                    display: 'table-cell',
                    width: '100%',
                    height: '100%',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  <CircularProgress />
                </div>
              </div>
            </div>
          )}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default CurrentDiet;
