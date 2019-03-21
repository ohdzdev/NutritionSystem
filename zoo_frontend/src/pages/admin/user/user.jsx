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

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    console.log(newData);
    // Reject the new user if there is no firstname, lastname, email, role, or location
    if (!newData.firstName || !newData.lastName || !newData.email || !newData.role || !newData.locationName) {
      reject();
      return;
    }

    const password = window.prompt('Please enter a password for the new user:', 'OmahaZoo'); // eslint-disable-line no-alert
    if (password) {
      const usersApi = new UsersAPI(this.state.token);
      const roleMappingApi = new RoleMappingsAPI(this.state.token);

      // Find the selected location
      let location = this.state.locations.find((l) => l.location === newData.locationName);

      if (!location) {
        if (newData.locationName === 'None') {
          location = { locationId: null };
        } else {
          reject();
          return;
        }
      }

      // Find the selected role
      let role = this.state.roles.find((r) => r.name === newData.role);

      if (!role) {
        if (newData.role === 'None') {
          role = { id: -1 };
        } else {
          reject();
          return;
        }
      }

      let user = null;

      try {
        // Create the user
        const res = await usersApi.createUser(newData.firstName, newData.lastName, newData.email, location.locationId, password);
        user = res.data;
      } catch (err) {
        reject();
        return;
      }

      try {
        // Add the user to the role
        await roleMappingApi.assignRole(user.id, role.id);
      } catch (err) {
        reject();
        return;
      }

      // Refresh data
      try {
        const [usersRes, roleMapRes] = await Promise.all([
          usersApi.getUsers(),
          roleMappingApi.getRoleMappings(),
        ]);
        this.setState((prevState) => ({
          ...generateStateData(usersRes.data, prevState.locations, prevState.roles, roleMapRes.data),
        }));
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    } else {
      reject();
    }
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const usersApi = new UsersAPI(this.state.token);
    const roleMappingApi = new RoleMappingsAPI(this.state.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.firstName !== oldData.firstName) {
      fieldUpdated = true;
      updatedFields.firstName = newData.firstName;
    }

    if (newData.lastName !== oldData.lastName) {
      fieldUpdated = true;
      updatedFields.lastName = newData.lastName;
    }

    if (newData.email !== oldData.email) {
      fieldUpdated = true;
      updatedFields.email = newData.email;
    }

    if (newData.locationName !== oldData.locationName) {
      fieldUpdated = true;
      let location = this.state.locations.find((l) => l.location === newData.locationName);

      if (!location) {
        if (newData.locationName === 'None') {
          location = { locationId: null };
        } else {
          reject();
          return;
        }
      }

      updatedFields.locationId = location.locationId;
    }

    if (fieldUpdated) {
      // Update the user with the new information
      await usersApi.updateUser(newData.id, updatedFields);
    }

    if (newData.role !== oldData.role) {
      // Find the selected role
      let role = this.state.roles.find((r) => r.name === newData.role);

      if (!role) {
        if (newData.role === 'None') {
          role = { id: -1 };
        } else {
          reject();
          return;
        }
      }

      try {
        // Add the user to the role
        await roleMappingApi.assignRole(newData.id, role.id);
      } catch (err) {
        reject();
        return;
      }
    }

    // Refresh data
    try {
      const [usersRes, roleMapRes] = await Promise.all([
        usersApi.getUsers(),
        roleMappingApi.getRoleMappings(),
      ]);
      this.setState((prevState) => ({
        ...generateStateData(usersRes.data, prevState.locations, prevState.roles, roleMapRes.data),
      }));
      resolve();
    } catch (err) {
      reject();
      return;
    }

    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    const usersApi = new UsersAPI(this.state.token);
    const roleMappingApi = new RoleMappingsAPI(this.state.token);

    try {
      // Delete the user
      await usersApi.deleteUser(oldData.id);
    } catch (err) {
      reject();
      return;
    }

    try {
      // Remove role mappings for the user
      await roleMappingApi.assignRole(oldData.id, -1);
    } catch (err) {
      reject();
      return;
    }

    // Refresh data
    try {
      const [usersRes, roleMapRes] = await Promise.all([
        usersApi.getUsers(),
        roleMappingApi.getRoleMappings(),
      ]);
      this.setState((prevState) => ({
        ...generateStateData(usersRes.data, prevState.locations, prevState.roles, roleMapRes.data),
      }));
      resolve();
    } catch (err) {
      reject();
      return;
    }

    resolve();
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
