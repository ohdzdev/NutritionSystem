import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import {
  Species, Department, User, hasAccess,
} from '../PageAccess';

class Home extends Component {
  static propTypes = {
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
    };
  }

  render() {
    const { role } = this.props.account;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{
          justifyContent: 'space-around', alignItems: 'center', display: 'flex',
        }}
        >
          { hasAccess(role, Department.roles) &&
            <Link href={Department.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
              Department Management
              </Button>
            </Link>
          }
          { hasAccess(role, Species.roles) &&
            <Link href={Species.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
              Species Management
              </Button>
            </Link>
          }
          { hasAccess(role, User.roles) &&
            <Link href={User.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
              User Management
              </Button>
            </Link>
          }
        </div>
      </div>
    );
  }
}

export default Home;
