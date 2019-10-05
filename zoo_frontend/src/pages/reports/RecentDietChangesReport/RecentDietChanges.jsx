import React, { Component } from 'react';
import moment from 'moment';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Person from '@material-ui/icons/Person';
import Link from '@material-ui/icons/Link';
import AccessTime from '@material-ui/icons/AccessTime';

import Router from 'next/router';
import DietChangeAPI from '../../../api/DietChanges';
import UsersAPI from '../../../api/Users';

const navigateDiet = (dietId) => {
  Router.push(`/diet?id=${dietId}`);
};

class RecentDietChanges extends Component {
  static async getInitialProps({ authToken }) {
    const serverDCAPI = new DietChangeAPI(authToken);
    const serverUserAPI = new UsersAPI(authToken);

    // TODO change to 7 days
    const sevenDaysAgo = moment().subtract(100, 'days');
    const defaultQuery = { where: { dietChangeDate: { gte: sevenDaysAgo } } };
    const dietChangeRes = await serverDCAPI.getDietChanges(defaultQuery);

    // grab all users to make it easier to read who changed what
    const usersRes = await serverUserAPI.getUsers();

    return {
      reportData: dietChangeRes.data,
      defaultDate: sevenDaysAgo,
      allUsers: usersRes.data,
    };
  }

  static propTypes = {
    reportData: PropTypes.arrayOf(PropTypes.object).isRequired,
    api: PropTypes.object.isRequired,
    defaultDate: PropTypes.object.isRequired,
    allUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      date: props.defaultDate,
      reportData: props.reportData,
    };

    this.clientDCAPI = new DietChangeAPI(this.props.api.token);

    this.reportRef = React.createRef();
    this.printer = React.createRef();
  }

  async onDateChange(dateTime) {
    this.setState({ loading: true }, async () => {
      const query = { where: { dietChangeDate: { gte: dateTime } } };
      const res = await this.clientDCAPI.getDietChanges(query);

      this.setState({
        date: dateTime,
        reportData: res.data,
        loading: false,
      });
    });
  }

  render() {
    return (
      <div>
        <Grid container spacing={8} style={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={12}>
            <Card>
              <CardHeader title="All Diet Changes Since" />
              <CardContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DateTimePicker
                    format="MM/DD/YYYY h:mma"
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
              </CardContent>
            </Card>
          </Grid>
          {this.state.loading && <LinearProgress />}
          {!this.state.loading && this.state.reportData.length === 0 && (
            <div style={{ justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
              <Typography variant="h3" color="textSecondary">
                No Results
              </Typography>
            </div>
          )}
          {!this.state.loading && this.state.reportData.length > 0 && (
            <>
              {this.state.reportData.map((dietChange) => {
                const dietChangedBy = this.props.allUsers.find((u) => u.id === dietChange.userId);
                return (
                  <Grid item xs={12} sm={10} lg={8}>
                    <Card>
                      <CardHeader
                        title={`Diet: ${dietChange.dietId}`}
                        titleTypographyProps={{ variant: 'h6', color: 'textSecondary' }}
                        subheader={
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <AccessTime style={{ marginRight: '5px' }} color="secondary" />
                              <Typography inline variant="subtitle1">
                                {moment(dietChange.dietChangeDate).format('h:mmA MM/DD/YY')}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Person style={{ marginRight: '5px ' }} color="secondary" />
                              <Typography inline variant="subtitle1">
                                {dietChangedBy.email}
                              </Typography>
                            </Grid>
                          </Grid>
                        }
                        action={
                          <IconButton onClick={() => navigateDiet(dietChange.dietId)}>
                            <Link color="primary" />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <Typography inline variant="h6" color="primary">
                          Change Reason:
                        </Typography>
                        <Typography inline variant="subtitle1">
                          {dietChange.dietChangeReason}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
      </div>
    );
  }
}

export default RecentDietChanges;
