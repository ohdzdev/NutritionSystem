import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';

import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import getPageContext from '../src/getPageContext';
import AuthProvider, { AuthContext } from '../src/util/AuthProvider';
import PageLayout from '../src/util/PageLayout';


class MyApp extends App {
  static async getInitialProps({ ctx, Component }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { ...pageProps };
  }

  constructor(props) {
    super(props);

    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const appContainer = document.getElementById('__next');
    appContainer.style.height = '100vh';
  }

  render() {
    const { Component, ...rest } = this.props;

    return (
      <Container>
        <Head>
          <title>Nutrition Asst</title>
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
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
            <AuthProvider>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                  to render collected styles on server-side. */}

              <AuthContext.Consumer>
                {({ account }) => (
                  // https://github.com/facebook/react/issues/12397#issuecomment-374004053
                  <PageLayout
                    account={account} // needs to know for sidebar initial drawer position in constructor
                  >
                    <Component
                      pageContext={this.pageContext}
                      {...rest}
                    />
                  </PageLayout>
                )}
              </AuthContext.Consumer>
            </AuthProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
