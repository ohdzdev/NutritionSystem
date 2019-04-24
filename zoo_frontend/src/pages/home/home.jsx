import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Home extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { classes, account = {}, token } = this.props;
    const { role = '' } = account;

    return (
      <div className={classes.root} />
    );
  }
}

export default Home;
