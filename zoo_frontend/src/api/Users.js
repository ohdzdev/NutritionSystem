import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class Users {
  constructor(token) {
    this.token = token;
  }

  async getUsers(filter) {
    let query = `${API_BASE_URL}/Accounts`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createUser(firstName, lastName, email, locationId, password) {
    const uri = `${API_BASE_URL}/Accounts/replaceOrCreate?access_token=${this.token}`;

    const res = await axios.post(uri, {
      firstName,
      lastName,
      email,
      locationId,
      password,
    });
    return res;
  }

  async deleteUser(userId) {
    const uri = `${API_BASE_URL}/Accounts/${userId}?access_token=${this.token}`;

    const res = await axios.delete(uri);
    return res;
  }

  async updateUser(userId, updates) {
    const uri = `${API_BASE_URL}/Accounts/${userId}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates);
    return res;
  }

  async resetPasswordByAdmin(userId, password) {
    const uri = `${API_BASE_URL}/Accounts/reset-password?access_token=${this.token}`;

    const res = await axios.post(uri, {
      id: userId,
      newPassword: password,
    });

    return res;
  }

  async changePassword(oldPassword, newPassword) {
    const uri = `${API_BASE_URL}/Accounts/change-password?access_token=${this.token}`;

    const res = await axios.post(uri, {
      oldPassword,
      newPassword,
    });

    return res;
  }
}

export default Users;
