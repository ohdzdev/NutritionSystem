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

import { hasAccess, Admin, Home } from '../pages/PageAccess';

const drawerWidth = 240;

const styles = theme => ({
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
});

const Header = (props) => {
  const {
    classes, api, account, drawerOpen, handleDrawerOpen,
  } = props;
  const { role } = account;
  const logoutClicked = async () => {
    // log out via the api so current auth token will be removed in db
    await api.logout();
    // navigate to the login page
    Router.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar disableGutters>
          {account.loggedIn &&
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
              className={classNames(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          }
          {!account.loggedIn &&
            <div style={{ width: '15px' }} />
          }
          {drawerOpen && <div style={{ width: '20px' }} /> }
          <Link href={Home.link}>
            <Typography variant="h6" color="inherit" style={{ cursor: 'pointer' }}>
              Nutritional Assistant
            </Typography>
          </Link>
          <div className={classes.grow} />
          {hasAccess(role, Admin.roles) &&
            <Link href={Admin.link}>
              <Button variant="contained" className={classes.button} color="secondary">
                  Admin
              </Button>
            </Link>
          }
          <Typography style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            Hello {account.loggedIn ? `${account.firstName} ${account.lastName}` : 'Guest'}!
          </Typography>
          {account.role !== 'unauthenticated' &&
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
  account: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.number,
    lastName: PropTypes.string,
    role: PropTypes.string,
  }),
  handleDrawerOpen: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  account: {
    email: '',
    id: 0,
    firstName: 'Guest',
    lastName: '',
    role: 'unauthenticated',
  },
};

const styledHeader = withStyles(styles)(Header);
export default styledHeader;
