import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';

// icons
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

import FoodAPI from '../../api/Food';
import FoodCategoryAPI from '../../api/FoodCategories';

import { hasAccess, Home, Food } from '../PageAccess';

export default class extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new FoodAPI(authToken);
    const categoryAPI = new FoodCategoryAPI(authToken);
    const res = await api.getFood().catch((err) => ({ foodItems: [{ err: true, msg: err }] }));
    const foodCategories = await categoryAPI.getCategories().catch((() => {}));
    return { foodItems: res.data, foodCategories: foodCategories.data };
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    foodItems: PropTypes.array.isRequired,
    foodCategories: PropTypes.array.isRequired,
  };

  render() {
    const { role } = this.props.account;
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
          {hasAccess(role, Food.edit.roles) &&
            <Link href={Food.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                EDIT food
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
        <div>
          <MaterialTable
            columns={
              [
                { title: 'Id', field: 'foodId' },
                { title: 'Name', field: 'food' },
                { title: 'Active', field: 'active' },
              ]
            }
            data={this.props.foodItems}
            options={{
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
            }}
            icons={{
              Search,
              FirstPage,
              LastPage,
              NextPage,
              PreviousPage,
            }}
            title="Food List"
            detailPanel={[
              {
                tooltip: 'Food Nutrition Details',
                icon: () => (<FontAwesomeIcon icon={faInfo} />),
                render: rowData => (
                  <div>
                    <pre>
                      {JSON.stringify(rowData, null, 2)}
                    </pre>
                  </div>
                ),
              },
            ]}
            onRowClick={(event, rowData, togglePanel) => {
              togglePanel(0);
            }}

          />
          <div>
            <pre>
              {JSON.stringify(this.props.foodCategories, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
