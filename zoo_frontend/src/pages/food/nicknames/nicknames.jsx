import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

import { hasAccess, Home, Food } from '../../PageAccess';


export default class extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    token: '',
  }

  async getFoodNickNames() {
    const tok = this.props.token;
    console.log(tok);
  }

  render() {
    const { role } = this.props.account;
    return (
      <div>
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
              View Food
            </Button>
          </Link>
        }
        <div>
          enter a cool table for editing food nicknames here.
          Make editing possible in a modal so no edit page is needed
        </div>
      </div>
    );
  }
}
