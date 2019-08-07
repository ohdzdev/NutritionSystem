import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import Notifications from '../../../components/Notifications';
import ErrorPage from '../../../components/ErrorPage';

import FoodPrepTablesApi from '../../../api/FoodPrepTables';

class PrepTables extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new FoodPrepTablesApi(authToken);
    try {
      const res = await api
        .getFoodPrepTables()
        .catch((err) => ({ data: [{ err: true, msg: err }] }));
      return { prepTables: res.data };
    } catch (err) {
      return {
        prepTables: [],
        error: true,
        errorMessage: 'Error loading data',
      };
    }
  }
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    prepTables: PropTypes.array.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    token: '',
    error: false,
    errorMessage: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      prepTables: props.prepTables,
    };
    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) =>
    new Promise(async (resolve, reject) => {
      const api = new FoodPrepTablesApi(this.props.token);
      // Reject if no short form
      if (!newData.description) {
        this.notificationsRef.current.showNotification('error', 'Please fill out "Table Name".');
        reject();
        return;
      }

      try {
        // Create the prep table entry
        await api.createFoodPrepTables(newData);
      } catch (err) {
        reject();
      }

      // Refresh Data
      try {
        const res = await api.getFoodPrepTables();
        this.setState({ prepTables: res.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }
      resolve();
    });

  onRowUpdate = (newData, oldData) =>
    new Promise(async (resolve, reject) => {
      const api = new FoodPrepTablesApi(this.props.token);

      // Determine if we need to update and what to update
      let fieldUpdated = false;
      const updatedFields = {};

      if (newData.description !== oldData.description) {
        fieldUpdated = true;
        updatedFields.description = newData.description;
      }

      if (fieldUpdated) {
        await api.updateFoodPrepTables(newData.tableId, updatedFields);
      } else {
        reject();
        return;
      }

      // Refresh Data
      try {
        const res = await api.getFoodPrepTables();
        this.setState({ prepTables: res.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }
      resolve();
    });

  onRowDelete = (oldData) =>
    new Promise(async (resolve, reject) => {
      const api = new FoodPrepTablesApi(this.props.token);
      try {
        // Delete the prep table
        await api.deleteFoodPrepTables(oldData.tableId);
      } catch (err) {
        reject();
        return;
      }
      // Refresh Data
      try {
        const res = await api.getFoodPrepTables();
        this.setState({ prepTables: res.data });
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
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Notifications ref={this.notificationsRef} />
        <div className={this.props.classes.table}>
          <MaterialTable
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 50, 200],
              exportButton: true,
              addRowPosition: 'first',
              emptyRowsWhenPaging: false,
            }}
            columns={[{ title: 'Table Name', field: 'description' }]}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
            data={this.state.prepTables}
            title="Food Prep Tables"
          />
        </div>
      </div>
    );
  }
}

export default PrepTables;
