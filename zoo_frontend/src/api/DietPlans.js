import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class DietPlan {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getDietPlans(filter) {
    let query = `${API_BASE_URL}/DietPlans/`;
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
   * @param {String} id DietPlans record id where we want to find all related Diets
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getDiets(id) {
    let query = `${API_BASE_URL}/DietPlans/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietPlanDiets?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition Foods
   * @param {String} id DietPlans record id where we want to find all related Foods
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getFoods(id) {
    let query = `${API_BASE_URL}/DietPlans/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietPlanFoods?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related Unit
   * @param {String} id DietPlans record id where we want to find all related Unit
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getUnits(id) {
    let query = `${API_BASE_URL}/DietPlans/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietPlanUnits?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a DietPlans record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async updateDietPlans(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into patchDietPlans()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(
        new Error(
          'must have object with some keys that will be updated. If meant to delete use deleteDietPlans()',
        ),
      );
    }

    const uri = `${API_BASE_URL}/DietPlans/${id}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete a certain DietPlan record. must send in an id
   * @param {string|number} id required
   */
  async deleteDietPlans(id) {
    if (!id) {
      return Promise.reject(new Error('must have id to be able to delete'));
    }
    const uri = `${API_BASE_URL}/DietPlans/${id}?access_token=${this.token}`;
    const res = await axios.delete(uri).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * create a new record!
   * @param {JSON} params nonBlank record
   * @param {boolean} createBlank if want a blank record, if params are sent this will be ignored
   */
  async createDietPlans(params, createBlank) {
    if (!params && !createBlank) {
      return Promise.reject(
        new Error('createBlank was false and no params were sent in, invalid config'),
      );
    }
    const uri = `${API_BASE_URL}/DietPlans/?access_token=${this.token}`;
    if (createBlank && !params) {
      const res = await axios.post(uri).catch((err) => Promise.reject(err));
      return res;
    }
    // if params and createBlank, ignore and send in params
    const res = await axios.post(uri, params).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete diet plans by diet id
   * @param {string|number} dietId required
   */
  async deleteDietPlanByDietId(dietId) {
    if (!dietId) {
      return Promise.reject(new Error('must have dietId to be able to delete'));
    }
    const uri = `${API_BASE_URL}/DietPlans/deleteAllByDietId?access_token=${this.token}`;
    const res = await axios.post(uri, { dietId }).catch((err) => Promise.reject(err));
    return res;
  }
}

export default DietPlan;
