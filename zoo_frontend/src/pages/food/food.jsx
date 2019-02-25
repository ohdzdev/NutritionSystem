import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import FoodAPI from '../../api/Food';

import { hasAccess, Home, Food } from '../PageAccess';

export default class extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    this.api = new FoodAPI(authToken);
    const res = await this.api.getFood().catch((err) => ({ foodItems: [{ err: true, msg: err }] }));
    return { foodItems: res.data };
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    foodItems: PropTypes.array.isRequired,
  };

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
        <div>
          <pre>
            {JSON.stringify(this.props.foodItems, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}
