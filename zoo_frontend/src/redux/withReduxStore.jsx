import React from 'react';
import initializeStore from './Store';

const isServer = typeof window === 'undefined';
const NEXT_REDUX_STORE = '__NEXT_REDUX_STORE__';

function getOrCreateStore() {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore();
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[NEXT_REDUX_STORE]) {
    window[NEXT_REDUX_STORE] = initializeStore();
  }
  return window[NEXT_REDUX_STORE];
}

export default (App) => class WithReduxStore extends React.Component {
  static async getInitialProps(appContext) {
    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const reduxStore = getOrCreateStore();

    // Provide the store to getInitialProps of pages
    appContext.ctx.reduxStore = reduxStore;

    let appProps = {};
    if (typeof App.getInitialProps === 'function') {
      appProps = await App.getInitialProps(appContext);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    };
  }

  constructor(props) {
    super(props);
    this.reduxStore = getOrCreateStore();
  }

  render() {
    return <App {...this.props} reduxStore={this.reduxStore} />;
  }
};
