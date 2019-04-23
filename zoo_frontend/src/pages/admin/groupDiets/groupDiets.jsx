import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import Notifications from '../../../components/Notifications';
import ErrorPage from '../../../components/ErrorPage';

import DepartmentAPI from '../../../api/Departments';
import SubenclosuresAPI from '../../../api/Subenclosures';

const generateStateData = (subenclosures, locations) => {
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

  const subenclosuresData = subenclosures.map((sub) => ({
    ...sub,
    locationId: sub.locationId || 0,
    locationName: locationLookupIds[sub.locationId || 0],
  }));

  return {
    subenclosuresData,
    locationLookup,
  };
};

class GroupDiets extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const departmentsApi = new DepartmentAPI(authToken);
    const subenclosuresApi = new SubenclosuresAPI(authToken);
    try {
      const [locRes, subenclosuresRes] = await Promise.all([
        departmentsApi.getDepartments(),
        subenclosuresApi.getSubenclosures(),
      ]);
      return {
        subenclosures: subenclosuresRes.data,
        locations: locRes.data,
      };
    } catch (err) {
      return {
        subenclosures: [],
        locations: [],
        error: true,
        errorMessage: 'Error loading data',
      };
    }
  }
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    locations: PropTypes.arrayOf(PropTypes.object).isRequired,
    subenclosures: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    token: '',
    error: false,
    errorMessage: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      ...generateStateData(props.subenclosures, props.locations),
    };
    this.notificationsRef = React.createRef();
    this.subenclosuresApi = new SubenclosuresAPI(props.token);
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    // Reject if a field is not filled out
    if (!newData.subenclosure || !newData.locationName) {
      this.notificationsRef.current.showNotification('error', 'Please fill out all of the "Species" and "Scientific Name".');
      reject();
      return;
    }

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

    try {
      // Create the group diet entry
      await this.subenclosuresApi.createSubenclosures({
        subenclosure: newData.subenclosure,
        locationId: location.locationId,
      });
    } catch (err) {
      reject();
    }

    // Refresh Data
    try {
      const subRes = await this.subenclosuresApi.getSubenclosures();
      this.setState({ ...generateStateData(subRes.data, this.props.locations) });
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const subenclosuresApi = new SubenclosuresAPI(this.props.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.subenclosure !== oldData.subenclosure) {
      fieldUpdated = true;
      updatedFields.subenclosure = newData.subenclosure;
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
      await subenclosuresApi.updateSubenclosures(newData.seId, updatedFields);
    } else {
      reject();
      return;
    }

    // Refresh Data
    try {
      const subRes = await subenclosuresApi.getSubenclosures();
      this.setState({ ...generateStateData(subRes.data, this.props.locations) });
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    try {
      // Delete the group diet
      await this.subenclosuresApi.deleteSubenclosures(oldData.seId);
    } catch (err) {
      reject();
      return;
    }
    // Refresh Data
    try {
      const subRes = await this.subenclosuresApi.getSubenclosures();
      this.setState({ ...generateStateData(subRes.data, this.props.locations) });
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
    const { subenclosuresData, locationLookup } = this.state;

    return (
      <div className={classes.root}>
        <Notifications ref={this.notificationsRef} />
        <div className={classes.table}>
          <MaterialTable
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 100, 800],
              exportButton: true,
            }}
            columns={[
              { title: 'Group Name', field: 'subenclosure' },
              {
                title: 'Department',
                field: 'locationName',
                lookup: locationLookup,
              },
            ]}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
            data={subenclosuresData}
            title="Group Diets"
          />
        </div>
      </div>
    );
  }
}

export default GroupDiets;
