import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Button, Grid, Paper, Divider, Card,
} from '@material-ui/core';
import MaterialTable from 'material-table';

// material
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


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

import FoodAPI from '../../api/Food';
import FoodCategoryAPI from '../../api/FoodCategories';

import { hasAccess, Home, Food } from '../PageAccess';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  faIcon: {
    fontSize: 18,
    // padding if needed (e.g., theme.spacing.unit * 2)
    margin: theme.spacing.unit * 0.5,
    // margin if needed
  },
});

// https://stackoverflow.com/questions/4149276/javascript-camelcase-to-regular-form
const camelToNorm = (string) => string.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());


class FoodPage extends Component {
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

  detailHelper(rowData) {
    const matchedCategory = this.props.foodCategories.find((category) => rowData.category === category.categoryId);

    const copy = { ...rowData };
    ['foodId', 'sciName', 'ohdzName', 'food', 'tableData', 'active', 'dry', 'meat', 'preChop', 'preBag'].forEach((key) => delete copy[key]);
    const data = Object.keys(copy).map(key => {
      if (key === 'category') {
        return (
          <Grid item xs={12} sm={6} lg={3} key={key}>
            <Card className={this.props.classes.paper}><Typography variant="body1" inline>{camelToNorm(key)}: </Typography><Typography inline variant="body1" color="primary">{String(matchedCategory.foodCategory)}</Typography></Card>
          </Grid>
        );
      }
      return (
        <Grid item xs={12} sm={6} lg={3} key={key}>
          <Card className={this.props.classes.paper}><Typography variant="body1" inline>{camelToNorm(key)}: </Typography><Typography inline variant="body1" color="primary">{String(copy[key])}</Typography></Card>
        </Grid>
      );
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
              <Link href={Food.new.link}>
                <Button className={this.props.classes.button} color="secondary" variant="contained">
                  <FontAwesomeIcon icon={faEdit} className={this.props.classes.faIcon} />
                  View / Edit
                </Button>

              </Link>
              <Link href={Food.new.link}>
                <Button className={this.props.classes.button} color="secondary" variant="contained">
                  <FontAwesomeIcon icon={faSignature} className={this.props.classes.faIcon} />
                  Edit Nickname
                </Button>
              </Link>
            </div>
          </div>
          <Divider variant="middle" style={{ margin: '10px' }} />
          <Grid container spacing={16}>
            {data}
          </Grid>
          {/* <pre>
            {JSON.stringify(rowData, null, 2)}
          </pre> */}

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
                  this.detailHelper(rowData)
                ),
              },
            ]}
            onRowClick={(event, rowData, togglePanel) => {
              togglePanel(0);
            }}

          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FoodPage);
