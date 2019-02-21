import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

    this.state = {
      email: '',
      password: '',
      rememberMe: false,
    };
  }

  componentDidMount(prevProps, prevState) { // eslint-disable-line
    if (this.props.account) {
      Router.push('/');
    }
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      await this.props.api.login(this.state.email, this.state.password);
      Router.push('/');
    } catch (err) {
      // TODO break down login error and present info to user for what is wrong

      console.log(err);
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
            <FormControl margin="normal" required fullWidth>
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
            <FormControl margin="normal" required fullWidth>
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
      </div>
    );
  }
}

export default Login;
