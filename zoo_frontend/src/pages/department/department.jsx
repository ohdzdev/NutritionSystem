import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Department, Admin } from '../PageAccess';

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
          {hasAccess(role, Department.edit.roles) &&
            <Link href={Department.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                EDIT Department
              </Button>
            </Link>
          }
          {hasAccess(role, Department.new.roles) &&
            <Link href={Department.new.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW Department
              </Button>
            </Link>
          }
          {/* TODO add reports link logic here */}
          <Link href="/reports/department">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              Department Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
