import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';

import getPageContext from '../src/getPageContext';
import withAuth from '../src/util/withAuth';
import Api from '../src/api/Api';

class MyApp extends App {
  static async getInitialProps({ ctx, Component }) {
    let pageProps = {};

    const AuthedComponent = withAuth(Component);

    if (AuthedComponent.getInitialProps) {
      pageProps = await AuthedComponent.getInitialProps(ctx);
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

    const appContainer = document.getElementById('__next');
    appContainer.style.height = '100vh';
  }

  render() {
    const { Component } = this.props;

    const AuthedComponent = withAuth(Component);
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
            <AuthedComponent
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
