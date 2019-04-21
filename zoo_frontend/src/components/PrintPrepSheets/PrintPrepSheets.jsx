import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import FoodAPI from '../../api/Food';

import PrepSheetPrintOut from './PrepSheetPrintOut';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.unit * 2,
  },
  printButton: {
    marginLeft: theme.spacing.unit * 2,
  },
});

const printOutPageStyle = '@page { size: auto;  margin: 6% 5%; } @media print { body { -webkit-print-color-adjust: exact; } }';

class PrintPrepSheets extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      meatPrepSheetData: [],
      veggiePrepSheetData: [],
      date: moment(),
    };

    this.printOutMeat = React.createRef();
    this.printOutVeggie = React.createRef();
    this.printerMeat = React.createRef();
    this.printerVeggie = React.createRef();
  }

  handlePrint = async () => {
    const foodApi = new FoodAPI(this.props.token);

    const { date } = this.state;

    const res = await foodApi.getPrepDaySheets(date.format('YYYY-M-D'));

    const meat = res.data.filter((food) => !!food.meat);
    const veggies = res.data.filter((food) => !food.meat);

    const meatSums = [];

    meat.forEach((food) => {
      const found = meatSums.find((sum) => sum.food === food.food);

      if (found) {
        found.total += food.group_amount;
      } else {
        meatSums.push({
          food: food.food,
          unit: food.unit,
          total: food.group_amount,
        });
      }
    });

    const veggieSums = [];

    veggies.forEach((food) => {
      const found = veggieSums.find((sum) => sum.food === food.food);

      if (found) {
        found.total += food.group_amount;
      } else {
        veggieSums.push({
          food: food.food,
          unit: food.unit,
          total: food.group_amount,
        });
      }
    });

    this.setState({
      meatPrepSheetData: meatSums,
      veggiePrepSheetData: veggieSums,
    }, () => {
      this.printerMeat.current.handlePrint();
    });
  }

  onAfterMeatPrint = () => {
    this.printerVeggie.current.handlePrint();
  }

  onDateChange = (date) => this.setState({ date })

  render() {
    const { classes } = this.props;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className={classes.container}>
          <DatePicker
            keyboard
            format="MM/DD/YYYY"
            value={this.state.date}
            onChange={this.onDateChange}
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            label="Prep Sheet Date"
          />
          <ReactToPrint
            ref={this.printerMeat}
            trigger={() => <div style={{ display: 'none' }} />}
            content={() => this.printOutMeat.current}
            pageStyle={printOutPageStyle}
            onAfterPrint={this.onAfterMeatPrint}
          />
          <ReactToPrint
            ref={this.printerVeggie}
            trigger={() => <div style={{ display: 'none' }} />}
            content={() => this.printOutVeggie.current}
            pageStyle={printOutPageStyle}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.printButton}
            onClick={this.handlePrint}
          >
            Print Prep Sheets
          </Button>
          <div style={{ display: 'none' }}>
            <PrepSheetPrintOut
              ref={this.printOutMeat}
              prepSheetData={this.state.meatPrepSheetData}
              date={this.state.date}
            />
          </div>
          <div style={{ display: 'none' }}>
            <PrepSheetPrintOut
              ref={this.printOutVeggie}
              prepSheetData={this.state.veggiePrepSheetData}
              date={this.state.date}
            />
          </div>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withStyles(styles)(PrintPrepSheets);
