import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import UsersApi from '../../api/Users';

import Notifications from '../../components/Notifications';

class Profile extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    token: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      loading: false,
      oldPasswordText: '',
      newPasswordText: '',
      confirmNewPasswordText: '',
    };

    this.notifications = React.createRef();
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ error: false, loading: true });

    if (this.state.newPasswordText !== this.state.confirmNewPasswordText) {
      this.setState({
        error: true,
        errorMessage: 'New password does not match the confirmation.',
      });
      return;
    }

    const usersApi = new UsersApi(this.props.token);

    try {
      await usersApi.changePassword(this.state.oldPasswordText, this.state.newPasswordText);
      this.setState({
        error: false,
        loading: false,
        oldPasswordText: '',
        newPasswordText: '',
        confirmNewPasswordText: '',
      });
      this.notifications.current.showNotification('success', 'Password changed.');
    } catch (err) {
      if (err.message.includes('400')) {
        this.setState({
          error: true,
          loading: false,
          errorMessage: 'Current password is incorrect.',
        });
      } else {
        this.setState({
          error: true,
          loading: false,
          errorMessage: 'An error occured while attempting to change your password.',
        });
      }
    }
  };

  onOldPasswordTextChange = (event) => this.setState({ oldPasswordText: event.target.value });
  onNewPasswordTextChange = (event) => this.setState({ newPasswordText: event.target.value });
  onConfirmNewPasswordTextChange = (event) =>
    this.setState({ confirmNewPasswordText: event.target.value });

  render() {
    const { classes, account = {} } = this.props;
    const { firstName, lastName, email } = account;

    return (
      <div className={classes.container}>
        <Notifications ref={this.notifications} />
        <Paper className={classes.paper}>
          <Typography variant="h6">Profile</Typography>
          <Typography>
            Name: {firstName} {lastName}
          </Typography>
          <Typography>Email: {email}</Typography>
          <Divider className={classes.divider} />
          <form className={classes.formContainer} onSubmit={this.onSubmit}>
            <Typography variant="h6">Change Password</Typography>
            {this.state.error && <FormHelperText error>{this.state.errorMessage}</FormHelperText>}
            <FormControl
              margin="normal"
              required
              error={this.state.error}
              className={classes.formControl}
            >
              <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                value={this.state.oldPasswordText}
                onChange={this.onOldPasswordTextChange}
              />
            </FormControl>
            <FormControl
              margin="normal"
              required
              error={this.state.error}
              className={classes.formControl}
            >
              <InputLabel htmlFor="newPassword">New Password</InputLabel>
              <Input
                name="newPassword"
                type="password"
                id="newPassword"
                value={this.state.newPasswordText}
                onChange={this.onNewPasswordTextChange}
              />
            </FormControl>
            <FormControl
              margin="normal"
              required
              error={this.state.error}
              className={classes.formControl}
            >
              <InputLabel htmlFor="confirmNewPassword">Confirm New Password</InputLabel>
              <Input
                name="confirmNewPassword"
                type="password"
                id="confirmNewPassword"
                value={this.state.confirmNewPasswordText}
                onChange={this.onConfirmNewPasswordTextChange}
              />
            </FormControl>
            <div className={classes.wrapper}>
              <span style={{ position: 'relative' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={this.state.loading}
                  className={classes.submit}
                >
                  Change Password
                </Button>
                {this.state.loading && (
                  <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              </span>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

export default Profile;
