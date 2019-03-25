import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Food {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getNutData(filter) {
    let query = `${API_BASE_URL}/api/NutData/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutritional source
   * @param {String} id nutData record id where we want to find all related nutrtional sources
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getRelatedNutritonSource(id) {
    let query = `${API_BASE_URL}/api/NutData/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/nutDataDataSrc?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab all related food records
   * @param {String} id nutData record id where we want to find all related Foods
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getRelatedFoods(id) {
    let query = `${API_BASE_URL}/api/NutData/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/nutDataFoods?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition source cd
   * @param {String} id nutData record id where we want to find all related source cd
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getRelatedSourceCd(id) {
    let query = `${API_BASE_URL}/api/NutData/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/nutDataSrcCd?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition Data Def
   * @param {String} id nutData record id where we want to find all related Data Defs
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getRelatedNutrDef(id) {
    let query = `${API_BASE_URL}/api/NutData/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/nutDataNutrDef?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a nutData record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async patchNutData(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into patchNutData()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(new Error('must have object with some keys that will be updated'));
    }

    const uri = `${API_BASE_URL}/api/NutData/update?where=${JSON.stringify({ dataId: id })}&access_token=${this.token}`;

    const res = await axios.post(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }
}

export default Food;
