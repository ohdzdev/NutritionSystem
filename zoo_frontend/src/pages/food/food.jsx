import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Home, Food } from '../PageAccess';

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
          {hasAccess(role, Food.edit.roles) &&
            <Link href={Food.edit.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                EDIT food
              </Button>
            </Link>
          }
          {hasAccess(role, Food.new.roles) &&
            <Link href={Food.new.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                NEW food
              </Button>
            </Link>
          }
          {/* TODO add report link logic here */}
          <Link href="/reports/food">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
            food Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
