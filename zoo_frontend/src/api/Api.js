import axios from 'axios';
import LocalStorage from '../static/LocalStorage';

import API_BASE_URL from '../util/ApiURL';

class Api {
  constructor(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  setToken(newToken) {
    this.token = newToken;
  }

  validateToken = async () => {
    if (this.token === '' || this.token === 'undefined') {
      console.log(
        'tried validating blank token in validateToken(), please verify this was intentional',
      );
      throw new Error('Session Token Blank');
    }
    const res = await axios.post(`${API_BASE_URL}/AccessTokens/validate`, {
      token: this.token,
    });
    return res;
  };

  login = async (email, password) => {
    await axios
      .post(`${API_BASE_URL}/accounts/login`, {
        email,
        password,
      })
      .then(
        (res) => {
          const { data } = res;
          if (data) {
            LocalStorage.setEmail(data.email);
            LocalStorage.setFirstName(data.firstName);
            LocalStorage.setLastName(data.lastName);
            LocalStorage.setRole(data.role);
            LocalStorage.setId(data.id);
            document.cookie = `authToken=${res.data.token}; path=/`;
            this.setToken(res.data.token);
          } else {
            throw new Error('Invalid login return');
          }
        },
        (err) => {
          if (err.response && err.response.data && err.response.data.error) {
            throw err.response.data.error;
          } else {
            throw err;
          }
        },
      );
  };

  logout = async () => {
    LocalStorage.setEmail('');
    LocalStorage.setFirstName('');
    LocalStorage.setLastName('');
    LocalStorage.setRole('');
    LocalStorage.setId(0);
    if (this.token) {
      try {
        await axios.post(`${API_BASE_URL}/accounts/logout`, null, {
          params: {
            access_token: this.token,
          },
        });
      } catch (err) {
        // Ignore the error
      }
    }
    this.token = '';
    document.cookie = 'authToken=; path=/';
  };
}

export default Api;
