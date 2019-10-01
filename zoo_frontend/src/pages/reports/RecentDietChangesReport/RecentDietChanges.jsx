import React, { Component } from 'react';
import moment from 'moment';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';

import DietChangeAPI from '../../../api/DietChanges';

class RecentDietChanges extends Component {
  static async getInitialProps({ authToken }) {
    const serverDCAPI = new DietChangeAPI(authToken);

    // TODO change to 7 days
    const sevenDaysAgo = moment().subtract(100, 'days');
    const defaultQuery = { where: { dietChangeDate: { gte: sevenDaysAgo } } };
    const res = await serverDCAPI.getDietChanges(defaultQuery);

    return {
      reportData: res.data,
      reportRaw: res,
      defaultDate: sevenDaysAgo,
    };
  }

  static propTypes = {
    reportData: PropTypes.arrayOf(PropTypes.object).isRequired,
    api: PropTypes.object.isRequired,
    defaultDate: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: props.defaultDate,
    };

    this.clientDCAPI = new DietChangeAPI(this.props.api.token);

    this.reportRef = React.createRef();
    this.printer = React.createRef();
  }

  async onDateChange(dateTime) {
    this.setState({ loading: true }, async () => {
      const query = { where: { dietChangeDate: { gte: dateTime } } };
      const res = await this.clientDCAPI.getDietChanges(query);

      console.log(res.data);
      this.setState({
        date: dateTime,
        reportData: res.data,
        loading: false,
      });
    });
  }

  render() {
    console.log(this.props);

    const { classes } = this.props;
    return (
      <div>
        <div className={classes} />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            keyboard
            format="MM/DD/YYYY hh:mmaa"
            value={this.state.date}
            onChange={(newDate) => this.onDateChange(newDate)}
            mask={[
              /\d/,
              /\d/,
              '/',
              /\d/,
              /\d/,
              '/',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
              ' ',
              /\d/,
              /\d/,
              ':',
              /\d/,
              /\d/,
              /a|p/,
              /m/,
            ]}
            label="Since"
            style={{ width: 300 }}
            variant="outlined"
          />
        </MuiPickersUtilsProvider>

        {this.state.loading && <LinearProgress />}
        {!this.state.loading && <div>{this.props.reportData.length}</div>}
      </div>
    );
  }
}

export default RecentDietChanges;
