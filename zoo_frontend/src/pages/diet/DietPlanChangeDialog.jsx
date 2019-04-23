import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button,
} from '@material-ui/core';

export default class DietPlanChangeDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    defaultChangeNotes: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultChangeNotes: '',
  }

  constructor(props) {
    super(props);

    this.state = {
      changeNotes: props.defaultChangeNotes ? props.defaultChangeNotes : '',
    };
  }
  render() {
    return (
      <>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="sm"
          aria-labelledby="confirmation-dialog-title"
          open={this.props.open}
        >
          <DialogTitle id="confirmation-dialog-title">asdf</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a reason why the diet was changed.
              *Required*
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="notes"
              label="Change Notes"
              variant="outlined"
              multiline
              rowsMax="4"
              fullWidth
              value={this.state.changeNotes}
              onChange={(e) => this.setState({ changeNotes: e.target.value })}
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
                this.props.onSave(this.state.changeNotes);
              }}
              color="primary"
              variant="contained"
              disabled={!this.state.changeNotes}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
