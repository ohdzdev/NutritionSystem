import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';

import UsersAPI from '../../static/Users';

import { hasAccess, Admin, User } from '../PageAccess';

class Home extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    this.api = new UsersAPI(authToken);
    const res = await this.api.getUsers().catch((err) => ({ data: [{ err: true, msg: err }] }));
    return { users: res.data };
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string,
    users: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
    };
    console.log(props.classes);
  }

  render() {
    const { role } = this.props.account;
    const userData = this.props.users;
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
          {hasAccess(role, Admin.roles) &&
            <Link href={Admin.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Admin Home
              </Button>
            </Link>
          }
          {hasAccess(role, User.roles) &&
            <Link href={User.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                EDIT User
              </Button>
            </Link>
          }
          {hasAccess(role, User.new.link) &&
            <Link href="/admin/user/new">
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW User
              </Button>
            </Link>
          }
          {hasAccess(role, User['pw-reset'].roles) &&
            <Link href={User['pw-reset'].link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                User Password Resets
              </Button>
            </Link>
          }
          {/* TODO add reports link logic here */}
          <Link href="/reports/user">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              User Reports
            </Button>
          </Link>
        </div>
        <div className={this.props.classes.table}>
          <MaterialTable
            icons={{
              Search,
              FirstPage,
              LastPage,
              NextPage,
              PreviousPage,
            }}
            columns={[
              { title: 'EmployeeID', field: 'employeeId' },
              { title: 'Employee', field: 'employee' },
              { title: 'User Login', field: 'userLogin' },
              { title: 'Initials', field: 'initials' },
              { title: 'LocationID', field: 'locationId' },
            ]}
            data={userData}
            title="User Management"
            actions={[
              {
                icon: AccountCircle,
                tooltip: 'Show User Info',
                onClick: (event, rowData) => {
                  alert(`You clicked user ${rowData.name}`);
                },
              },
            ]}
            localization={{
              pagination: {
                labelDisplayedRows: '{from}-{to} of {count}',
                labelRowsPerPage: 'Rows per page:',
                firstAriaLabel: 'First Page',
                firstTooltip: 'First Page',
                previousAriaLabel: 'Previous Page',
                previousTooltip: 'Previous Page',
                nextAriaLabel: 'Next Page',
                nextTooltip: 'Next Page',
                lastAriaLabel: 'Last Page',
                lastTooltip: 'Last Page',
              },
              toolbar: {
                nRowsSelected: '{0} rows(s) selected',
                showColumnsTitle: 'Show Columns',
                showColumnsAriaLabel: 'Show Columns',
                exportTitle: 'Export',
                exportAriaLabel: 'Export',
                exportName: 'Export as CSV',
                searchTooltip: 'Search',
              },
              header: {
                actions: 'Actions',
              },
              body: {
                emptyDataSourceMessage: 'No records to display',
                filterRow: {
                  filterTooltip: 'Filter',
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Home;
