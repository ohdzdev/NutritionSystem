import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

import { hasAccess, Home, Food } from '../../PageAccess';

import FoodAPI from '../../../api/Food';
import NutDataAPI from '../../../api/NutData';

export default class extends Component {
  static async getInitialProps({ query, authToken }) {
    if (!query.id) {
      // show error and return to view foods
    } else {
      const serverFoodAPI = new FoodAPI(authToken);
      const serverNutDataAPI = new NutDataAPI(authToken);

      const food = await serverFoodAPI.getFood({ where: { foodId: query.id } });
      const category = await serverFoodAPI.getRelatedCategory(query.id);
      const budgetCode = await serverFoodAPI.getRelatedBudgetCode(query.id);

      const nutData = await serverNutDataAPI.getNutData({ where: { foodId: query.id } });
      // loop over nutData results and grab their respective nutrition sources in a single where query.
      // ?filter={"where":{"or":[{"id":1},{"id":2},...,{"id":20"},{"id":21}]}}

      return {
        ...query,
        food: food.data,
        category: category.data,
        budgetCode: budgetCode.data,
        nutrionData: nutData,
      };
    }
    return {};
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    console.log(props);
    console.log(props.id);
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
          {hasAccess(role, Home.roles) &&
            <Link href={Home.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                Home
              </Button>
            </Link>
          }
          {hasAccess(role, Food.roles) &&
            <Link href={Food.link}>
              <Button className={this.props.classes.button} color="secondary" variant="contained">
                View food
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
