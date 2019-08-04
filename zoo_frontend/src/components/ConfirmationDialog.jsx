import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, DialogContent, DialogActions, Dialog, Button } from '@material-ui/core';

/**
 * custom confirmation dialog that forces user to click cancel or ok
 * @param {JSON} props { onClose() => Boolean, title: String, message: String}
 */
const ConfirmationDialogRaw = (props) => {
  const handleCancel = () => {
    props.onClose(false);
  };

  const handleOk = () => {
    props.onClose(true);
  };

  const {
    title, message, cancelButtonText, okButtonText, ...other
  } = props;
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="confirmation-dialog-title"
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelButtonText}
        </Button>
        <Button onClick={handleOk} color="primary">
          {okButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  cancelButtonText: PropTypes.string,
  okButtonText: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

ConfirmationDialogRaw.defaultProps = {
  message: '',
  onClose: () => {},
  cancelButtonText: 'Cancel',
  okButtonText: 'OK',
};

export default ConfirmationDialogRaw;
