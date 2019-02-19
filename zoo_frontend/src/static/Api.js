import axios from 'axios';

import { LoginActions } from '../redux/ActionTypes';

const API_BASE_URL = process.env.BACKEND_URL;

class Api {
  static validateToken = async (token) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/accessTokens/validateToken`, {
        token,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  store = null;

  constructor(store) {
    this.store = store;
  }

  login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/accounts/login`, {
        email,
        password,
      });
      document.cookie = `authToken=${res.data.token}`;
      this.store.dispatch({
        type: LoginActions.LOGIN,
        ...res.data,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/accounts/logout`, null, {
        params: {
          access_token: this.store.getState().login.token,
        },
      });
      this.store.dispatch({
        type: LoginActions.LOGOUT,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default Api;
