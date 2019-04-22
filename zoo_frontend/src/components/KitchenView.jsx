import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  pageText: {
    textAlign: 'right',
    marginBottom: theme.spacing.unit,
  },
  topMargin: {
    marginTop: theme.spacing.unit * 7,
    marginBottom: theme.spacing.unit,
  },
  bottomMargin: {
    marginBottom: theme.spacing.unit,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    paddingRight: theme.spacing.unit * 3,
  },
  table: {
    marginTop: theme.spacing.unit * 9,
  },
});

const formatDate = (d) => {
  const newD = moment(d);
  return moment(newD).format('MM-DD-YYYY');
};

const KitchenView = ({
  classes, currentPage, pageLength, noteId, species, prepNotes, dc, dietChanges, foodPrep,
}) => (
  <div>
    <div className={classes.pageText}>
      <Typography> Page {currentPage}/{pageLength}</Typography>
    </div>
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <Typography variant="h1" style={{ fontSize: 30 }} className={classes.bottomMargin}>{species}</Typography>
        <Typography variant="h2" style={{ fontSize: 22 }}>{noteId}
        </Typography>
        <Typography className={classes.topMargin} variant="h3" style={{ fontSize: 22, color: 'grey' }}>Prep Notes</Typography>
        <div style={{ marginTop: 10 }}>
          {prepNotes.map(txt => <Typography style={{ fontSize: 18 }}>{txt.prepNote}</Typography>)}
        </div>
        <div>
          <Typography variant="h3" style={{ fontSize: 22, marginTop: 30, color: 'grey' }}>History</Typography>
          <div>
            {dietChanges.map(txt =>
              // eslint-disable-next-line implicit-arrow-linebreak
              <div style={{ marginTop: 10 }}>
                <Typography variant="h4" style={{ fontSize: 14 }}>{formatDate(txt.dietChangeDate)}</Typography>
                <Typography style={{ fontSize: 18 }}>{txt.dietChangeReason}</Typography>
              </div>)}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ textAlign: 'right' }}>
          <Typography variant="h2" style={{ fontSize: 22 }}>{dc}</Typography>
        </div>
        <Table className={classes.table}>
          <TableBody>
            {foodPrep.map(row => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.group_amount + row.unit}</TableCell>
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
  dc: PropTypes.string,
  dietChanges: PropTypes.array,
  foodPrep: PropTypes.array,
  date: PropTypes.string,
};

KitchenView.defaultProps = {
  currentPage: 0,
  pageLength: 0,
  noteId: '',
  species: '',
  prepNotes: [],
  dc: '',
  dietChanges: ['none'],
  foodPrep: [],
  date: '',
};


export default withStyles(styles)(KitchenView);
