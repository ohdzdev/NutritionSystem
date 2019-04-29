import React, { Component } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';

// FOOD WEIGHT API MODEL
import foodWeightsAPIModel from '../../../../../zoo_api/common/models/FOOD_WEIGHTS.json';

// COMPONENTS
import { Notifications } from '../../../components';
import FoodWeights from '../../../api/FoodWeights';

// UTILS
import TableColumnHelper from '../../../util/TableColumnHelper';

class FoodWeightTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodWeights: [...props.foodWeights], // don't use direct data
    };

    const unitLookup = {};
    props.allUnits.slice(0).reduce((acc, unit) => {
      acc[unit.unitId] = unit.unit;
      return acc;
    }, unitLookup);

    const keys = Object.keys(foodWeightsAPIModel.properties);
    const foodWeightColumns = {};
    keys.forEach((key) => { foodWeightColumns[key] = null; });
    const ignoredFoodWeightColumns = ['weightId', 'foodId'];
    const renamedFoodWeightColumns = {
      weightAmount: 'Amount of Food',
      unitIdNum: 'Unit',
      gmWeight: 'Weight in Grams',
    };

    this.preppedFoodWeightColumns = TableColumnHelper([foodWeightColumns], ignoredFoodWeightColumns, renamedFoodWeightColumns);
    this.preppedFoodWeightColumns[1].lookup = unitLookup;

    this.clientFoodWeightsAPI = new FoodWeights(props.token);
    this.notificationBar = React.createRef();
  }

  onFoodWeightAdd = (row) => new Promise(async (res, rej) => {
    if (!row.weightAmount || !row.unitIdNum || !row.gmWeight) {
      this.notificationBar.showNotification('error', 'Please fill out all fields in table in order to submit a new entry.');
      rej();
      return;
    }
    try {
      const preppedRow = { ...row, foodId: this.props.currentFoodId };
      const r = await this.clientFoodWeightsAPI.addFoodWeight(preppedRow);
      if (r.data) {
        this.setState((prevState) => ({ foodWeights: [...prevState.foodWeights, r.data] }));
      }

      res();
      return;
    } catch (error) {
      console.error(error);
      this.notificationBar.showNotification('error', 'Submitting new Food Weight failed!');
      rej();
    }
  })

  onFoodWeightUdpate = (rowUpdated, prevRow) => new Promise(async (res, rej) => {
    if (!rowUpdated.weightAmount || !rowUpdated.unitIdNum || !rowUpdated.gmWeight) {
      this.notificationBar.showNotification('error', 'All fields required, please fill out all fields.');
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
        await this.clientFoodWeightsAPI.updateFoodWeight(updatedCopy.weightId, updatedFieldsToServer);
        this.setState((prevState) => {
          const newFoodWeights = [...prevState.foodWeights.map((item) => {
            if (item.weightId !== rowUpdated.weightId) {
              return item;
            }
            const updatedRow = item;
            Object.assign(updatedRow, updatedFieldsToServer);
            return updatedRow;
          })];
          return { foodWeights: newFoodWeights };
        });
        res();
      } catch (error) {
        console.error(error);
        rej();
      }
    }
    res();
  })

  onFoodWeightDelete = (row) => new Promise(async (res, rej) => {
    try {
      if (row.weightId) {
        await this.clientFoodWeightsAPI.deleteFoodWeight(row.weightId);
        this.setState((prevState) => ({ foodWeights: [...prevState.foodWeights.filter((item) => item.weightId !== row.weightId)] }));
        res();
      } else {
        this.notificationBar.showNotification('error', 'Error Deleting weight on server. Please contact server admin');
        rej();
        return;
      }
    } catch (error) {
      console.error(error);
      rej();
    }
  })

  render() {
    return (
      <div>
        <MaterialTable
          title="Food Weights"
          columns={this.preppedFoodWeightColumns}
          data={this.state.foodWeights}
          editable={{
            onRowAdd: this.onFoodWeightAdd,
            onRowUpdate: this.onFoodWeightUdpate,
            onRowDelete: this.onFoodWeightDelete,
          }}
          options={{
            emptyRowsWhenPaging: false,
            addRowPosition: 'first',
          }}
        />
        <Notifications
          ref={this.notificationBar}
        />
      </div>
    );
  }
}

FoodWeightTable.propTypes = {
  foodWeights: PropTypes.arrayOf(PropTypes.object).isRequired,
  allUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
  token: PropTypes.string.isRequired,
  currentFoodId: PropTypes.number.isRequired,
};

export default FoodWeightTable;
