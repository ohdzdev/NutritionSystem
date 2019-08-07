import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({
  account: {},
  api: {},
  setAccount: () => {},
  setApi: () => {},
});

class AuthProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  };

  constructor(props) {
    super(props);

    /* eslint-disable react/no-unused-state */

    this.setAccount = (account) => this.setState({ account });
    this.setApi = (api) => this.setState({ api });

    this.state = {
      account: {},
      api: {},
      setAccount: this.setAccount,
      setApi: this.setApi,
    };

    /* eslint-enable react/no-unused-state */
  }

  render() {
    return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
  }
}

export default AuthProvider;
export { AuthContext };
