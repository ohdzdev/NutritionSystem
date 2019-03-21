import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

class Profile extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { classes, account = {} } = this.props;
    const { role = '' } = account;

    return (
      <div className={classes.root}>
        
      </div>
    );
  }
}

export default Profile;
