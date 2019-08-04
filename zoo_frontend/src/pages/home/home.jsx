import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';
import { CircularProgress as CircProgress } from '@material-ui/core';
import Roles from '../../static/Roles';


import { Admin, Kitchen } from '../PageAccess';


class Home extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    const { role = '' } = props.account;

    if (role === Roles.ADMIN) {
      Router.push(Admin.user.link);
    } else if (role === Roles.KEEPER || role === Roles.KITCHEN || role === Roles.KITCHENPLUS) {
      Router.push(Kitchen.link);
    } else if (role === Roles.SUPERVISOR) {
      Router.push(Kitchen.link);
    }
  }

  render() {
    return (
      <div
        style={{
          height: '90vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircProgress />
      </div>
    );
  }
}

export default Home;
