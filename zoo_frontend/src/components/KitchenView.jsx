import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';


let id = 0;
function createData(unit, food) {
  id += 1;
  return {
    unit, food,
  };
}

const rows = [
  createData('500 g', 'MIXED GREANS'),
  createData('330 g', 'SEASONAL FRUIT'),
];

const styles = theme => ({
  pageText: {
    textAlign: 'right',
    marginBottom: theme.spacing.unit,
  },
});


class KitchenView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0, // index of the data the user is on
    };
  }

  handleNext = () => {

  }

  handlePrev = () => {

  }

  render() {
    const { classes, diets } = this.props;

    console.log('Total pages: ', this.state.totalPages);
    console.log('Current Page: ', this.state.currentPage);
    console.log(diets);

    return (
      <div>
        <div className={classes.pageText}>
          <Typography> Page {this.state.currentIndex + 1}/{diets && diets.length}</Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: 1 }}>
            <Typography style={{ fontSize: 30 }}>Procupine, Indian Crested</Typography>
            <Typography style={{ fontSize: 22 }}>{diets[this.state.currentIndex].noteId}</Typography>
            <Typography style={{ fontSize: 20, marginTop: 20 }}>Prep Notes</Typography>
            <div>
              <Typography>
                  No shredded carrot.
              </Typography>
            </div>
            <div>
              <Typography style={{ fontSize: 20, marginTop: 20 }}>History</Typography>
              <div>
                <Typography>
                  date: changes
                </Typography>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ textAlign: 'right' }}>
              <Typography style={{ fontSize: 22 }}>Jungle</Typography>
              <Typography style={{ fontSize: 22 }}>GIBBON</Typography>
            </div>
            <Table style={{ marginTop: 20 }}>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align="left">{row.unit}</TableCell>
                    <TableCell align="left">{row.food}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>
    );
  }
}

KitchenView.propTypes = {
  classes: PropTypes.object.isRequired,
  diets: PropTypes.array.isRequired,
};

export default withStyles(styles)(KitchenView);
