import React from 'react';

// utils
import moment from 'moment';
import PropTypes from 'prop-types';

// UI imports
import {
  Card, Typography, CardContent, withStyles,
} from '@material-ui/core';
import Person from '@material-ui/icons/Person';


const styles = (theme) => ({
  card: {
    margin: theme.spacing(1),
  },
  reasonTitle: {
    color: theme.palette.primary.main,
  },
  changedByDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: '20px',
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: 20,
  },
  changedByText: {
    fontSize: 20,
  },
});

const DietChangeCard = (props) => {
  let changedBy = 'unknown';
  if (props.userId) {
    if (props.email) {
      changedBy = props.email;
    } else if (props.userId) {
      const cardUser = props.AllUsers.find((user) => user.id === props.userId);
      changedBy = cardUser.email;
    }
  } else if (props.bgtUserId) {
    changedBy = props.bgtUserId;
  }
  return (
    <>
      <Card className={props.classes.card}>
        <CardContent>
          <Typography className={props.classes.title} color="textSecondary" gutterBottom>
            {moment(new Date(props.dietChangeDate)).format(' MM-DD-YYYY h:mm A')}
          </Typography>
          <Typography variant="h6" className={props.classes.reasonTitle}>
          Reason
          </Typography>
          <Typography variant="body1">
            {props.dietChangeReason}
          </Typography>
          <div className={props.classes.changedByDiv}>
            <Person className={props.classes.icon} />
            <Typography className={props.classes.changedByText}>
              {changedBy}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

DietChangeCard.propTypes = {
  userId: PropTypes.number,
  email: PropTypes.string,
  bgtUserId: PropTypes.string,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    reasonTitle: PropTypes.string.isRequired,
    changedByDiv: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    changedByText: PropTypes.string.isRequired,
  }).isRequired,
  dietChangeDate: PropTypes.string.isRequired,
  dietChangeReason: PropTypes.string,
  AllUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DietChangeCard.defaultProps = {
  userId: null,
  email: null,
  bgtUserId: '',
  dietChangeReason: 'None',
};

export default withStyles(styles)(DietChangeCard);
