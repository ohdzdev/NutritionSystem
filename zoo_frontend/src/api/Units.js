import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Units {
  constructor(token) {
    this.token = token;
  }

  async getUnits(filter) {
    let query = `${API_BASE_URL}/api/Units/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async updateUnits(speciesId, updates) {
    if (!speciesId) {
      return Promise.reject(new Error('must have id send into updateUnits()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(
        new Error(
          'must have object with some keys that will be updated. If meant to delete use deleteUnit()',
        ),
      );
    }
    const uri = `${API_BASE_URL}/api/Units/${speciesId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async addUnit(newData) {
    if (Object.keys(newData) === undefined || Object.keys(newData).length < 1) {
      return Promise.reject(
        new Error(
          'must have data in order to create record. please send a json with relevant keys',
        ),
      );
    }
    const uri = `${API_BASE_URL}/api/Units/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, newData);
    return res;
  }

  async deleteUnit(speciesId) {
    const uri = `${API_BASE_URL}/api/Units/${speciesId}?access_token=${this.token}`;
    const res = axios.delete(uri);
    return res;
  }
}

export default Units;
