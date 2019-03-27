import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import ErrorPage from '../../../components/ErrorPage';
import Notifications from '../../../components/Notifications';

import DepartmentAPI from '../../../api/Departments';
import DeliveryContainersAPI from '../../../api/DeliveryContainers';

const generateStateData = (deliveryContainers, locations) => {
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

  const deliveryContainersData = deliveryContainers.map((deliveryContainer) => ({
    ...deliveryContainer,
    locationId: deliveryContainer.locationId || 0,
    locationName: locationLookupIds[deliveryContainer.locationId || 0],
  }));

  return {
    deliveryContainersData,
    locationLookup,
  };
};

class DeliveryContainers extends Component {
  static async getInitialProps({ authToken }) {
    const departmentsApi = new DepartmentAPI(authToken);
    const deliveryContainersApi = new DeliveryContainersAPI(authToken);
    try {
      const [locRes, deliveryContainerRes] = await Promise.all([
        departmentsApi.getDepartments(),
        deliveryContainersApi.getDeliveryContainers(),
      ]);
      return {
        deliveryContainers: deliveryContainerRes.data,
        locations: locRes.data,
      };
    } catch (err) {
      return {
        locations: [],
        deliveryContainers: [],
        error: true,
        errorMessage: 'Error loading data.',
      };
    }
  }

  static propTypes = {
    // account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    deliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    error: false,
    errorMessage: '',
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      ...generateStateData(props.deliveryContainers, props.locations),
    };

    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    // Reject the new user if there is no firstname, lastname, email, role, or location
    if (!newData.dc || !newData.sortOrder || !newData.locationName) {
      this.notificationsRef.current.showNotification('error', 'Please fill out all of the fields to create a new delivery container.');
      reject();
      return;
    }

    const deliveryContainersApi = new DeliveryContainersAPI(this.props.token);

    // Find the selected location
    let location = this.props.locations.find((l) => l.location === newData.locationName);

    if (!location) {
      if (newData.locationName === 'None') {
        location = { locationId: null };
      } else {
        reject();
        return;
      }
    }

    let sortOrder = Number(newData.sortOrder);

    if (Number.isNaN(sortOrder)) {
      this.notificationsRef.current.showNotification('error', 'Sort order must be a number!');
      reject();
      return;
    }

    sortOrder = Math.trunc(sortOrder);

    try {
      // Create the department
      await deliveryContainersApi.createDeliveryContainer(newData.dc, sortOrder, location.locationId);
    } catch (err) {
      reject();
      return;
    }

    // Refresh data
    try {
      const deliveryContainerRes = await deliveryContainersApi.getDeliveryContainers();
      this.setState({ ...generateStateData(deliveryContainerRes.data, this.props.locations) });
      resolve();
    } catch (err) {
      reject();
      return;
    }

    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const deliveryContainersApi = new DeliveryContainersAPI(this.props.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.dc !== oldData.dc) {
      fieldUpdated = true;
      updatedFields.dc = newData.dc;
    }

    if (newData.sortOrder !== oldData.sortOrder) {
      fieldUpdated = true;
      updatedFields.sortOrder = newData.sortOrder;
    }

    if (newData.locationName !== oldData.locationName) {
      fieldUpdated = true;
      let location = this.props.locations.find((l) => l.location === newData.locationName);

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
      // Update the department with the new information
      await deliveryContainersApi.updateDeliveryContainer(newData.locationId);
    }

    // Refresh data
    try {
      const deliveryContainerRes = await deliveryContainersApi.getDeliveryContainers();
      this.setState({ ...generateStateData(deliveryContainerRes.data, this.props.locations) });
      resolve();
    } catch (err) {
      reject();
      return;
    }

    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    const deliveryContainersApi = new DeliveryContainersAPI(this.props.token);

    try {
      // Delete the department
      await deliveryContainersApi.deleteDeliveryContainer(oldData.dcId);
    } catch (err) {
      reject();
      return;
    }

    // Refresh data
    try {
      const deliveryContainerRes = await deliveryContainersApi.getDeliveryContainers();
      this.setState({ ...generateStateData(deliveryContainerRes.data, this.props.locations) });
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

    const { classes } = this.props;
    const { deliveryContainersData, locationLookup } = this.state;

    return (
      <div className={classes.root}>
        <Notifications ref={this.notificationsRef} />
        <div className={classes.table}>
          <MaterialTable
            columns={[
              { title: 'Delivery Container', field: 'dc' },
              { title: 'Sort Order', field: 'sortOrder' },
              {
                title: 'Department',
                field: 'locationName',
                lookup: locationLookup,
              },
            ]}
            data={deliveryContainersData}
            title="Delivery Containers"
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
          />
        </div>
      </div>
    );
  }
}

export default DeliveryContainers;
