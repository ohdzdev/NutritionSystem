import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookies from 'next-cookies';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Router from 'next/router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { AuthContext } from './AuthProvider';
import Api from '../api/Api';
import LocalStorage from '../static/LocalStorage';
import Header from '../components/Header';
import Drawer from '../components/SidebarDrawer';

const redirectTo = (destination, { res, status } = {}) => {
  if (res) {
    res.writeHead(status || 302, { Location: destination });
    res.end();
  } else if (destination[0] === '/' && destination[1] !== '/') {
    Router.push(destination);
  } else {
    window.location = destination;
  }
};

const drawerWidth = 240;

const styles = theme => ({
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

export default (allowedRoles = ['authenticated']) => (WrappedComponent) => {
  class withAuth extends Component {
    static async getInitialProps(ctx) {
      let pageProps = {};

      const c = cookies(ctx);

      if (c.authToken == null || c.authToken === '') {
        if (allowedRoles.includes('unauthenticated')) {
          if (WrappedComponent.getInitialProps) {
            pageProps = await WrappedComponent.getInitialProps(ctx);
          }
          return { ...pageProps };
        }

        // redirecting to login because current page does not support unauth users
        redirectTo('/login', { res: ctx.res, status: 301 });
        return { ...pageProps };
      }

      const api = new Api(c.authToken || '');

      try {
        await api.validateToken().catch(() => {
          if (process.browser) {
            document.cookie = 'authToken=; path=/';
          }
          api.setToken('');
          return {};
        });

        if (WrappedComponent.getInitialProps) {
          ctx.authToken = c.authToken;
          pageProps = await WrappedComponent.getInitialProps(ctx);
        }
        return { ...pageProps, token: c.authToken || '' };
      } catch (err) {
        try {
          await api.logout();
        } catch (err2) {
          // ignore this error
        }
        if (process.browser) {
          document.cookie = 'authToken=; path=/';
        }
        redirectTo('/login', { res: ctx.res, status: 301 });
      }
      return { ...pageProps };
    }

    static propTypes = {
      classes: PropTypes.object.isRequired,
      token: PropTypes.string,
    }

    static defaultProps = {
      token: '',
    }

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        account: {},
        drawerOpen: false,
      };

      this.api = new Api(props.token);

      this.context.setApi(this.api);
    }

    componentDidMount() {
      const account = {
        loggedIn: this.props.token != null && this.props.token !== '',
        firstName: LocalStorage.getFirstName(),
        lastName: LocalStorage.getLastName(),
        email: LocalStorage.getEmail(),
        role: LocalStorage.getRole() || 'unauthenticated',
        id: LocalStorage.getId(),
      };

      if (!allowedRoles.includes(account.role)) {
        Router.push(account.role === 'unauthenticated' ? '/login' : '/');
        return;
      }

      this.context.setAccount(account);

      this.setState({ account, loading: false });
    }

    handleDrawerOpen = () => {
      this.setState({ drawerOpen: true });
    };

    handleDrawerClose = () => {
      this.setState({ drawerOpen: false });
    };


    render() {
      const { classes, ...rest } = this.props;
      return (
        <div className={classes.root}>
          <Header
            account={this.state.account}
            api={this.api}
            drawerOpen={this.state.drawerOpen}
            handleDrawerOpen={this.handleDrawerOpen}
          />
          <Drawer
            account={this.state.account}
            drawerOpen={this.state.drawerOpen}
            handleDrawerClose={this.handleDrawerClose}
          />
          {!this.state.loading &&
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: this.state.drawerOpen,
            })}
          >
            <div className={classes.drawerHeader} />
            <WrappedComponent
              {...rest}
              account={this.state.account}
              api={this.api}
            />
          </main>
          }
        </div>
      );
    }
  }

  hoistNonReactStatics(withAuth, WrappedComponent, { getInitialProps: true });

  withAuth.allowedRoles = allowedRoles;
  withAuth.contextType = AuthContext;
  withAuth.displayName = `withAuth(${WrappedComponent.displayName})`;

  return withStyles(styles)(withAuth);
};
