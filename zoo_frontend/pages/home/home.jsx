import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import VirtualTable from '../../components/VirtualTable';

const styles = {
    root: {
        margin: 28
    }
};

// const data = [
//   createData('Cucumber', '1500g', 'Sea Turtle', 899, 'Aquarium'),
//   createData('Apples', '2000g', 'Gorilla', 765, 'Jungle'),
// ];

function NutrHome(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <VirtualTable />
    </div>
  );
}

NutrHome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NutrHome);
