import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Link from 'next/link';
import {
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { SingleSelect } from 'react-select-material-ui';

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


import {
  Food as FoodAPI, NutData as NutDataAPI, NutrDef as NutrDefAPI, DataSrc as DataSrcAPI,
} from '../../../api';
import { hasAccess } from '../../PageAccess';
import Roles from '../../../static/Roles';

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
      const serverFoodAPI = new FoodAPI(authToken);
      const serverNutDataAPI = new NutDataAPI(authToken);
      const serverNutrDataAPI = new NutrDefAPI(authToken);
      const serverDataSrcAPI = new DataSrcAPI(authToken);

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
      };
    }
    return {};
  }

  constructor(props) {
    super(props);
    const {
      api, account, router, pageContext, classes, ...rest // eslint-disable-line react/prop-types
    } = props;
    this.state = {
      ...rest,
      dialogOpen: false, // dialog open?
      dialogRow: {}, // row for which we are editing
      dirty: false, // was a field editing?
    };
    console.log(this.state);
  }

  handleChange = fieldName => evt => {
    let newVal = null;
    if (typeof evt !== 'string' && typeof evt !== 'number') {
      newVal = evt.target.value;
    } else {
      newVal = evt;
    }

    console.log(fieldName, newVal, this.state.dialogRow);
    if (this.state.dialogRow) {
      this.setState((prevState) => ({
        dialogRow: {
          ...prevState.dialogRow,
          [fieldName]: newVal,
        },
        dirty: true,
      }), () => { console.log('after update', this.state.dialogRow); });
    }
  }

  handleSave() {
    console.log('saving dirty: ', this.state.dirty);
    if (this.state.dialogRow && this.state.dirty) {
      // update row on backend


      // if success then update state for re-render table
      // update original state data
      console.log(this.state.dialogRow);
      const row = { ...this.state.dialogRow };
      const tableRow = row.meta.index;
      row.addModDate = new Date().toISOString(); // update the modified date

      const previousStateRow = this.state.nutritionData[tableRow];
      // iterate over previous nut data row and if previous value had a number, parseFloat the number in state so we match
      // reasoning behind this is when the user is editing we don't want to remove their .'s when they are typing
      Object.entries(previousStateRow).forEach((nutData) => {
        // if key match then check if a number and if it is parseFloat and overwrite previous
        if (nutData[0] in row) {
          if (typeof nutData[1] === 'number') {
            row[nutData[0]] = parseFloat(row[nutData[0]]);
          }
        }
      });

      if (this.state.dialogRow.meta && row.meta.index > -1) {
        this.setState((prevState) => {
          const newNutritionData = [...prevState.nutritionData.map((item, dex) => {
            if (dex !== tableRow) {
              return item;
            }
            const updatedRow = { ...item, ...row };
            return updatedRow;
          })];
          return {
            nutritionData: newNutritionData,
            dialogOpen: false,
            dialogRow: {},
            dirty: false,
          };
        }, () => { console.log(this.state.nutritionData); });
      }
      // if fail present error from api to user
    } else { // no edits
      this.setState({ dialogOpen: false, dialogRow: {}, dirty: false });
    }
  }

  handleCancelDialogue() {
    this.setState({ dialogOpen: false, dialogRow: {}, dirty: false });
  }

  render() {
    console.log('re-render!');
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
        <Dialog
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
              console.log(item[0], fieldType);
              if (typeof fieldType === 'string' && fieldType !== 'disabled') {
              // from our original columns get the title and label or text input field
                const field = col.find((i) => i.field === item[0]);
                return (
                  <TextField
                    id={item[0]}
                    label={field.title}
                    value={item[1]}
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
                console.log(item, picklistSource);
                const stateUpdateField = meta.types[item[0]].stateSourceKey;
                const field = col.find((i) => i.field === item[0]);
                return (
                  <FormControl fullWidth className={this.props.classes.formControl}>
                    <SingleSelect
                      label={field.title}
                      SelectProps
                      options={picklistSource.map((val) => ({
                        ...val,
                        label: val[fieldType.labelKey],
                        value: val[fieldType.valueKey],
                      }))}
                      value={this.state.dialogRow[fieldType.valueKey]}
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
        <MaterialTable
          title="Nutrients"
          columns={col}
          data={composedData}
          actions={[
            {
              disabled: !hasAccess(this.props.account.role, [Roles.ADMIN]),
              icon: () => <Edit />,
              onClick: (evt, row) => {
                console.log(row);
                this.setState({ dialogOpen: true, dialogRow: row });
              },
              tooltip: 'Edit Nutrition Information',
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
      </div>
    );
  }
}
