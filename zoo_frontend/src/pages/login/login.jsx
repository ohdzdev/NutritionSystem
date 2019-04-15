import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LocalStorage from '../../static/LocalStorage';

import Notifications from '../../components/Notifications';

class Login extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    account: PropTypes.object,
  };

  static defaultProps = {
    account: undefined,
  }

  constructor(props) {
    super(props);

    const rememberMe = LocalStorage.getRememberMe();
    const email = rememberMe ? LocalStorage.getLoginEmail() : '';
    const password = rememberMe ? LocalStorage.getLoginPassword() : '';

    this.state = {
      email,
      password,
      rememberMe,
      error: false,
      errorMessage: '',
    };

    this.notificationsRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.account.loggedIn) {
      Router.push('/');
    }
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();

    this.setState({ error: false });

    const { email, password, rememberMe } = this.state;

    LocalStorage.setLoginEmail(rememberMe ? email : '');
    LocalStorage.setLoginPassword(rememberMe ? password : '');
    LocalStorage.setRememberMe(rememberMe);

    try {
      await this.props.api.login(email, password);
      if (process.browser) {
        Router.events.on('routeChangeError', (err) => {
          console.error(err);
          if (this.notificationsRef && this.notificationsRef.current) {
            this.notificationsRef.showNotification('error', 'Application redirection error, please close browser and re-open');
          }
        }); // leaving this in, let's us see if there are weird /login redirect issues

        Router.push('/'); // previous block checks if this was successfull or not
      }
      return;
    } catch (err) {
      console.log(err.message);
      if (err.message === 'Role not found') {
        setTimeout(() => {
          this.notificationsRef.current.showNotification('error', 'This user has no role, please contact the system admin to add a user type to your account');
        }, 500);
      }
      console.error(err);
      this.setState({ error: true, errorMessage: 'Invalid username/password!' });
    }
  }

  handleEmailChange = (event) => this.setState({ email: event.target.value });
  handlePasswordChange = (event) => this.setState({ password: event.target.value });
  handleRememberMeChange = (event) => this.setState({ rememberMe: event.target.checked });

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <img src="/static/zoo_logo.png" className={classes.logo} alt="Logo" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleLoginSubmit}>
            {this.state.error &&
              <FormHelperText error className={classes.errorText}>
                {this.state.errorMessage}
              </FormHelperText>
            }
            <FormControl
              margin="normal"
              required
              fullWidth
              error={this.state.error}
            >
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </FormControl>
            <FormControl
              margin="normal"
              required
              fullWidth
              error={this.state.error}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
            </FormControl>
            <FormControlLabel
              control={(
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={this.state.rememberMe}
                  onChange={this.handleRememberMeChange}
                />
              )}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
        <Notifications ref={this.notificationsRef} />
      </div>
    );
  }
}

export default Login;
