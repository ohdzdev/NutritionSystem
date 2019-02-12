import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  button: {
    marginLeft: 15,
  },
};

const Header = ({
  classes,
}) => (
  <div className={classes.root}>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
            Zoo Nutrition Assistant
        </Typography>
        <Button className={classes.button} color="inherit">Home</Button>
        <Button className={classes.button} color="inherit">Reports</Button>
        <Button className={classes.button} color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  </div>
);

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
