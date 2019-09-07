import axios from 'axios';

let API_BASE_URL = process.env.BACKEND_URL;

if (typeof window === 'undefined') {
  API_BASE_URL = `http://localhost:${process.env.PORT}`;
}

class NutrDef {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getNutrDef(filter) {
    let query = `${API_BASE_URL}/api/NutrDefs/`;
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
