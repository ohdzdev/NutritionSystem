import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Species {
  constructor(token) {
    this.token = token;
  }

  async getSpecies(filter) {
    let query = `${API_BASE_URL}/api/Species/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async updateSpecies(speciesId, updates) {
    const uri = `${API_BASE_URL}/api/Species/update?where=${JSON.stringify({ speciesId })}&access_token=${this.token}`;
    console.log(uri);
    console.log(updates);
    const res = await axios.post(uri, updates);
    return res;
  }

  async addSpecies(newData) {
    const uri = `${API_BASE_URL}/api/Species/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, newData);
    return res;
  }

  async deleteSpecies(speciesId) {
    const uri = `${API_BASE_URL}/api/Species/${speciesId}?access_token=${this.token}`;
    const res = axios.delete(uri);
    return res;
  }
}

export default Species;
