import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import VirtualTable from '../../components/VirtualTable';

function NutrHome(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.column}>
          <div className={classes.row}>
            <div className={classes.date}>
              {// date component
              }
              <h3>2/11/2019</h3>
            </div>
            <Button variant="contained" className={classes.button} color="secondary">
              Edit Diets
            </Button>
            <Button variant="contained" className={classes.button} color="secondary">
              Edit Foods
            </Button>
          </div>
          <VirtualTable />
        </div>
      </div>
    </div>
  );
}

NutrHome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default NutrHome;
