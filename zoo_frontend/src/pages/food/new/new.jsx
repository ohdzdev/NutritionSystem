import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';

class Home extends Component {
  static propTypes = {
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
          <Link href="/food">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              View Foods
            </Button>
          </Link>
          <Link href="/food/new">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              NEW Food
            </Button>
          </Link>
          <Link href="/reports/food">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              Food Reports
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
