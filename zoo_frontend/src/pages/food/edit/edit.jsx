import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Link from 'next/link';
import { Grid, Paper, TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import { SingleSelect } from 'react-select-material-ui';


// icons
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

export default class extends Component {
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
        nutrionData: nutData.data,
        nutDataSources: nutDataDataSources,
        nutDataNutrDefs,
        nutDataSourcedFrom,
        allNutrients: allNutrients.data,
        allSources: allSources.data,
      };
    }
    return {};
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    const {
      api, account, router, pageContext, classes, ...rest // eslint-disable-line react/prop-types
    } = props;
    this.state = {
      ...rest,
    };
    console.log(this.state);
  }

  handleChange(value) { // eslint-disable-line
    console.log('wow', value);
  }

  render() {
    const composedData = this.state.nutrionData.map((val, index) => {
      const { shortForm } = this.state.nutDataSources.find((source) => source.dataSrcId === val.dataSrcId) || {};
      const { nutrDesc, units } = this.state.nutDataNutrDefs.find((def) => def.dataId === val.dataId) || {};
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
              type: 'picklist', dataSource: 'allNutrients', labelKey: 'nutrDesc', valueKey: 'nutrNo',
            },
            addModDate: 'disabled',
            nutrVal: 'text',
            units: 'disabled',
            shortForm: {
              type: 'picklist', dataSource: 'allSources', labelKey: 'shortForm', valueKey: 'dataSrcId',
            },
          },
        },
        addModDate: val.addModDate,
        nutrVal: val.nutrVal,
        shortForm: shortForm || '',
        nutrDesc,
        units,
      };
    });
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
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <MaterialTable
          title="Nutrients"
          columns={col}
          data={composedData}
          detailPanel={[
            {
              icon: 'edit',
              tooltip: 'Edit Nutrition Element',
              render: ((rowData) => {
                const {
                  meta, tableData, ...rest
                } = rowData;
                console.log(rowData);
                return (
                  <div id={rowData.meta.index}>
                    <Paper>
                      <form noValidate autoComplete="off">
                        <Grid container>
                          { Object.entries(rest).map((item) => {
                            // from meta in rowData figure out what type of field we have and display information accordingly
                            const fieldType = meta.types[item[0]];
                            // if string filter out disabled and then present text input field
                            if (typeof fieldType === 'string' && fieldType !== 'disabled') {
                              // from our original columns get the title and label or text input field
                              console.log(item[0]);
                              const fieldTitle = 'asdf';
                              return (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                  <TextField
                                    id={item[0]}
                                    label={fieldTitle}
                                    value={item[1]}
                                    // onChange={this.handleChange(item[0])}
                                    margin="normal"
                                  />
                                </Grid>
                              );
                            }
                            // if we have picklist type or another, use the picklist to grab the dataSource from the state and display to user
                            if (typeof fieldType === 'object') {
                              // raw data from the state to be iterated and presented to the user as selections
                              // NOTE: meta should have 2 keys: labelKey and labelValue defined from this object
                              const picklistSource = this.state[fieldType.dataSource];
                              return (
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                  <SingleSelect
                                    options={picklistSource.map((val) => ({
                                      ...val,
                                      label: val[fieldType.labelKey],
                                      value: val[fieldType.labelValue],
                                    }))}
                                    value={rest[fieldType.labelKey]}
                                  />
                                </Grid>
                              );
                            }
                            return null;
                          })}
                        </Grid>
                      </form>
                    </Paper>
                  </div>
                );
              }),
            },
          ]}
          options={{
            pageSize: 20,
            pageSizeOptions: [20, 50, this.state.nutDataSources.length],
            exportButton: true,
            doubleHorizontalScroll: true,
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
