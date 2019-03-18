import React, { Component } from 'react';
import PropTypes from 'prop-types';

// next
import Link from 'next/link';
import Router from 'next/router';

// material
import Typography from '@material-ui/core/Typography';
import {
  Button, Grid, Paper, Divider, Card,
} from '@material-ui/core';

// material plugins
import MaterialTable from 'material-table';

// icons
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfo, faCheck, faTimes, faSignature, faEdit,
} from '@fortawesome/free-solid-svg-icons';

// API helpers
import FoodAPI from '../../api/Food';
import FoodCategoryAPI from '../../api/FoodCategories';
import BudgetCodeAPI from '../../api/BudgetIds';

// access control helpers
import { hasAccess, Food } from '../PageAccess';

// util methods
import camelToNorm from '../../util/camelToNorm';


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

    return { foodItems: res.data, foodCategories: foodCategories.data, budgetCodes: budgetCodes.data };
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    foodItems: PropTypes.array.isRequired,
    foodCategories: PropTypes.array.isRequired,
    budgetCodes: PropTypes.array.isRequired,
  };

  /**
   * creates detail pane for the food page, this is quick information that helps the nutritionist get information quickly without having to dig
   * @param {Object} rowData data from row in table
   */
  detailHelper(rowData) {
    const relatedRecords = {};

    relatedRecords.category = this.props.foodCategories.find((category) => rowData.category === category.categoryId).foodCategory;
    relatedRecords.budgetId = this.props.budgetCodes.find((budget) => rowData.budgetId === budget.budgetId).budgetCode;

    const copy = { ...rowData };

    // remove keys that are already present
    ['foodId', 'sciName', 'ohdzName', 'food', 'tableData', 'active', 'dry', 'meat', 'preChop', 'preBag'].forEach((key) => delete copy[key]);

    // create mini cards with information and link all related information into their respective keys
    const data = Object.keys(copy).map(key => {
      switch (key) {
        case 'category':
        case 'budgetId':
          return (
            <Grid item xs={12} sm={6} lg={3} key={key}>
              <Card className={this.props.classes.paper}><Typography variant="body1" inline>{camelToNorm(key)}: </Typography><Typography inline variant="body1" color="primary">{String(relatedRecords[key])}</Typography></Card>
            </Grid>
          );
        default:
          return (
            <Grid item xs={12} sm={6} lg={3} key={key}>
              <Card className={this.props.classes.paper}><Typography variant="body1" inline>{camelToNorm(key)}: </Typography><Typography inline variant="body1" color="primary">{String(copy[key])}</Typography></Card>
            </Grid>
          );
      }
    });

    return (
      <div style={{ padding: '10px' }}>
        <Paper style={{ padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography inline variant="h5">{rowData.food}</Typography>
              <Typography inline variant="subtitle1" color="textSecondary"> {rowData.ohdzName} </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Typography inline variant="subtitle1" color="textSecondary" style={{ marginLeft: '5px', marginRight: '5px' }}>Active: {rowData.active === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</Typography>
                <Typography inline variant="subtitle1" color="textSecondary" style={{ marginLeft: '5px', marginRight: '5px' }}>Dry: {rowData.dry === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</Typography>
                <Typography inline variant="subtitle1" color="textSecondary" style={{ marginLeft: '5px', marginRight: '5px' }}>Meat: {rowData.meat === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</Typography>
                <Typography inline variant="subtitle1" color="textSecondary" style={{ marginLeft: '5px', marginRight: '5px' }}>Pre Chop: {rowData.preChop === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</Typography>
                <Typography inline variant="subtitle1" color="textSecondary" style={{ marginLeft: '5px', marginRight: '5px' }}>Pre Bag: {rowData.preBag === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</Typography>
              </div>
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {hasAccess(this.props.account.role, Food.edit.roles) &&
                <Link href={`${Food.edit.link}?id=${rowData.foodId}`}>
                  <Button className={this.props.classes.button} color="secondary" variant="contained">
                    <FontAwesomeIcon icon={faEdit} className={this.props.classes.faIcon} />
                      View / Edit
                  </Button>
                </Link>
              }
              {hasAccess(this.props.account.role, Food.nicknames.roles) &&
                <Link href={`${Food.nicknames.link}?id=${rowData.foodId}`}>
                  <Button className={this.props.classes.button} color="secondary" variant="contained" disabled={rowData.active !== 1}>
                    <FontAwesomeIcon icon={faSignature} className={this.props.classes.faIcon} />
                    Edit Nickname
                  </Button>
                </Link>
              }
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
        <div>
          <MaterialTable
            columns={
              [
                { title: 'Id', field: 'foodId' },
                { title: 'Name', field: 'food' },
                {
                  title: 'Active',
                  field: 'active',
                  render: ((rowData) => (
                    <div className={this.props.classes.activeIcon}>
                      {rowData.active ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                    </div>
                  )),
                },
              ]
            }
            data={this.props.foodItems}
            options={{
              pageSize: 20,
              pageSizeOptions: [20, 50, 100],
              actionsColumnIndex: -1,
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
                  this.detailHelper(rowData)
                ),
              },
            ]}
            onRowClick={(event, rowData, togglePanel) => {
              togglePanel(0);
            }}
            actions={[
              {
                icon: () => (<FontAwesomeIcon icon={faEdit} />),
                tooltip: 'View / Edit',
                disabled: !hasAccess(role, Food.edit.roles),
                onClick: (event, rowData) => {
                  Router.push({
                    pathname: Food.edit.link,
                    query: { id: rowData.foodId },
                  });
                },
              },
              rowData => ({
                icon: () => (<FontAwesomeIcon icon={faSignature} />),
                tooltip: 'Edit Nickname',
                disabled: (rowData.active !== 1 && hasAccess(role, Food.nicknames.roles)),
                onClick: (e, data) => {
                  Router.push({
                    pathname: Food.nicknames.link,
                    query: { id: data.foodId },
                  });
                },
              }),
            ]}
          />
        </div>
      </div>
    );
  }
}

export default FoodPage;
