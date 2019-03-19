import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import Edit from '@material-ui/icons/Edit';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';

import ErrorPage from '../../../components/ErrorPage';

import UsersAPI from '../../../api/Users';
import DepartmentAPI from '../../../api/Departments';
import RolesAPI from '../../../api/Roles';
import RoleMappingsAPI from '../../../api/RoleMappings';

const generateStateData = (users, locations, roles, roleMappings) => {
  let locationLookupIds = {};
  locationLookupIds[0] = 'None';

  locationLookupIds = locations.slice(0).reduce((acc, location) => {
    acc[location.locationId] = location.location;
    return acc;
  }, locationLookupIds);

  let locationLookup = {};
  locationLookup.None = 'None';

  locationLookup = locations.slice(0).sort((a, b) => (a.location > b.location ? 1 : -1)).reduce((acc, location) => {
    acc[location.location] = location.location;
    return acc;
  }, locationLookup);

  const userData = users.map((user) => {
    let userRole = 'None';

    roleMappings.forEach((roleMapping) => {
      if (roleMapping.principalType === 'USER') {
        if (Number(roleMapping.principalId) === user.id) {
          roles.forEach((role) => {
            if (role.id === roleMapping.roleId) {
              userRole = role.name;
            }
          });
        }
      }
    });

    return {
      ...user,
      role: userRole,
      locationId: user.locationId || 0,
      locationName: locationLookupIds[user.locationId || 0],
    };
  });

  let roleLookup = {};
  roleLookup.None = 'None';

  roleLookup = roles.slice(0).sort((a, b) => (a.name > b.name ? 1 : -1)).reduce((acc, role) => {
    acc[role.name] = role.name;
    return acc;
  }, roleLookup);

  return {
    userData,
    locationLookup,
    roleLookup,
  };
};


class User extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const usersApi = new UsersAPI(authToken);
    const departmentsApi = new DepartmentAPI(authToken);
    const rolesApi = new RolesAPI(authToken);
    const roleMappings = new RoleMappingsAPI(authToken);
    try {
      const [usersRes, locRes, rolesRes, roleMapRes] = await Promise.all([
        usersApi.getUsers(),
        departmentsApi.getDepartments(),
        rolesApi.getRoles(),
        roleMappings.getRoleMappings(),
      ]);
      return {
        users: usersRes.data,
        locations: locRes.data,
        roles: rolesRes.data,
        roleMappings: roleMapRes.data,
      };
    } catch (err) {
      return {
        users: [],
        locations: [],
        roles: [],
        roleMappings: [],
        error: true,
        errorMessage: 'Error loading data.',
      };
    }
  }

  static propTypes = {
    // account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
    roleMappings: PropTypes.arrayOf(PropTypes.object).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    token: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    error: false,
    errorMessage: '',
    token: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      token: props.token,
      ...generateStateData(this.props.users, this.props.locations, this.props.roles, this.props.roleMappings),
      locations: this.props.locations,
      roles: this.props.roles,
    };
  }

  onRowAdd = (newData) => new Promise((resolve, reject) => {
    console.log(newData);
    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise((resolve, reject) => {

  })

  onRowDelete = (oldData) => new Promise((resolve, reject) => {

  })

  render() {
    if (this.props.error) {
      return (<ErrorPage message={this.props.errorMessage} />);
    }

    const { userData, locationLookup, roleLookup } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className={this.props.classes.table}>
          <MaterialTable
            icons={{
              Search,
              FirstPage,
              LastPage,
              NextPage,
              PreviousPage,
              Edit,
              Add,
              Delete,
              Check,
              Clear,
            }}
            columns={[
              { title: 'First Name', field: 'firstName' },
              { title: 'Last Name', field: 'lastName' },
              { title: 'Email', field: 'email' },
              {
                title: 'Role',
                field: 'role',
                lookup: roleLookup,
              },
              {
                title: 'Location',
                field: 'locationName',
                lookup: locationLookup,
              },
            ]}
            data={userData}
            title="User Management"
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 50, 100],
              exportButton: true,
            }}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
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

export default User;
