import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class DietHistory {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getDietHistories(filter) {
    let query = `${API_BASE_URL}/api/DietHistories/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related Diets
   * @param {String} id DietHistories record id where we want to find all related Diets
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getDiets(id) {
    let query = `${API_BASE_URL}/api/DietHistories/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietHistoryDiets?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition Foods
   * @param {String} id DietHistories record id where we want to find all related Foods
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getFoods(id) {
    let query = `${API_BASE_URL}/api/DietHistories/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/getHistoryFoods?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related Units
   * @param {String} id DietHistories record id where we want to find all related Units
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getUnits(id) {
    let query = `${API_BASE_URL}/api/DietHistories/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietHistoryUnits?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a DietHistories record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async updateDietHistories(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into patchDietHistories()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(new Error('must have object with some keys that will be updated. If meant to delete use deleteDietHistories()'));
    }

    const uri = `${API_BASE_URL}/api/DietHistories/${id}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete a certain DietHistory record. must send in an id
   * @param {string|number} id required
   */
  async deleteDietHistories(id) {
    if (!id) {
      return Promise.reject(new Error('must have id to be able to delete'));
    }
    const uri = `${API_BASE_URL}/api/DietHistories/${id}?access_token=${this.token}`;
    const res = await axios.delete(uri).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * create a new record!
   * @param {JSON} params nonBlank record
   * @param {boolean} createBlank if want a blank record, if params are sent this will be ignored
   */
  async createDietHistories(params, createBlank) {
    if (!params && !createBlank) {
      return Promise.reject(new Error('createBlank was false and no params were sent in, invalid config'));
    }
    const uri = `${API_BASE_URL}/api/DietHistories/?access_token=${this.token}`;
    if (createBlank && !params) {
      const res = await axios.post(uri).catch((err) => Promise.reject(err));
      return res;
    }
    // if params and createBlank, ignore and send in params
    const res = await axios.post(uri, params).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete diet History by dietId
   * @param {string|number} dietId required
   */
  async deleteDietHistoryByDietId(dietId) {
    if (!dietId) {
      return Promise.reject(new Error('must have dietId to be able to delete'));
    }
    const uri = `${API_BASE_URL}/api/DietHistories/deleteAllByDietId?access_token=${this.token}`;
    const res = await axios.post(uri, { dietId }).catch((err) => Promise.reject(err));
    return res;
  }
}

export default DietHistory;
