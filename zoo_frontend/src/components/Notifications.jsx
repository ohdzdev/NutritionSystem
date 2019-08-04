import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import withProps from 'recompose/withProps';

import Close from '@material-ui/icons/Close';

import { green, amber } from '@material-ui/core/colors';

import {
  Snackbar, IconButton, SnackbarContent, withStyles,
} from '@material-ui/core';

const icons = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
};

const styles = theme => ({
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: '',
      type: '',
    };
  }

  showNotification = (type, message) => {
    this.setState({
      message,
      type,
      open: true,
    });
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  renderContent = (type) => {
    const Icon = icons[type];
    const { classes } = this.props;
    if (!['success', 'error', 'warning', 'info'].includes(this.state.type)) {
      return null;
    }
    return (
      <SnackbarContent
        message={
          <span id="message-id" className={classes.message}>
            <Icon className={classes.icon} />
            {this.state.message}
          </span>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={this.props.classes.close}
            onClick={this.onClose}
          >
            <Close />
          </IconButton>,
        ]}
        className={this.props.classes[type]}
        aria-describedby="client-snackbar"
      />
    );
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.onClose}
      >
        {this.renderContent(this.state.type)}
      </Snackbar>
    );
  }
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
};

/* eslint-disable react/no-multi-comp */
const passAroundRef = React.forwardRef((props, ref) => {
  const Comp = withStyles(styles)(withProps({ ref, ...props })(Notifications));
  return (
    <Comp />
  );
});

export default passAroundRef;
