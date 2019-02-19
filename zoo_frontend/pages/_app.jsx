import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import { Provider } from 'react-redux';
import cookies from 'next-cookies';
import Router from 'next/router';

import getPageContext from '../src/getPageContext';
import Header from '../components/Header';
import withReduxStore from '../src/redux/withReduxStore';
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
  static async getInitialProps({ ctx, Component, router }) {
    let pageProps = {};
    const c = cookies(ctx);

    if (Component.getInitialProps) {
      console.log("got props")
      pageProps = await Component.getInitialProps(ctx);
    }

    let { allowedRoles } = pageProps;

    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      allowedRoles = ['authenticated'];
    }

    if (typeof c.authToken === 'undefined') {
      if (allowedRoles.includes('unauthenticated')) {
        return { ...pageProps };
      }
      redirectTo('/login', { res: ctx.res, status: 301 });
    } else {
      console.log(c.authToken);
      const res = await Api.validateToken(c.authToken);

      console.log(res);
    }
  }

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
    this.api = new Api(this.props.reduxStore);
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Head>
          <title>Nutrition Asst</title>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
        </Head>
        <Provider store={reduxStore}>
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
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
