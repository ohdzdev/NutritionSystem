import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class NutrDef {
  constructor(token) {
    this.token = token;
  }

  async getNutrDef(filter) {
    let query = `${API_BASE_URL}/api/NutrDefs`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createNutrDef(newData) {
    const uri = `${API_BASE_URL}/api/NutrDefs/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, newData);
    return res;
  }

  async updateNutrDef(nutrNo, updates) {
    const uri = `${API_BASE_URL}/api/NutrDefs/${nutrNo}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async deleteNutrDef(dataSrcId) {
    const uri = `${API_BASE_URL}/api/NutrDefs/${dataSrcId}?access_token=${this.token}`;
    const res = await axios.delete(uri);
    return res;
  }
}

export default NutrDef;
