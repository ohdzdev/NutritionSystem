import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Paper,
} from '@material-ui/core';
import MaterialTable from 'material-table';

// icons
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

// custom zoo components
import { SingleSelect, ConfirmationDialog, Notifications } from '../../../components';

// api
import {
  Food as FoodAPI,
  NutData as NutDataAPI,
  NutrDef as NutrDefAPI,
  DataSrc as DataSrcAPI,
  FoodCategories as FoodCategoryAPI,
  BudgetIds as BudgetCodeAPI,
  Units as UnitsAPI,
  FoodWeights as FoodWeightsAPI,
} from '../../../api';

// actual API repo
import nutDataAPIModel from '../../../../../zoo_api/common/models/NUT_DATA.json';

// access control
import { hasAccess } from '../../PageAccess';
import Roles from '../../../static/Roles';

import FoodForm from '../foodForm';

import FoodWeightTable from './FoodWeightTable';

// define what columns we want on our main nutrient table
const col = [
  {
    title: 'Nutrient',
    field: 'nutrDesc',
  },
  {
    title: 'Nutr Val',
    field: 'nutrVal',
  },
  {
    title: 'Units',
    field: 'units',
  },
  {
    title: 'Last Modified',
    field: 'addModDate',
  },
  {
    title: 'Reference',
    field: 'shortForm',
  },
];

export default class extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    foodWeights: PropTypes.arrayOf(PropTypes.object).isRequired,
    allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    token: '',
  }

  static async getInitialProps({ query, authToken }) {
    if (!query.id) {
      // show error and return to view foods
    } else {
      const serverFoodAPI = new FoodAPI(authToken);
      const serverNutDataAPI = new NutDataAPI(authToken);
      const serverNutrDataAPI = new NutrDefAPI(authToken);
      const serverDataSrcAPI = new DataSrcAPI(authToken);
      const categoryAPI = new FoodCategoryAPI(authToken);
      const budgetAPI = new BudgetCodeAPI(authToken);
      const serverUnitsAPI = new UnitsAPI(authToken);
      const serverFoodWeightsAPI = new FoodWeightsAPI(authToken);

      // grab all related records on server
      const foodCategories = await categoryAPI.getCategories().catch(() => []);
      const budgetCodes = await budgetAPI.getBudgetCodes().catch(() => []);
      const food = await serverFoodAPI.getFood({ where: { foodId: query.id } }).catch(() => []);
      const category = await serverFoodAPI.getRelatedCategory(query.id).catch(() => []);
      const budgetCode = await serverFoodAPI.getRelatedBudgetCode(query.id).catch(() => []);

      const nutData = await serverNutDataAPI.getNutData({ where: { foodId: query.id } });
      const foodWeights = await serverFoodWeightsAPI.getFoodWeight({ where: { foodId: query.id } }).catch((err) => {
        console.error(err);
        return [];
      });

      const allNutrients = await serverNutrDataAPI.getNutrDef().catch((err) => {
        console.error(err);
        return [];
      });
      const allSources = await serverDataSrcAPI.getSources().catch((err) => {
        console.error(err);
        return [];
      });

      const allUnits = await serverUnitsAPI.getUnits().catch((err) => {
        console.error(err);
        return [];
      });

      return {
        ...query,
        food: food.data,
        category: category.data,
        budgetCode: budgetCode.data,
        nutritionData: nutData.data,
        allNutrients: allNutrients.data,
        allSources: allSources.data,
        foodCategories: foodCategories.data,
        budgetCodes: budgetCodes.data,
        allUnits: allUnits.data,
        foodWeights: foodWeights.data,
      };
    }
    return {};
  }

  constructor(props) {
    super(props);
    const {
      // remove things we don't want passed to state here
      api, account, router, pageContext, classes, budgetCodes, foodCategories, allUnits, ...rest // eslint-disable-line react/prop-types
    } = props;

    this.state = {
      ...rest,
      // react select options for budgets
      budgetCodeOptions: budgetCodes.map((item) => ({ label: item.budgetCode, value: item.budgetId })),
      // react select options for food categories
      foodCategoryOptions: foodCategories.map((item) => ({ label: item.foodCategory, value: item.categoryId })),
      customNutEditDialogOpen: false,
      deleteNutDataDialogOpen: false,
      newNutDataDialogOpen: false,
      dialogRow: {},
      dirty: false,
    };

    // related food records clientside updaters
    this.clientNutDataAPI = new NutDataAPI(this.props.token);

    // food record clientside updater
    this.clientFoodAPI = new FoodAPI(this.props.token);

    this.notificationBar = React.createRef();
  }

  handleNutrientFormChange = fieldName => evt => {
    let newVal = null;
    if (typeof evt === 'object' && 'target' in evt && 'value' in evt.target) {
      newVal = evt.target.value;
    } else if (typeof evt === 'object') {
      newVal = evt.value;
    } else {
      newVal = evt;
    }

    if (this.state.dialogRow) {
      this.setState((prevState) => ({
        dialogRow: {
          ...prevState.dialogRow,
          [fieldName]: newVal,
        },
        dirty: true,
      }));
    }
  }

  handleNutrientSave() {
    if (this.state.dialogRow && this.state.dirty) {
      const row = { ...this.state.dialogRow };
      const tableRow = row.meta.index;
      row.addModDate = new Date().toISOString(); // update the modified date

      const previousStateRow = { ...this.state.nutritionData[tableRow] };

      // iterate over previous nut data row and if previous value had a number, parseFloat the number in state so we match
      // reasoning behind this is when the user is editing we don't want to remove their .'s when they are typing
      Object.entries(previousStateRow).forEach((nutData) => {
        // if key match then check if a number and if it is parseFloat and overwrite previous
        if (nutData[0] in row) {
          if (typeof nutData[1] === 'number' && typeof row[nutData[0]] === 'string') {
            const toBeParsed = row[nutData[0]] === '' ? 0 : row[nutData[0]];
            row[nutData[0]] = parseFloat(toBeParsed);
          }
        }
      });

      if (this.state.dialogRow.meta && row.meta.index > -1) {
        this.setState((prevState) => {
          const newNutritionData = [...prevState.nutritionData.map((item, dex) => {
            if (dex !== tableRow) {
              return item;
            }
            const updatedRow = item;
            Object.assign(updatedRow, row);
            return updatedRow;
          })];
          return {
            nutritionData: newNutritionData,
            customNutEditDialogOpen: false,
            dialogRow: {},
            dirty: false,
          };
        }, () => {
          // update api here
          const localRow = { ...this.state.nutritionData[tableRow] };
          const APIColumns = Object.keys(nutDataAPIModel.properties);
          // clean all nonAPI colums out of localrow
          Object.keys(localRow).forEach((key) => {
            if (APIColumns.indexOf(key) === -1) {
              delete localRow[key];
            }
          });
          try {
            this.clientNutDataAPI.updateNutData(localRow.dataId, localRow);
            this.notificationBar.showNotification('info', 'Successfully edited!');
          } catch (error) {
            this.notificationBar.showNotification('error', error.message);
            console.error(error);
          }
        });
      }
      // if fail present error from api to user
    } else { // no edits
      this.setState({ customNutEditDialogOpen: false, dialogRow: {}, dirty: false });
    }
  }

  handleCancelDialogue() {
    this.setState({ customNutEditDialogOpen: false, dialogRow: {}, dirty: false });
  }

  async handleNutDataDelete(shouldDelete) {
    if (shouldDelete) {
      if (this.state.dialogRow && this.state.dialogRow.meta && this.state.dialogRow.meta.relatedIds.dataId) {
        const { dataId } = this.state.dialogRow.meta.relatedIds;
        try {
          await this.clientNutDataAPI.deleteNutData(dataId);
          this.setState((prevState) => ({ deleteNutDataDialogOpen: false, nutritionData: prevState.nutritionData.filter((item) => item.dataId !== dataId) }));
        } catch (error) {
          this.setState({ deleteNutDataDialogOpen: false, dialogRow: {} });
        }
      } else {
        this.setState({ deleteNutDataDialogOpen: false, dialogRow: {} });
      }
    } else {
      this.setState({ deleteNutDataDialogOpen: false, dialogRow: {} });
    }
  }

  handleNewNutrient() {
    this.setState({ newNutDataDialogOpen: true });
  }

  async handleNewNutrientDialogClose(cancelled, data) {
    if (cancelled || !data) {
      this.setState({ newNutDataDialogOpen: false });
    } else {
      try {
        const newRow = { ...data };
        newRow.addModDate = new Date().toISOString(); // update the modified date
        newRow.foodId = this.state.food[0].foodId;
        const res = await this.clientNutDataAPI.createNutData(newRow);
        this.setState((prevState) => ({
          newNutDataDialogOpen: false, nutritionData: [...prevState.nutritionData, res.data], dialgoRow: {}, dirty: false,
        }));
      } catch (error) {
        this.setState({
          newNutDataDialogOpen: false,
          dialogRow: {},
          dirty: false,
        });
        // TODO present error to user
        console.error(error);
      }
    }
  }

  handleFoodUpdate(payload) {
    const prom = new Promise((r, rej) => {
      this.clientFoodAPI.updateFood(this.state.food[0].foodId, { ...payload, foodId: this.state.food[0].foodId }).then((res) => {
        this.setState({ food: [{ ...res.data }] }, () => {
          r();
        });
      }, (rejected) => {
        console.err(rejected.message);
        rej();
      });
    });
    return prom;
  }

  render() {
    const composedData = this.state.nutritionData.map((val, index) => {
      const { shortForm, dataSrcId } = this.state.allSources.find((source) => source.dataSrcId === val.dataSrcId) || {};
      const { nutrDesc, units, nutrNo } = this.state.allNutrients.find((def) => def.nutrNo === val.nutrNo) || {};
      return {
        meta: {
          index,
          relatedIds: {
            dataId: val.dataId,
            dataSrcId: val.dataSrcId,
            nutrNo: val.nutrNo,
          },
          types: {
            nutrDesc: {
              type: 'picklist', dataSource: 'allNutrients', labelKey: 'nutrDesc', valueKey: 'nutrNo', stateSourceKey: 'nutrNo',
            },
            addModDate: 'disabled',
            nutrVal: 'number',
            units: 'disabled',
            shortForm: {
              type: 'picklist', dataSource: 'allSources', labelKey: 'shortForm', valueKey: 'dataSrcId', stateSourceKey: 'dataSrcId',
            },
          },
        },
        addModDate: val.addModDate,
        nutrVal: val.nutrVal,
        shortForm,
        dataSrcId,
        nutrDesc,
        nutrNo,
        units,
      };
    });


    return (
      <div>
        {this.state.customNutEditDialogOpen &&
          <Dialog
            key="editDialog"
            open={this.state.customNutEditDialogOpen}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            classes={{ paperScrollPaper: this.props.classes.dialogContent }}
          >
            <DialogTitle id="form-dialog-title">Edit Nutrition Row</DialogTitle>
            <DialogContent className={this.props.classes.dialogContent}>
              { Object.entries(this.state.dialogRow).map((item) => {
                const { meta } = this.state.dialogRow;
                // from meta in rowData figure out what type of field we have and display information accordingly
                const fieldType = meta.types[item[0]];
                // if string filter out disabled and then present text input field
                if (typeof fieldType === 'string' && fieldType !== 'disabled') {
                  // from our original columns get the title and label or text input field
                  const field = col.find((i) => i.field === item[0]);
                  return (
                    <TextField
                      id={`${item[0]} edit`}
                      label={field.title}
                      value={item[1] || ''}
                      onChange={this.handleNutrientFormChange(item[0])}
                      margin="normal"
                      fullWidth
                    />
                  );
                }
                // if we have picklist type or another, use the picklist to grab the dataSource from the state and display to user
                if (typeof fieldType === 'object') {
                  // raw data from the state to be iterated and presented to the user as selections
                  // NOTE: meta should have 2 keys: labelKey and labelValue defined from this object
                  const picklistSource = this.state[fieldType.dataSource];
                  const stateUpdateField = meta.types[item[0]].stateSourceKey;
                  const field = col.find((i) => i.field === item[0]);
                  return (
                    <FormControl fullWidth className={this.props.classes.formControl}>
                      <SingleSelect
                        label={field.title}
                        suggestions={[...[{ label: 'None', val: null }], ...picklistSource.map((val) => ({
                          ...val,
                          label: val[fieldType.labelKey],
                          value: val[fieldType.valueKey],
                        }))]}
                        defaultValue={this.state.dialogRow[fieldType.valueKey]}
                        onChange={(val) => this.handleNutrientFormChange(stateUpdateField)(val)}
                      />
                    </FormControl>
                  );
                }
                return null;
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleCancelDialogue()} color="primary">
              Cancel
              </Button>
              <Button onClick={() => this.handleNutrientSave()} color="primary">
              Save
              </Button>
            </DialogActions>
          </Dialog>
        }
        {this.state.newNutDataDialogOpen &&
          <Dialog
            key="newDialog"
            open={this.state.newNutDataDialogOpen}
            onClose={() => this.handleNewNutrientDialogClose(true)}
            aria-labelledby="form-dialog-title"
            classes={{ paperScrollPaper: this.props.classes.dialogContent }}
          >
            <DialogTitle id="form-dialog-title">New Nutrition Row</DialogTitle>
            <DialogContent className={this.props.classes.dialogContent}>
              <FormControl fullWidth className={this.props.classes.formControl}>
                <SingleSelect
                  label="Nutrient"
                  suggestions={[...[{ label: 'None', val: null }], ...this.state.allNutrients.map((val) => ({
                    ...val,
                    label: val.nutrDesc,
                    value: val.nutrNo,
                  }))]}
                  onChange={(val) => this.handleNutrientFormChange('nutrNo')(val)}
                />
              </FormControl>
              <TextField
                id="nutrVal-new"
                label="Nutr Val"
                value={this.state.dialogRow ? this.state.dialogRow.nutrVal : ''}
                onChange={this.handleNutrientFormChange('nutrVal')}
                margin="normal"
                fullWidth
              />
              <FormControl fullWidth className={this.props.classes.formControl}>
                <SingleSelect
                  label="Reference"
                  suggestions={[...[{ label: 'None', val: null }], ...this.state.allSources.map((val) => ({
                    ...val,
                    label: val.shortForm,
                    value: val.dataSrcId,
                  }))]}
                  onChange={(val) => this.handleNutrientFormChange('dataSrcId')(val)}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleNewNutrientDialogClose(true)} color="primary">
              Cancel
              </Button>
              <Button onClick={() => this.handleNewNutrientDialogClose(false, this.state.dialogRow)} color="primary">
              Save
              </Button>
            </DialogActions>
          </Dialog>
        }

        <div className={this.props.classes.foodBox}>
          <Paper style={{ padding: '8px' }}>
            <FoodForm
              {...this.state.food[0]}
              foodCategories={this.state.foodCategoryOptions}
              budgetCodes={this.state.budgetCodeOptions}
              submitForm={(payload) => this.handleFoodUpdate(payload)}
              submitButtonText="Submit Edit"
            />
          </Paper>
        </div>
        <br />
        <FoodWeightTable
          foodWeights={this.props.foodWeights}
          token={this.props.token}
          allUnits={this.props.allUnits}
          currentFoodId={this.state.food[0].foodId}
        />
        <br />
        <Button
          color="primary"
          variant="contained"
          className={this.props.classes.nutrientAddButton}
          onClick={() => this.handleNewNutrient()}
        >
        Add Nutrient
        </Button>
        <MaterialTable
          title="Nutrients"
          columns={col}
          data={composedData}
          actions={[
            {
              disabled: !hasAccess(this.props.account.role, [Roles.ADMIN]),
              icon: () => <Edit />,
              onClick: (evt, row) => {
                this.setState({ customNutEditDialogOpen: true, dialogRow: row });
              },
              tooltip: 'Nutrient Form',
            },
            {
              disabled: !hasAccess(this.props.account.role, [Roles.ADMIN]),
              icon: () => <Delete />,
              onClick: (evt, row) => {
                this.setState({ deleteNutDataDialogOpen: true, dialogRow: row });
              },
              tooltip: 'Delete Nutrient',
            },
          ]
          }
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 30, this.state.nutritionData.length],
            exportButton: true,
          }}
        />
        <ConfirmationDialog
          id="deleteNutData"
          open={this.state.deleteNutDataDialogOpen}
          onClose={(close) => this.handleNutDataDelete(close)}
          title="Are you sure you want to delete this nutrient record?"
        />
        <Notifications
          ref={this.notificationBar}
        />
      </div>

    );
  }
}
