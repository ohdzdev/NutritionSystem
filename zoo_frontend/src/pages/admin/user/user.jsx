import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';

import ErrorPage from '../../../components/ErrorPage';
import Notifications from '../../../components/Notifications';

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

  locationLookup = locations
    .slice(0)
    .sort((a, b) => (a.location > b.location ? 1 : -1))
    .reduce((acc, location) => {
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

  roleLookup = roles
    .slice(0)
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .reduce((acc, role) => {
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
  };

  constructor(props) {
    super(props);

    this.state = {
      ...generateStateData(
        this.props.users,
        this.props.locations,
        this.props.roles,
        this.props.roleMappings,
      ),
      locations: this.props.locations,
      roles: this.props.roles,
      passwordDialogOpen: false,
      passwordDialogQuestion: '',
      passwordText: '',
    };

    this.passwordDialogResolve = null;

    this.notificationsRef = React.createRef();
  }

  getPassword = (question) =>
    new Promise((resolve) => {
      this.setState({
        passwordDialogOpen: true,
        passwordDialogQuestion: question,
        passwordText: 'OmahaZoo',
      });
      this.passwordDialogResolve = resolve;
    });

  onRowAdd = (newData) =>
    new Promise(async (resolve, reject) => {
      // Reject the new user if there is no firstname, lastname, email, role, or location
      if (
        !newData.firstName ||
        !newData.lastName ||
        !newData.email ||
        !newData.role ||
        !newData.locationName
      ) {
        this.notificationsRef.current.showNotification(
          'error',
          'Please fill out all of the fields to create a new user.',
        );
        reject();
        return;
      }

      const password = await this.getPassword('Please enter a password for the new user:');
      if (password) {
        const usersApi = new UsersAPI(this.props.token);
        const roleMappingApi = new RoleMappingsAPI(this.props.token);

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
          const res = await usersApi.createUser(
            newData.firstName,
            newData.lastName,
            newData.email,
            location.locationId,
            password,
          );
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
            ...generateStateData(
              usersRes.data,
              prevState.locations,
              prevState.roles,
              roleMapRes.data,
            ),
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
    });

  onRowUpdate = (newData, oldData) =>
    new Promise(async (resolve, reject) => {
      const usersApi = new UsersAPI(this.props.token);
      const roleMappingApi = new RoleMappingsAPI(this.props.token);

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
          ...generateStateData(
            usersRes.data,
            prevState.locations,
            prevState.roles,
            roleMapRes.data,
          ),
        }));
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  onRowDelete = (oldData) =>
    new Promise(async (resolve, reject) => {
      const usersApi = new UsersAPI(this.props.token);
      const roleMappingApi = new RoleMappingsAPI(this.props.token);

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
          ...generateStateData(
            usersRes.data,
            prevState.locations,
            prevState.roles,
            roleMapRes.data,
          ),
        }));
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  handlePasswordTextChange = (evt) => this.setState({ passwordText: evt.target.value });

  handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!this.state.passwordText) {
      this.setState({
        passwordDialogError: true,
        passwordDialogErrorMessage: 'Please enter a password.',
      });
      return;
    }

    this.setState({ passwordDialogOpen: false, passwordDialogError: false });
    if (this.passwordDialogResolve) {
      this.passwordDialogResolve(this.state.passwordText);
      this.passwordDialogResolve = null;
    }
  };

  render() {
    if (this.props.error) {
      return <ErrorPage message={this.props.errorMessage} />;
    }

    const { classes } = this.props;
    const { userData, locationLookup, roleLookup } = this.state;

    return (
      <div className={classes.root}>
        <Dialog
          open={this.state.passwordDialogOpen}
          onClose={() => {
            if (this.passwordDialogResolve) {
              this.passwordDialogResolve(null);
              this.passwordDialogResolve = null;
            }
            this.setState({ passwordDialogOpen: false });
          }}
        >
          <div className={this.props.classes.dialogContainer}>
            <Typography>{this.state.passwordDialogQuestion}</Typography>
            <form className={classes.form} onSubmit={this.handlePasswordSubmit}>
              {this.state.passwordDialogError && (
                <FormHelperText error className={classes.errorText}>
                  {this.state.passwordDialogErrorMessage}
                </FormHelperText>
              )}
              <FormControl margin="normal" required fullWidth error={this.state.error}>
                <InputLabel htmlFor="password">New Password</InputLabel>
                <Input
                  id="password"
                  name="password"
                  autoComplete="password"
                  autoFocus
                  value={this.state.passwordText}
                  onChange={this.handlePasswordTextChange}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Save
              </Button>
            </form>
          </div>
        </Dialog>
        <Notifications ref={this.notificationsRef} />
        <div className={this.props.classes.table}>
          <MaterialTable
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
                title: 'Department',
                field: 'locationName',
                lookup: locationLookup,
              },
            ]}
            actions={[
              {
                icon: 'settings_backup_restore',
                tooltip: 'Reset User Password',
                onClick: async (event, rowData) => {
                  const usersApi = new UsersAPI(this.props.token);
                  const password = await this.getPassword(
                    'Please enter the users new temporary password:',
                  );
                  if (password) {
                    try {
                      await usersApi.resetPasswordByAdmin(rowData.id, password);
                      this.notificationsRef.current.showNotification(
                        'success',
                        'Password updated.',
                      );
                    } catch (err) {
                      this.notificationsRef.current.showNotification(
                        'error',
                        'An error occured while updating the password.',
                      );
                    }
                  }
                },
                iconProps: {
                  style: {
                    fontSize: '24px',
                  },
                },
              },
            ]}
            data={userData}
            title="User Management"
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 50, 100],
              exportButton: true,
              emptyRowsWhenPaging: false,
              addRowPosition: 'first',
            }}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
          />
        </div>
      </div>
    );
  }
}

export default User;
