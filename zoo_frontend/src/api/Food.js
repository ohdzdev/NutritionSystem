import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class Food {
  constructor(token) {
    this.token = token;
  }

  async getFood(filter) {
    let query = `${API_BASE_URL}/Food`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async getRelatedCategory(foodId) {
    let query = `${API_BASE_URL}/Food/`;
    if (foodId && parseInt(foodId, 10)) {
      query += `${foodId}/foodFoodCategory?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async getRelatedBudgetCode(foodId) {
    let query = `${API_BASE_URL}/Food/`;
    if (foodId && parseInt(foodId, 10)) {
      query += `${foodId}/foodBudgetId?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a nutData record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async updateFood(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into updateFood()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(
        new Error(
          'must have object with some keys that will be updated. If meant to delete use deleteFood()',
        ),
      );
    }

    const uri = `${API_BASE_URL}/Food/${id}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete a certain nut data record. must send in an id
   * @param {string|number} id required
   */
  async deleteFood(id) {
    if (!id) {
      return Promise.reject(new Error('must have id to be able to delete'));
    }
    const uri = `${API_BASE_URL}/Food/${id}?access_token=${this.token}`;
    const res = await axios.delete(uri).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * create a new record!
   * @param {JSON} params nonBlank record
   * @param {boolean} createBlank if want a blank record, if params are sent this will be ignored
   */
  async createFood(params, createBlank) {
    if (!params && !createBlank) {
      return Promise.reject(
        new Error('createBlank was false and no params were sent in, invalid config'),
      );
    }
    const uri = `${API_BASE_URL}/Food/?access_token=${this.token}`;
    if (createBlank && !params) {
      const res = await axios.post(uri).catch((err) => Promise.reject(err));
      return res;
    }
    // if params and createBlank, ignore and send in params
    const res = await axios.post(uri, params).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * Get the prep sheets data for the kitchen
   * @param {string} date date string in the format YYYY-MM-DD
   * @return {array} data returned from the api call
   */
  async getPrepDaySheets(date) {
    const uri = `${API_BASE_URL}/Food/day-prep-sheet-data?date=${date}&access_token=${this.token}`;

    const res = await axios.get(uri);

    return res;
  }

  /**
   * Get the food cost report
   * @return {array} data returned from the api call
   */
  async getFoodCostReport() {
    const uri = `${API_BASE_URL}/Food/feeding-cost-report?access_token=${this.token}`;

    const res = await axios.get(uri);

    return res;
  }

  /**
   * Get the food cost report grouped by budget code
   * @return {array} data returned from the api call
   */
  async getFoodCostReportByGL() {
    const uri = `${API_BASE_URL}/Food/feeding-cost-report-by-gl?access_token=${this.token}`;

    const res = await axios.get(uri);

    return res;
  }

    /**
   * Get the food cost report grouped by budget code
   * @param {Number} dietId dietid to filter by, can be null
   * @return {array} data returned from the api call
   */
  async getDietCostReport(dietId) {
    let uri = '';
    if(dietId) {
      uri = `${API_BASE_URL}/Food/diet-cost-report?access_token=${this.token}&dietId=${dietId}`;
    } else {
      uri = `${API_BASE_URL}/Food/diet-cost-report?access_token=${this.token}`;
    }
    

    const res = await axios.get(uri);

    return res;
  }
}

export default Food;
