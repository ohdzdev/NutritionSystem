import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Api {
  constructor(token) {
    this.token = token;
  }

  setToken() {
    return this.token;
  }

  getToken(newToken) {
    this.token = newToken;
  }

  validateToken = async () => {
    try {
      if (this.token === '' || this.token === 'undefined') {
        throw new Error('Session Token Blank');
      }
      const res = await axios.post(`${API_BASE_URL}/api/AccessTokens/validateAndRetreiveUser`, {
        token: this.token,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      document.cookie = 'authToken=';
      this.token = '';
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
      this.setToken(res.data.token);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  logout = async () => {
    if (this.token) {
      try {
        await axios.post(`${API_BASE_URL}/api/accounts/logout`, null, {
          params: {
            access_token: this.token,
          },
        });
        document.cookie = 'authToken=';
      } catch (e) {
        // call failed auth token is probably already cleared, supress errors and clear cookie
        document.cookie = 'authToken=';
      }
    } else {
      // just in case
      this.token = '';
      document.cookie = 'authToken=';
    }
  }
}

export default Api;
