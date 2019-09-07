import axios from 'axios';

let API_BASE_URL = process.env.BACKEND_URL;

if (typeof window === 'undefined') {
  API_BASE_URL = `http://localhost:${process.env.PORT}`;
}

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
    const uri = `${API_BASE_URL}/api/Species/${speciesId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
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
