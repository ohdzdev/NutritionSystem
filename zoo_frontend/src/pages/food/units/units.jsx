import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MaterialTable from 'material-table';

import UnitsAPIModel from '../../../../../zoo_api/common/models/UNITS.json';

import TableColumnHelper from '../../../util/TableColumnHelper';
import { Units as UnitsAPI } from '../../../api';
import { Notifications } from '../../../components';

export default class units extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const serverUnitsAPI = new UnitsAPI(authToken);
    try {
      const res = await serverUnitsAPI.getUnits().catch((err) => ({ data: [{ err: true, msg: err }] }));
      return { allUnits: res.data };
    } catch (err) {
      return {
        allUnits: [],
        error: true,
        errorMessage: 'Error loading units from DB',
      };
    }
  }
  static propTypes = {
    token: PropTypes.string,
    allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);

    const keys = Object.keys(UnitsAPIModel.properties);
    const UnitsColumns = {};
    keys.forEach((key) => { UnitsColumns[key] = null; });
    const ignoredFoodWeightColumns = ['unitId'];
    const renamedFoodWeightColumns = {
      conversionToG: 'Conversion to Grams',
    };

    this.preppedUnitColumns = TableColumnHelper([UnitsColumns], ignoredFoodWeightColumns, renamedFoodWeightColumns);
    this.preppedUnitColumns[1].lookup = {
      Volume: 'Volume',
      Weight: 'Weight',
    };

    this.state = {
      token: props.token,
      allUnits: props.allUnits,
    };

    this.clientUnitAPI = new UnitsAPI(this.state.token);
  }

  onRowAdd = (row) => new Promise(async (res, rej) => {
    // required rows check
    if (!row.unit || !row.unitType) {
      this.notificationBar.showNotification('error', 'Please fill out "Unit" and "Unit Type" in order to submit a new entry.');
      rej();
      return;
    }

    try {
      const r = await this.clientUnitAPI.addUnit(row);
      // apply new row to current view
      if (r.data) {
        this.setState((prevState) => ({ allUnits: [...prevState.allUnits, r.data] }));
      }
      res();
    } catch (error) {
      console.error(error);
      this.notificationBar.showNotification('error', 'Submitting new Unit failed!');
      rej();
    }
  })

  onRowUpdate = (rowUpdated, prevRow) => new Promise(async (res, rej) => { // eslint-disable-line
    // required rows check
    if (!rowUpdated.unit || !rowUpdated.unitType) {
      this.notificationBar.showNotification('error', 'Fields "Unit" and "Unit Type" are required, please fill them out.');
      rej();
      return;
    }


    const updatedCopy = { ...rowUpdated };
    let fieldUpdated = false;
    const updatedFields = Object.entries(updatedCopy).filter((column) => prevRow[column[0]] !== column[1]).map((entry) => entry[0]);
    if (updatedFields && updatedFields.length > 0) {
      fieldUpdated = true;
    }
    if (fieldUpdated) {
      try {
        const updatedFieldsToServer = {};
        updatedFields.forEach((fieldToKeep) => { updatedFieldsToServer[fieldToKeep] = updatedCopy[fieldToKeep]; });
        await this.clientUnitAPI.updateUnits(updatedCopy.unitId, updatedFieldsToServer);
        this.setState((prevState) => {
          const newUnits = [...prevState.allUnits.map((item) => {
            if (item.unitId !== rowUpdated.unitId) {
              return item;
            }
            const updatedRow = item;
            Object.assign(updatedRow, updatedFieldsToServer);
            return updatedRow;
          })];
          return { allUnits: newUnits };
        });
        res();
      } catch (error) {
        console.log(error);
        rej();
        return;
      }
    }
    res();
  })

  onRowDelete = (row) => new Promise(async (res, rej) => {
    try {
      if (row.unitId) {
        await this.clientUnitAPI.deleteUnit(row.unitId);
        this.setState((prevState) => ({ allUnits: [...prevState.allUnits.filter((item) => item.unitId !== row.unitId)] }));
        res();
        return;
      }
      this.notificationBar.showNotification('error', 'Error Deleting Unit on server. Please contact server admin');
      rej();
      return;
    } catch (error) {
      console.error(error);
      rej();
    }
  })

  render() {
    console.log(this.props);
    return (
      <div>
        <MaterialTable
          title="Units"
          columns={this.preppedUnitColumns}
          data={this.state.allUnits}
          options={{
            pageSize: 10,
            exportButton: true,
          }}
          editable={{
            onRowAdd: this.onRowAdd,
            onRowUpdate: this.onRowUpdate,
            onRowDelete: this.onRowDelete,
          }}
        />
        <Notifications
          ref={(ref) => { this.notificationBar = ref; }}
        />
      </div>
    );
  }
}
