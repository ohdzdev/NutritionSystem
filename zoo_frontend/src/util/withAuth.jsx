import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cookies from 'next-cookies';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Router from 'next/router';

import Api from '../api/Api';
import LocalStorage from '../static/LocalStorage';
import Header from '../../components/Header';

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

export default (WrappedComponent) => {
  class withAuth extends Component {
    static async getInitialProps(ctx) {
      let pageProps = {};

      const c = cookies(ctx);

      const allowedRoles = WrappedComponent.allowedRoles || ['authenticated'];

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

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        account: {},
      };

      this.api = new Api(props.token);
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

      const allowedRoles = WrappedComponent.allowedRoles || ['authenticated'];

      if (!allowedRoles.includes(account.role)) {
        Router.push(account.role === 'unauthenticated' ? '/login' : '/');
        return;
      }

      this.setState({ account, loading: false });
    }

    render() {
      return (
        <Fragment>
          <Header
            account={this.state.account}
            api={this.api}
          />
          {!this.state.loading &&
            <WrappedComponent
              {...this.props}
              account={this.state.account}
              api={this.api}
            />
          }
        </Fragment>
      );
    }
  }

  hoistNonReactStatics(withAuth, WrappedComponent, { getInitialProps: true });

  withAuth.displayName = `withAuth(${WrappedComponent.displayName})`;

  return withAuth;
};
