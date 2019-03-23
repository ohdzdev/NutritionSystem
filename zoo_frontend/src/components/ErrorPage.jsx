import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const ErrorPage = ({ classes, message }) => (
  <div className={classes.root}>
    <Typography variant="h6" color="error">
      An error has occurred: {message}
    </Typography>
  </div>
);

ErrorPage.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string,
};

ErrorPage.defaultProps = {
  message: 'Generic Error.',
};

export default withStyles(styles)(ErrorPage);
