import React, { Component } from 'react';
import PropTypes from 'prop-types';

// next
import Link from 'next/link';
import Router from 'next/router';

// material
import Typography from '@material-ui/core/Typography';
import { Button, Grid, Paper, Divider, Card } from '@material-ui/core';

// material plugins
import MaterialTable from 'material-table';

// icons
import Delete from '@material-ui/icons/Delete';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faCheck, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

// API helpers
import FoodAPI from '../../api/Food';
import FoodCategoryAPI from '../../api/FoodCategories';
import BudgetCodeAPI from '../../api/BudgetIds';

// access control helpers
import { hasAccess, Food } from '../PageAccess';
import Roles from '../../static/Roles';

// util methods
import camelToNorm from '../../util/camelToNorm';

import { ConfirmationDialog } from '../../components';

import FoodForm from './foodForm';

class FoodPage extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    // api helpers on server side
    const api = new FoodAPI(authToken);
    const categoryAPI = new FoodCategoryAPI(authToken);
    const budgetAPI = new BudgetCodeAPI(authToken);

    // server side grab all data for list view
    const res = await api.getFood().catch((err) => ({ foodItems: [{ err: true, msg: err }] }));
    // grab all categories because its highly likely that we will use them all for ALL the foods listed
    const foodCategories = await categoryAPI.getCategories().catch(() => {});
    const budgetCodes = await budgetAPI.getBudgetCodes().catch(() => {});
    // grab all the budget codes for same reason

    return {
      foodItems: res.data,
      foodCategories: foodCategories.data,
      budgetCodes: budgetCodes.data,
    };
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    foodItems: PropTypes.array.isRequired,
    foodCategories: PropTypes.array.isRequired,
    budgetCodes: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    const { budgetCodes, foodCategories, ...rest } = props;
    this.state = {
      ...rest,
      budgetCodes: budgetCodes.map((item) => ({ label: item.budgetCode, value: item.budgetId })),
      foodCategories: foodCategories.map((item) => ({
        label: item.foodCategory,
        value: item.categoryId,
      })),
      newFoodOpen: false,
      newFood: { food: '' }, // changing this will reset the form
      deleteDialogOpen: false,
      dialogRow: {},
    };

    this.clientFoodAPI = new FoodAPI(this.props.token);
  }

  /**
   * creates detail pane for the food page, this is quick information that helps the nutritionist get information quickly without having to dig
   * @param {Object} rowData data from row in table
   */
  detailHelper(rowData) {
    const relatedRecords = {};

    relatedRecords.category = this.props.foodCategories.find(
      (category) => rowData.category === category.categoryId,
    ).foodCategory;
    relatedRecords.budgetId = this.props.budgetCodes.find(
      (budget) => rowData.budgetId === budget.budgetId,
    ).budgetCode;

    const copy = { ...rowData };

    // remove keys that are already present
    [
      'foodId',
      'sciName',
      'ohdzName',
      'food',
      'tableData',
      'active',
      'dry',
      'meat',
      'preChop',
      'preBag',
    ].forEach((key) => delete copy[key]);

    // create mini cards with information and link all related information into their respective keys
    const data = Object.keys(copy).map((key) => {
      switch (key) {
        case 'category':
        case 'budgetId':
          return (
            <Grid item xs={12} sm={6} lg={3} key={key}>
              <Card className={this.props.classes.paper}>
                <Typography variant="body1" inline>
                  {camelToNorm(key)}:{' '}
                </Typography>
                <Typography inline variant="body1" color="primary">
                  {String(relatedRecords[key])}
                </Typography>
              </Card>
            </Grid>
          );
        default:
          return (
            <Grid item xs={12} sm={6} lg={3} key={key}>
              <Card className={this.props.classes.paper}>
                <Typography variant="body1" inline>
                  {camelToNorm(key)}:{' '}
                </Typography>
                <Typography inline variant="body1" color="primary">
                  {String(copy[key])}
                </Typography>
              </Card>
            </Grid>
          );
      }
    });

    return (
      <div style={{ padding: '10px' }}>
        <Paper style={{ padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography inline variant="h5">
                {rowData.food}
              </Typography>
              <Typography inline variant="subtitle1" color="textSecondary">
                {' '}
                {rowData.ohdzName}{' '}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Typography
                  inline
                  variant="subtitle1"
                  color="textSecondary"
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                >
                  Active:{' '}
                  {rowData.active === 1 ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </Typography>
                <Typography
                  inline
                  variant="subtitle1"
                  color="textSecondary"
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                >
                  Dry:{' '}
                  {rowData.dry === 1 ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </Typography>
                <Typography
                  inline
                  variant="subtitle1"
                  color="textSecondary"
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                >
                  Meat:{' '}
                  {rowData.meat === 1 ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </Typography>
                <Typography
                  inline
                  variant="subtitle1"
                  color="textSecondary"
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                >
                  Pre Chop:{' '}
                  {rowData.preChop === 1 ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </Typography>
                <Typography
                  inline
                  variant="subtitle1"
                  color="textSecondary"
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                >
                  Pre Bag:{' '}
                  {rowData.preBag === 1 ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faTimes} />
                  )}
                </Typography>
              </div>
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {hasAccess(this.props.account.role, Food.edit.roles) && (
                <Link href={`${Food.edit.link}?id=${rowData.foodId}`}>
                  <Button
                    className={this.props.classes.button}
                    color="secondary"
                    variant="contained"
                  >
                    <FontAwesomeIcon icon={faEdit} className={this.props.classes.faIcon} />
                    View / Edit
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <Divider variant="middle" style={{ margin: '10px' }} />
          <Grid container spacing={16}>
            {data}
          </Grid>
        </Paper>
      </div>
    );
  }

  createNewFood(payload) {
    if (!payload) {
      return Promise.reject();
    }
    const prom = new Promise((r, rej) => {
      this.clientFoodAPI.createFood(payload).then(
        (res) => {
          this.setState(
            (prevState) => ({
              newFoodOpen: false,
              newFood: { ...res.data },
              foodItems: [...prevState.foodItems, res.data],
            }),
            () => {
              r();
            },
          );
        },
        (rejected) => {
          console.err(rejected.message);
          rej();
        },
      );
    });
    return prom;
  }

  async handleDelete(shouldDelete) {
    if (shouldDelete) {
      if (this.state.dialogRow && this.state.dialogRow.foodId) {
        const { foodId } = this.state.dialogRow;
        try {
          await this.clientFoodAPI.deleteFood(foodId);
          this.setState((prevState) => ({
            deleteDialogOpen: false,
            foodItems: prevState.foodItems.filter((item) => item.foodId !== foodId),
          }));
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
        {this.state.newFoodOpen && (
          <FoodForm
            {...this.state.newFood}
            foodCategories={this.state.foodCategories}
            budgetCodes={this.state.budgetCodes}
            submitForm={(payload) => this.createNewFood(payload)}
          />
        )}
        {!this.state.newFoodOpen && (
          <Grid item xs={12} md={3} style={{ padding: '10px' }}>
            <Button
              onClick={() => {
                this.setState({ newFoodOpen: true });
              }}
              variant="contained"
              color="primary"
            >
              Add New Food
            </Button>
          </Grid>
        )}

        <div>
          <MaterialTable
            columns={[
              { title: 'Id', field: 'foodId' },
              { title: 'Name', field: 'food' },
              {
                title: 'Active',
                field: 'active',
                render: (rowData) => (
                  <div className={this.props.classes.activeIcon}>
                    {rowData.active ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} />
                    )}
                  </div>
                ),
              },
            ]}
            data={this.state.foodItems}
            options={{
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
              actionsColumnIndex: -1,
              emptyRowsWhenPaging: false,
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
                icon: () => <FontAwesomeIcon icon={faInfo} />,
                render: (rowData) => this.detailHelper(rowData),
              },
            ]}
            onRowClick={(event, rowData, togglePanel) => {
              togglePanel(0);
            }}
            actions={[
              {
                icon: () => <FontAwesomeIcon icon={faEdit} />,
                tooltip: 'View / Edit',
                disabled: !hasAccess(role, Food.edit.roles),
                onClick: (event, rowData) => {
                  Router.push({
                    pathname: Food.edit.link,
                    query: { id: rowData.foodId },
                  });
                },
              },
              {
                disabled: !hasAccess(this.props.account.role, [Roles.ADMIN]),
                icon: () => <Delete />,
                onClick: (evt, row) => {
                  this.setState({ deleteDialogOpen: true, dialogRow: row });
                },
                tooltip: 'Delete Food',
              },
            ]}
          />
        </div>
        <ConfirmationDialog
          open={this.state.deleteDialogOpen}
          onClose={(close) => this.handleDelete(close)}
          title="Are you sure you want to delete this nutrient record?"
        />
      </div>
    );
  }
}

export default FoodPage;
