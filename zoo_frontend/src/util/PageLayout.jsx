import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Drawer from '../components/SidebarDrawer';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class PageLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    account: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    let drawerInitialState = true;
    if (props.account && !props.account.loggedIn) {
      drawerInitialState = false;
    }
    this.state = {
      drawerOpen: drawerInitialState,
    };
  }

  componentDidUpdate(prevProps) {
    if (!!prevProps.account.loggedIn !== !!this.props.account.loggedIn) {
      // account can be {} !! forces a boolean returned if key is undefined
      if (!this.props.account.loggedIn) {
        this.setState({ drawerOpen: false }); // eslint-disable-line react/no-did-update-set-state
      } else {
        this.setState({ drawerOpen: true }); // eslint-disable-line react/no-did-update-set-state
      }
    }
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Header drawerOpen={this.state.drawerOpen} handleDrawerOpen={this.handleDrawerOpen} />
        <Drawer drawerOpen={this.state.drawerOpen} handleDrawerClose={this.handleDrawerClose} />
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: this.state.drawerOpen,
          })}
        >
          <div className={classes.drawerHeader} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(PageLayout);
