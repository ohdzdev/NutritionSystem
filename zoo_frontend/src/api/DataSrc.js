import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class DataSrc {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getSources(filter) {
    let query = `${API_BASE_URL}/DataSrcs/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async getDataSrc(filter) {
    let query = `${API_BASE_URL}/DataSrcs`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createDataSrc(newData) {
    const uri = `${API_BASE_URL}/DataSrcs/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, newData);
    return res;
  }

  async updateDataSrc(dataSrcId, updates) {
    const uri = `${API_BASE_URL}/DataSrcs/${dataSrcId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async deleteDataSrc(dataSrcId) {
    const uri = `${API_BASE_URL}/DataSrcs/${dataSrcId}?access_token=${this.token}`;
    const res = await axios.delete(uri);
    return res;
  }
}

export default DataSrc;
