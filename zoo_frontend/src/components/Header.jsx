import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import Link from 'next/link';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';

import { AuthContext } from '../util/AuthProvider';

import { Home } from '../pages/PageAccess';

const drawerWidth = 240;

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  logoutButton: {
    marginRight: 12,
  },
});

const Header = ({ classes, drawerOpen, handleDrawerOpen }) => (
  <div className={classes.root}>
    <AuthContext.Consumer>
      {({ api, account }) => (
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
          })}
        >
          <Toolbar disableGutters>
            {account.loggedIn && (
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={handleDrawerOpen}
                className={classNames(classes.menuButton, drawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {!account.loggedIn && <div style={{ width: '15px' }} />}
            {drawerOpen && <div style={{ width: '20px' }} />}
            <Link href={Home.link}>
              <Typography variant="h6" color="inherit" style={{ cursor: 'pointer' }}>
                Nutritional Assistant
              </Typography>
            </Link>
            <div className={classes.grow} />
            <Typography style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              Hello {account.loggedIn ? `${account.firstName} ${account.lastName}` : 'Guest'}!
            </Typography>
            {account.loggedIn && (
              <Button
                color="inherit"
                onClick={async () => {
                  // log out via the api so current auth token will be removed in db
                  await api.logout();
                  // navigate to the login page
                  Router.push('/login');
                }}
                className={classes.logoutButton}
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}
    </AuthContext.Consumer>
  </div>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Header);
