import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import ErrorPage from '../../../components/ErrorPage';
import Notifications from '../../../components/Notifications';

import DepartmentAPI from '../../../api/Departments';

class Home extends Component {
  static async getInitialProps({ authToken }) {
    const departmentsApi = new DepartmentAPI(authToken);
    try {
      const locRes = await departmentsApi.getDepartments();
      return {
        locations: locRes.data,
      };
    } catch (err) {
      return {
        locations: [],
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
    token: PropTypes.string,
  };

  static defaultProps = {
    error: false,
    errorMessage: '',
    token: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      locations: props.locations,
    };

    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) =>
    new Promise(async (resolve, reject) => {
      // Reject the new user if there is no firstname, lastname, email, role, or location
      if (!newData.location || !newData.color || !newData.shortLocation) {
        this.notificationsRef.current.showNotification(
          'error',
          'Please fill out all of the fields to create a new department.',
        );
        reject();
        return;
      }

      const departmentsApi = new DepartmentAPI(this.props.token);

      try {
        // Create the department
        await departmentsApi.createDepartment(
          newData.location,
          newData.color,
          newData.shortLocation,
        );
      } catch (err) {
        reject();
        return;
      }

      // Refresh data
      try {
        const locRes = await departmentsApi.getDepartments();
        this.setState({ locations: locRes.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  onRowUpdate = (newData, oldData) =>
    new Promise(async (resolve, reject) => {
      const departmentsApi = new DepartmentAPI(this.props.token);

      // Determine if we need to update and what to update
      let fieldUpdated = false;
      const updatedFields = {};

      if (newData.location !== oldData.location) {
        fieldUpdated = true;
        updatedFields.location = newData.location;
      }

      if (newData.color !== oldData.color) {
        fieldUpdated = true;
        updatedFields.color = newData.color;
      }

      if (newData.shortLocation !== oldData.shortLocation) {
        fieldUpdated = true;
        updatedFields.shortLocation = newData.shortLocation;
      }

      if (fieldUpdated) {
        // Update the department with the new information
        await departmentsApi.updateDepartment(newData.locationId, updatedFields);
      }

      // Refresh data
      try {
        const locRes = await departmentsApi.getDepartments();
        this.setState({ locations: locRes.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  onRowDelete = (oldData) =>
    new Promise(async (resolve, reject) => {
      const departmentsApi = new DepartmentAPI(this.props.token);

      try {
        // Delete the department
        await departmentsApi.deleteDepartment(oldData.locationId);
      } catch (err) {
        reject();
        return;
      }

      // Refresh data
      try {
        const locRes = await departmentsApi.getDepartments();
        this.setState({ locations: locRes.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  render() {
    if (this.props.error) {
      return <ErrorPage message={this.props.errorMessage} />;
    }

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Notifications ref={this.notificationsRef} />
        <div className={classes.table}>
          <MaterialTable
            columns={[
              { title: 'Department', field: 'location' },
              { title: 'Color', field: 'color' },
              { title: 'Short Name', field: 'shortLocation' },
            ]}
            data={this.state.locations}
            title="Departments"
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

export default Home;
