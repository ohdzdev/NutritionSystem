import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import cookies from 'next-cookies';
import Router from 'next/router';

import getPageContext from '../src/getPageContext';
import Header from '../components/Header';
import Api from '../src/static/Api';

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

class MyApp extends App {
  static async getInitialProps({ ctx, Component }) {
    let pageProps = {};
    const c = cookies(ctx);
    this.api = new Api(c.authToken || '');
    const allowedRoles = Component.allowedRoles || ['authenticated'];
    console.log(`page roles ${allowedRoles} - auth: ${c.authToken}`);
    if (typeof c.authToken === 'undefined' || c.authToken === '') {
      if (allowedRoles.includes('unauthenticated')) {
        if (Component.getInitialProps) {
          pageProps = await Component.getInitialProps(ctx);
        }
        return { ...pageProps };
      }
      // redirecting to login because current page does not support unauth users
      redirectTo('/login', { res: ctx.res, status: 301 });
    } else {
      // we have a token let's try to authenticate so user can get data from backend
      try {
        const res = await this.api.validateToken();
        console.log(`user validated account: ${JSON.stringify(res)}`);

        if (allowedRoles.includes(res.data.role)) {
          if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
          }
        }
        return { ...pageProps, account: res.data || null, token: c.authToken || '' };
      } catch (err) {
        // TODO make popup to user saying their session expired or something here

        // Call failed in some way - clear cookie / logout and redirect to login.
        this.api.logout();
        redirectTo('/login', { res: ctx.res, status: 301 });
      }
    }

    return { ...pageProps };
  }

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
    this.api = new Api(props.token);
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component } = this.props;
    return (
      <Container>
        <Head>
          <title>Nutrition Asst</title>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
            <Header
              api={this.api}
              account={this.props.account}
            />
            <Component
              pageContext={this.pageContext}
              api={this.api}
              {...this.props}
            />
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
