import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Home, Diet } from '../../PageAccess';

export default class extends Component {
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
          {hasAccess(role, Home.roles) &&
            <Link href={Home.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Home
              </Button>
            </Link>
          }
          {hasAccess(role, Diet.roles) &&
            <Link href={Diet.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                View Diets
              </Button>
            </Link>
          }
          {hasAccess(role, Diet.edit.roles) &&
            <Link href={Diet.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Edit Diet
              </Button>
            </Link>
          }
          {/* add logic for report links here */}
          <Link href="/reports/diet">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              Diet Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
