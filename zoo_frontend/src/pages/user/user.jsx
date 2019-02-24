import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Admin, User } from '../PageAccess';

class Home extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
    };
    console.log(props.classes);
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
          {hasAccess(role, User.roles) &&
            <Link href={User.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                EDIT User
              </Button>
            </Link>
          }
          {hasAccess(role, User.new.link) &&
            <Link href="/admin/user/new">
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW User
              </Button>
            </Link>
          }
          {hasAccess(role, User['pw-reset'].roles) &&
            <Link href={User['pw-reset'].link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                User Password Resets
              </Button>
            </Link>
          }
          {/* TODO add reports link logic here */}
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
