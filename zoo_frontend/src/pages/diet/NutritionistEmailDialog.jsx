import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@material-ui/core';

import SingleSelect from '../../components/ReactSingleSelect';

export default class DietPlanChangeDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    nutritionistList: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedNutritionist: null,
      selectedValue: null,
    };
  }

  render() {
    return (
      <>
        <Dialog
          maxWidth="sm"
          aria-labelledby="mailto-dialog"
          open={this.props.open}
          style={{
            // https://github.com/mui-org/material-ui/issues/7431#issuecomment-414703875
            overflow: 'visible',
          }}
        >
          <DialogTitle id="mailto-dialog-title">Select Nutritionist To Send Email</DialogTitle>
          <DialogContent
            style={{
              overflow: 'visible',
            }}
          >
            <DialogContentText>
              *Required*
            </DialogContentText>
            <SingleSelect
              value={this.state.selectedValue}
              suggestions={
                this.props.nutritionistList.map((val) => ({
                  ...val,
                  label: `${val.firstName} ${val.lastName}`,
                  value: val.id,
                }))
              }
              onChange={(select) => {
                console.log(select);
                this.setState({
                  selectedNutritionist: select,
                  selectedValue: select.value,
                });
              }}
              label="Nutritionist"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.onCancel();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.props.onSave(this.state.selectedNutritionist);
              }}
              color="primary"
              variant="contained"
              disabled={!this.state.selectedNutritionist}
            >
              Open Email To Nutritionist
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
