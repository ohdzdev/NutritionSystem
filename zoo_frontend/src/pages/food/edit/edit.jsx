import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Paper, Typography,
} from '@material-ui/core';
import MaterialTable from 'material-table';

// icons
import Search from '@material-ui/icons/Search';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Export from '@material-ui/icons/SaveAlt';
import Filter from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ThirdStateCheck from '@material-ui/icons/Remove';
import ViewColumn from '@material-ui/icons/ViewColumn';

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
} from '../../../api';
// actual API repo
import nutDataAPIModel from '../../../../../zoo_api/common/models/NUT_DATA.json';

// access control
import { hasAccess } from '../../PageAccess';
import Roles from '../../../static/Roles';

import FoodForm from './foodForm';

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
  };

  static defaultProps = {
    token: '',
  }

  static async getInitialProps({ query, authToken }) {
    if (!query.id) {
      // show error and return to view foods
    } else {
      // init server side related record APIS
      const serverFoodAPI = new FoodAPI(authToken);
      const serverNutDataAPI = new NutDataAPI(authToken);
      const serverNutrDataAPI = new NutrDefAPI(authToken);
      const serverDataSrcAPI = new DataSrcAPI(authToken);
      const categoryAPI = new FoodCategoryAPI(authToken);
      const budgetAPI = new BudgetCodeAPI(authToken);

      // grab all related records on server
      const foodCategories = await categoryAPI.getCategories().catch(() => {});
      const budgetCodes = await budgetAPI.getBudgetCodes().catch(() => {});
      const food = await serverFoodAPI.getFood({ where: { foodId: query.id } });
      const category = await serverFoodAPI.getRelatedCategory(query.id);
      const budgetCode = await serverFoodAPI.getRelatedBudgetCode(query.id);

      const nutData = await serverNutDataAPI.getNutData({ where: { foodId: query.id } });
      // loop over nutData results and grab their respective nutrition sources
      const nutDataSourcePromises = nutData.data.map((nut) => new Promise((resolve, reject) => {
        const nutId = nut.dataId;
        serverNutDataAPI.getRelatedNutritonSource(nutId).then((res) => {
          resolve({ ...res.data, dataId: nutId });
        }, (rej) => {
          reject(rej);
        });
      }));

      const nutDataDataSources = await Promise.all(nutDataSourcePromises).catch((err) => {
        console.error(err);
      });

      // loop over nutData results and grab their respective nutrition sources
      const nutDataNutrDefPromises = nutData.data.map((nut) => new Promise((resolve, reject) => {
        const nutId = nut.dataId;
        serverNutDataAPI.getRelatedNutrDef(nutId).then((res) => {
          resolve({ ...res.data, dataId: nutId });
        }, (rej) => {
          reject(rej);
        });
      }));

      const nutDataNutrDefs = await Promise.all(nutDataNutrDefPromises).catch((err) => {
        console.error(err);
      });


      // loop over nutData results and grab their respective nutrition sources
      const nutDataSourcedFromPromises = nutData.data.map((nut) => new Promise((resolve, reject) => {
        const nutId = nut.dataId;
        serverNutDataAPI.getRelatedSourceCd(nutId).then((res) => {
          resolve({ ...res.data, dataId: nutId });
        }, (rej) => {
          reject(rej);
        });
      }));

      const nutDataSourcedFrom = await Promise.all(nutDataSourcedFromPromises).catch((err) => {
        console.error(err);
      });

      const allNutrients = await serverNutrDataAPI.getNutrDef().catch((err) => {
        console.error(err);
      });
      const allSources = await serverDataSrcAPI.getSources().catch((err) => {
        console.error(err);
      });

      return {
        ...query,
        food: food.data,
        category: category.data,
        budgetCode: budgetCode.data,
        nutritionData: nutData.data,
        nutDataSources: nutDataDataSources,
        nutDataNutrDefs,
        nutDataSourcedFrom,
        allNutrients: allNutrients.data,
        allSources: allSources.data,
        foodCategories: foodCategories.data,
        budgetCodes: budgetCodes.data,
      };
    }
    return {};
  }

  constructor(props) {
    super(props);
    const {
      api, account, router, pageContext, classes, budgetCodes, foodCategories, ...rest // eslint-disable-line react/prop-types
    } = props;
    this.state = {
      ...rest,
      budgetCodes: budgetCodes.map((item) => ({ label: item.budgetCode, value: item.budgetId })),
      foodCategories: foodCategories.map((item) => ({ label: item.foodCategory, value: item.categoryId })),
      dialogOpen: false, // dialog open?
      deleteDialogOpen: false,
      newDialogOpen: false,
      dialogRow: {}, // row for which we are editing
      dirty: false, // was a field editing?
    };
    console.log(this.state);
    console.log(this.state.token);
    this.clientNutDataAPI = new NutDataAPI(this.state.token);
  }

  handleChange = fieldName => evt => {
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
      }), () => { console.log(this.state.dialogRow); });
    }
  }

  handleSave() {
    if (this.state.dialogRow && this.state.dirty) {
      // update row on backend


      // if success then update state for re-render table
      // update original state data
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
            dialogOpen: false,
            dialogRow: {},
            dirty: false,
          };
        }, () => {
          // update api here
          console.log(this.state.nutritionData[tableRow]);
          const localRow = { ...this.state.nutritionData[tableRow] };
          const APIColumns = Object.keys(nutDataAPIModel.properties);
          console.log(localRow);
          console.log(APIColumns);
          // clean all nonAPI colums out of localrow
          Object.keys(localRow).forEach((key) => {
            if (APIColumns.indexOf(key) === -1) {
              delete localRow[key];
            }
          });
          console.log(localRow.dataId, localRow);
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
      this.setState({ dialogOpen: false, dialogRow: {}, dirty: false });
    }
  }

  handleCancelDialogue() {
    this.setState({ dialogOpen: false, dialogRow: {}, dirty: false });
  }

  async handleDelete(shouldDelete) {
    if (shouldDelete) {
      console.log(this.state);
      if (this.state.dialogRow && this.state.dialogRow.meta && this.state.dialogRow.meta.relatedIds.dataId) {
        const { dataId } = this.state.dialogRow.meta.relatedIds;
        try {
          await this.clientNutDataAPI.deleteNutData(dataId);
          this.setState((prevState) => ({ deleteDialogOpen: false, nutritionData: prevState.nutritionData.filter((item) => item.dataId !== dataId) }));
        } catch (error) {
          // clear incorrect state
          this.setState({ deleteDialogOpen: false, dialogRow: {} });
        }
      } else {
        // clear incorrect state
        this.setState({ deleteDialogOpen: false, dialogRow: {} });
      }
    }
  }

  handleNewNutrient() {
    this.setState({ newDialogOpen: true });
  }

  async handleNewNutrientDialogClose(cancelled, data) {
    if (cancelled || !data) {
      this.setState({ newDialogOpen: false });
    } else {
      try {
        const newRow = { ...data };
        newRow.addModDate = new Date().toISOString(); // update the modified date
        newRow.foodId = this.state.food[0].foodId;
        const res = await this.clientNutDataAPI.createNutData(newRow);
        this.setState((prevState) => ({
          newDialogOpen: false, nutritionData: [...prevState.nutritionData, res.data], dialgoRow: {}, dirty: false,
        }));
      } catch (error) {
        this.setState({
          newDialogOpen: false,
          dialogRow: {},
          dirty: false,
        });
        // TODO present error to user
        console.error(error);
      }
    }
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
        {this.state.dialogOpen &&
          <Dialog
            key="editDialog"
            open={this.state.dialogOpen}
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
                      onChange={this.handleChange(item[0])}
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
                        onChange={(val) => this.handleChange(stateUpdateField)(val)}
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
              <Button onClick={() => this.handleSave()} color="primary">
              Save
              </Button>
            </DialogActions>
          </Dialog>
        }
        {this.state.newDialogOpen &&
          <Dialog
            key="newDialog"
            open={this.state.newDialogOpen}
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
                  onChange={(val) => this.handleChange('nutrNo')(val)}
                />
              </FormControl>
              <TextField
                id="nutrVal-new"
                label="Nutr Val"
                value={this.state.dialogRow ? this.state.dialogRow.nutrVal : ''}
                onChange={this.handleChange('nutrVal')}
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
                  onChange={(val) => this.handleChange('dataSrcId')(val)}
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
              foodCategories={this.state.foodCategories}
              budgetCodes={this.state.budgetCodes}
            />
            <Typography variant="h2">
              {this.state.food[0].food}
            </Typography>
          </Paper>
        </div>

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
                this.setState({ dialogOpen: true, dialogRow: row });
              },
              tooltip: 'Nutrient Form',
            },
            {
              disabled: !hasAccess(this.props.account.role, [Roles.ADMIN]),
              icon: () => <Delete />,
              onClick: (evt, row) => {
                console.log(row);
                this.setState({ deleteDialogOpen: true, dialogRow: row });
              },
              tooltip: 'Delete Nutrient',
            },
          ]
          }
          options={{
            pageSize: 20,
            pageSizeOptions: [20, 50, this.state.nutDataSources.length],
            exportButton: true,
          }}
          icons={{
            Add,
            Check,
            Clear,
            Delete,
            DetailPanel: NextPage,
            Edit,
            Export,
            Filter,
            FirstPage,
            LastPage,
            NextPage,
            PreviousPage,
            ResetSearch: Clear,
            Search,
            ThirdStateCheck,
            ViewColumn,
          }}
        />
        <ConfirmationDialog
          open={this.state.deleteDialogOpen}
          onClose={(close) => this.handleDelete(close)}
          title="Are you sure you want to delete this nutrient record?"
        />
        <Notifications
          ref={(ref) => { this.notificationBar = ref; }}
        />
      </div>

    );
  }
}
