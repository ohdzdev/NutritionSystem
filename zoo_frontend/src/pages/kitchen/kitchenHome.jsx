import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Router from 'next/router';

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';

import PrintPrepSheets from '../../components/PrintPrepSheets';
import { Kitchen } from '../PageAccess';

class KitchenHome extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
    };
  }

  onDateChange = (date) => this.setState({ date });

  handlePrepScreen = () => {
    Router.push({
      pathname: Kitchen.prep.link,
      query: { date: this.state.date.format('YYYY-M-D') },
    });
  };

  render() {
    const { classes = {}, token } = this.props;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div className={classes.root}>
          <div className={classes.item}>
            <DatePicker
              keyboard
              format="MM/DD/YYYY"
              value={this.state.date}
              onChange={this.onDateChange}
              mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
              label="Prep For Date"
              style={{ width: 300 }}
            />
          </div>
          <div className={classes.item}>
            <PrintPrepSheets date={this.state.date} token={token} />
          </div>
          <div className={classes.item}>
            <Button variant="contained" color="primary" onClick={this.handlePrepScreen}>
              Open Prep Screen
            </Button>
          </div>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default KitchenHome;
