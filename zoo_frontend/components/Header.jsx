import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';


const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

const Header = (props) => {
  const { classes, api } = props;

  const logoutClicked = () => {
    api.logout();
    Router.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {props.loggedIn &&
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Nutritional Assistant
            </Typography>
          }
          {props.loggedIn &&
            <Typography>
              Hello {props.firstName} {props.lastName}!
            </Typography>
          }
          {props.loggedIn &&
            <Button color="inherit" onClick={logoutClicked}>Logout</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  api: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  loggedIn: PropTypes.bool,
};

Header.defaultProps = {
  firstName: '',
  lastName: '',
  loggedIn: false,
};

const styledHeader = withStyles(styles)(Header);
export default styledHeader;
