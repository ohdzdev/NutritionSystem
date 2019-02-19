import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Api {
  static validateToken = async (token) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/accessTokens/validateAndRetreiveUser`, {
        token,
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/accounts/login`, {
        email,
        password,
      });
      document.cookie = `authToken=${res.data.token}`;
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default Api;
