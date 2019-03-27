import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class DataSrcs {
  constructor(token) {
    this.token = token;
  }

  async getDataSrc(filter) {
    let query = `${API_BASE_URL}/api/DataSrcs`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createDataSrc(newData) {
    const uri = `${API_BASE_URL}/api/DataSrcs/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, newData);
    return res;
  }

  async updateDataSrc(dataSrcId, updates) {
    const uri = `${API_BASE_URL}/api/DataSrcs/${dataSrcId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async deleteDataSrc(dataSrcId) {
    const uri = `${API_BASE_URL}/api/DataSrcs/${dataSrcId}?access_token=${this.token}`;
    const res = await axios.delete(uri);
    return res;
  }
}

export default DataSrcs;
