import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Edit from '@material-ui/icons/Edit';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

import TableColumnHelper from '../../../util/TableColumnHelper';

import FoodModelAPI from '../../../../../zoo_api/common/models/FOOD.json';

import { Food as FoodAPI } from '../../../api';
import { hasAccess, Food } from '../../PageAccess';
import { Notifications } from '../../../components';

export default class extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    // api helpers on server side
    const api = new FoodAPI(authToken);

    // server side grab all data for list view
    const res = await api.getFood().catch((err) => ({ foodItems: [{ err: true, msg: err }] }));

    return { allFood: res.data };
  }

  static propTypes = {
    token: PropTypes.string,
    account: PropTypes.object.isRequired,
    // classes: PropTypes.object.isRequired,
    allFood: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      allFood: props.allFood,
      editDialogOpen: false,
      dialogRow: false,
      dirty: false,
    };

    const keys = Object.keys(FoodModelAPI.properties);
    const FoodColumns = {};
    // flip columns around to make nickname appear second
    keys.reverse().forEach((key) => {
      FoodColumns[key] = null;
    });
    const ignoredFoodWeightColumns = [
      'foodId',
      'sciName',
      'manufacturerName',
      'costG',
      'budgetId',
      'category',
      'usdaFoodGroupDesc',
      'dry',
      'meat',
      'preChop',
      'preBag',
      'active',
    ];
    const renamedFoodWeightColumns = {
      ohdzName: 'Nickname',
      food: 'Food name',
    };

    this.preppedFoodColumns = TableColumnHelper(
      [FoodColumns],
      ignoredFoodWeightColumns,
      renamedFoodWeightColumns,
    );

    this.clientFoodAPI = new FoodAPI(this.props.token);
    this.notificationBar = React.createRef();
  }

  handleNickNameChange = (rowData) => {
    this.setState({ editDialogOpen: true, dialogRow: { ...rowData } });
  };

  async handleDialogSave() {
    if (!this.state.dialogRow.ohdzName) {
      this.notificationBar.showNotification('error', 'nickname must be present.');
      return; // keep it open and let them fix
    }
    const updates = { ohdzName: this.state.dialogRow.ohdzName };
    const id = this.state.dialogRow.foodId;
    const res = await this.clientFoodAPI.updateFood(id, updates);
    if (res.data) {
      this.setState((prevState) => {
        const newFoodData = [
          ...prevState.allFood.map((item) => {
            if (item.foodId !== res.data.foodId) {
              return item;
            }
            const updatedRow = item;
            Object.assign(updatedRow, res.data);
            return updatedRow;
          }),
        ];
        return {
          allFood: newFoodData,
          editDialogOpen: false,
          dialogRow: {},
          dirty: false,
        };
      });
    }
  }

  handleCancelDialog() {
    this.setState({ editDialogOpen: false, dialogRow: {}, dirty: false });
  }

  render() {
    const { role } = this.props.account;
    return (
      <div>
        {this.state.editDialogOpen && (
          <Dialog
            key="editDialog"
            open={this.state.editDialogOpen}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">Edit Food Nickname</DialogTitle>
            <DialogContent>
              <TextField
                id="nickname"
                label="Nickname"
                value={this.state.dialogRow.ohdzName}
                onChange={(evt) => {
                  const newVal = evt.target.value;
                  this.setState((prevState) => ({
                    dialogRow: { ...prevState.dialogRow, ohdzName: newVal },
                    dirty: true,
                  }));
                }}
                margin="normal"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleCancelDialog()} color="primary">
                Cancel
              </Button>
              <Button
                disabled={!this.state.dirty}
                onClick={() => this.handleDialogSave()}
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <MaterialTable
          title="Food Nicknames"
          data={this.state.allFood}
          columns={this.preppedFoodColumns}
          options={{
            pageSize: 10,
            actionsColumnIndex: 0,
            emptyRowsWhenPaging: false,
          }}
          actions={[
            (rowData) => ({
              icon: () => <Edit />,
              onClick: () => this.handleNickNameChange(rowData),
              tooltip: 'Edit Nickname',
              disabled: !hasAccess(role, Food.nicknames.roles),
            }),
          ]}
        />
        <Notifications ref={this.notificationBar} />
      </div>
    );
  }
}
