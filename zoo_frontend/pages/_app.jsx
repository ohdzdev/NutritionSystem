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

    const allowedRoles = Component.allowedRoles || ['authenticated'];

    if (typeof c.authToken === 'undefined') {
      if (allowedRoles.includes('unauthenticated')) {
        if (Component.getInitialProps) {
          pageProps = await Component.getInitialProps(ctx);
        }
        return { ...pageProps };
      }
      redirectTo('/login', { res: ctx.res, status: 301 });
    } else {
      try {
        const res = await Api.validateToken(c.authToken);

        if (allowedRoles.includes(res.data.role)) {
          if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
          }
          return { ...pageProps, account: res.data, token: c.authToken };
        }

        redirectTo('/', { res: ctx.res, status: 301 });
      } catch (err) {
        // Call failed in some way, lets redirect to login
        document.cookie = 'authtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        redirectTo('/login', { res: ctx.res, status: 301 });
      }
    }

    return { ...pageProps };
  }

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
    this.api = new Api();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
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
            />
            <Component
              pageContext={this.pageContext}
              api={this.api}
              {...pageProps}
            />
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
