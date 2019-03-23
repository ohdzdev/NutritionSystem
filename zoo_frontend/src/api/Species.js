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

  async updateSpecies(speciesID, updates) {
    const uri = `${API_BASE_URL}/api/Species/update?where=${JSON.stringify({ speciesId: speciesID })}&access_token=${this.token}`;
    const res = await axios.post(uri, updates);
    return res;
  }
}

export default Species;
