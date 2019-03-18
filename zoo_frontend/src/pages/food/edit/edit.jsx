import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';

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


import { hasAccess, Home, Food } from '../../PageAccess';

import columnHelper from '../../../util/TableColumnHelper';

import FoodAPI from '../../../api/Food';
import NutDataAPI from '../../../api/NutData';

export default class extends Component {
  static async getInitialProps({ query, authToken }) {
    if (!query.id) {
      // show error and return to view foods
    } else {
      const serverFoodAPI = new FoodAPI(authToken);
      const serverNutDataAPI = new NutDataAPI(authToken);

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

      return {
        ...query,
        food: food.data,
        category: category.data,
        budgetCode: budgetCode.data,
        nutrionData: nutData.data,
        nutDataSources: nutDataDataSources,
        nutDataNutrDefs,
        nutDataSourcedFrom,
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

  render() {
    const { role } = this.props.account;

    const columns = columnHelper(this.state.nutDataNutrDefs);
    console.log(columns);
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{
          justifyContent: 'space-around', alignItems: 'center', display: 'flex',
        }}
        >
          {hasAccess(role, Home.roles) &&
            <Link href={Home.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Home
              </Button>
            </Link>
          }
          {hasAccess(role, Food.roles) &&
            <Link href={Food.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                View food
              </Button>
            </Link>
          }
          {hasAccess(role, Food.new.roles) &&
            <Link href={Food.new.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW food
              </Button>
            </Link>
          }
          {/* TODO add report link logic here */}
          <Link href="/reports/food">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
            food Reports
            </Button>
          </Link>
        </div>
        <MaterialTable
          columns={columns}
          data={this.state.nutDataNutrDefs}
          editable={{

            onRowAdd: newData => new Promise((resolve, reject) => {
              resolve();
              setTimeout(() => {
                // massive logic tree for adding relevant data
                resolve();
              }, 1000);
            }),
            onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
              setTimeout(() => {
                // massive logic tree for modifying current data
                resolve();
              }, 1000);
            }),
            onRowDelete: oldData => new Promise((resolve, reject) => {
              setTimeout(() => {
                // massive logic tree for deleting current data
                resolve();
              }, 1000);
            }),
          }}
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
