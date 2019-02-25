import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import Link from 'next/link';

import { hasAccess, Admin } from '../src/pages/PageAccess';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

const Header = (props) => {
  const { classes, api, account } = props;
  const { role } = account;
  const logoutClicked = async () => {
    // log out via the api so current auth token will be removed in db
    await api.logout();
    // navigate to the login page
    Router.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Nutritional Assistant
          </Typography>
          {hasAccess(role, Admin.roles) &&
            <Link href={Admin.link}>
              <Button variant="contained" className={classes.button} color="secondary">
                  Admin
              </Button>
            </Link>
          }
          <Typography>
            Hello {account.firstName} {account.lastName}!
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
