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

const KitchenView = ({
  classes, currentPage, pageLength, noteId, species, prepNotes,
}) => (
  <div>
    <div className={classes.pageText}>
      <Typography> Page {currentPage}/{pageLength}</Typography>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1 }}>
        <Typography style={{ fontSize: 30 }}>{species}</Typography>
        <Typography style={{ fontSize: 22 }}>{noteId}
        </Typography>
        <Typography style={{ fontSize: 20, marginTop: 30 }}>Prep Notes</Typography>
        <div>
          {prepNotes.map(txt => <Typography>{txt.prepNote}</Typography>)}
        </div>
        <div>
          <Typography style={{ fontSize: 20, marginTop: 30 }}>History</Typography>
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
        <Table style={{ marginTop: 30 }}>
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

KitchenView.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  pageLength: PropTypes.number,
  noteId: PropTypes.string,
  species: PropTypes.string,
  prepNotes: PropTypes.array,
};

KitchenView.defaultProps = {
  currentPage: 0,
  pageLength: 0,
  noteId: '',
  species: '',
  prepNotes: ['none'],
};


export default withStyles(styles)(KitchenView);
