import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cookies from 'next-cookies';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Router from 'next/router';

import { AuthContext } from './AuthProvider';
import Api from '../api/Api';
import LocalStorage from '../static/LocalStorage';

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

export default (allowedRoles = ['authenticated']) => (WrappedComponent) => {
  class withAuth extends Component {
    static async getInitialProps(ctx) {
      let pageProps = {};

      const c = cookies(ctx);

      console.log(c);

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
      token: PropTypes.string,
    }

    static defaultProps = {
      token: '',
    }

    constructor(props, context) {
      super(props, context);

      this.state = {
        loading: true,
        account: {},
      };

      console.log(props);

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

    render() {
      if (!this.state.loading) {
        return (
          <WrappedComponent
            {...this.props}
            account={this.state.account}
            api={this.api}
          />
        );
      }
      return null;
    }
  }

  hoistNonReactStatics(withAuth, WrappedComponent, { getInitialProps: true });

  withAuth.allowedRoles = allowedRoles;
  withAuth.contextType = AuthContext;
  withAuth.displayName = `withAuth(${WrappedComponent.displayName})`;

  return withAuth;
};
