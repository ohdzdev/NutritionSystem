import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class BudgetIds {
  constructor(token) {
    this.token = token;
  }

  async getBudgetIds(filter) {
    let query = `${API_BASE_URL}/api/BudgetIds/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a BudgetIds record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async updateBudgetIds(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into patchBudgetIds()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(
        new Error(
          'must have object with some keys that will be updated. If meant to delete use deleteBudgetIds()',
        ),
      );
    }

    const uri = `${API_BASE_URL}/api/BudgetIds/${id}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete a certain Diet record. must send in an id
   * @param {string|number} id required
   */
  async deleteBudgetIds(id) {
    if (!id) {
      return Promise.reject(new Error('must have id to be able to delete'));
    }
    const uri = `${API_BASE_URL}/api/BudgetIds/${id}?access_token=${this.token}`;
    const res = await axios.delete(uri).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * create a new record!
   * @param {JSON} params nonBlank record
   * @param {boolean} createBlank if want a blank record, if params are sent this will be ignored
   */
  async createBudgetIds(params, createBlank) {
    if (!params && !createBlank) {
      return Promise.reject(
        new Error('createBlank was false and no params were sent in, invalid config'),
      );
    }
    const uri = `${API_BASE_URL}/api/BudgetIds/?access_token=${this.token}`;
    if (createBlank && !params) {
      const res = await axios.post(uri).catch((err) => Promise.reject(err));
      return res;
    }
    // if params and createBlank, ignore and send in params
    const res = await axios.post(uri, params).catch((err) => Promise.reject(err));
    return res;
  }
}

export default BudgetIds;
