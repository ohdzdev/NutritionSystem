import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Admin } from '../../../PageAccess';

class Home extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
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
          {hasAccess(role, Admin.roles) &&
            <Link href={Admin.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Admin Home
              </Button>
            </Link>
          }
          {hasAccess(role, Admin.user.roles) &&
            <Link href={Admin.user.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                View Users
              </Button>
            </Link>
          }
          {hasAccess(role, Admin.user.new.roles) &&
            <Link href={Admin.user.new.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW User
              </Button>
            </Link>
          }
          {/* TODO add report link logic here */}
          <Link href="/reports/user">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
                User Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
