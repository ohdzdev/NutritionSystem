import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class Diet {
  constructor(token) {
    this.token = token;
  }

  /**
   * grab all nutritional records where filter is met
   * @param {JSON} filter json object in format: https://loopback.io/doc/en/lb3/Querying-data.html#using-stringified-json-in-rest-queries
   * @returns {JSON} raw data coming back from request, must use .data to get actual data
   */
  async getDiets(filter) {
    let query = `${API_BASE_URL}/Diets/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related Delivery Containers
   * @param {String} id Diets record id where we want to find all related Delivery Container
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getDietDeliveryContainers(id) {
    let query = `${API_BASE_URL}/Diets/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietDeliveryContainer?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition Food Prep Tables
   * @param {String} id Diets record id where we want to find all related Food Prep Tables
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getFoodPrepTables(id) {
    let query = `${API_BASE_URL}/Diets/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietFoodPrepTable?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related Species
   * @param {String} id Diets record id where we want to find all related Species
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getSpecies(id) {
    let query = `${API_BASE_URL}/Diets/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietSpecies?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

    /**
   * grab related Species
   * @returns {Array<{diet_id: Number, species: String}>} raw data coming back from request, must use .data to get data back
   */
  async getAllDietSpecies() {
    const query = `${API_BASE_URL}/Diets/diet-species?access_token=${this.token}`;
    const res = await axios.get(query);
    return res;
  }

  /**
   * grab related nutrition Subenclosure
   * @param {String} id Diets record id where we want to find all related Subenclosure
   * @returns {JSON} raw data coming back from request, must use .data to get data back
   */
  async getSubenclosure(id) {
    let query = `${API_BASE_URL}/Diets/`;
    if (id && parseInt(id, 10)) {
      query += `${id}/dietSubenclosure?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  /**
   * Update certain values on a Diets record. Must send in an id
   * @param {string|number} id required
   * @param {JSON} updates required
   */
  async updateDiets(id, updates) {
    if (!id) {
      return Promise.reject(new Error('must have id send into patchDiets()'));
    }
    if (Object.keys(updates) === undefined || Object.keys(updates).length < 1) {
      return Promise.reject(
        new Error(
          'must have object with some keys that will be updated. If meant to delete use deleteDiets()',
        ),
      );
    }

    const uri = `${API_BASE_URL}/Diets/${id}?access_token=${this.token}`;

    const res = await axios.patch(uri, updates).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * delete a certain Diet record. must send in an id
   * @param {string|number} id required
   */
  async deleteDiets(id) {
    if (!id) {
      return Promise.reject(new Error('must have id to be able to delete'));
    }
    const uri = `${API_BASE_URL}/Diets/${id}?access_token=${this.token}`;
    const res = await axios.delete(uri).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * create a new record!
   * @param {JSON} params nonBlank record
   * @param {boolean} createBlank if want a blank record, if params are sent this will be ignored
   */
  async createDiets(params, createBlank) {
    if (!params && !createBlank) {
      return Promise.reject(
        new Error('createBlank was false and no params were sent in, invalid config'),
      );
    }
    const uri = `${API_BASE_URL}/Diets/?access_token=${this.token}`;
    if (createBlank && !params) {
      const res = await axios.post(uri).catch((err) => Promise.reject(err));
      return res;
    }
    // if params and createBlank, ignore and send in params
    const res = await axios.post(uri, params).catch((err) => Promise.reject(err));
    return res;
  }

  /**
   * download the diet analysis excel file
   * @param {integer} dietId diet id for analysis
   */
  async downloadDietAnalysis(dietId) {
    const uri = `${API_BASE_URL}/Diets/${dietId}/export-diet-analysis?access_token=${this.token}`;
    // Directing the window location to the file download makes the file download correctly
    // this makes it difficult to know if the call succeeded
    window.location = uri;
  }
  async getAnimalPrep(date) {
    const query = `${API_BASE_URL}/Diets/day-diets?date=${date}&access_token=${this.token}`;
    const res = await axios.get(query);
    return res;
  }
}

export default Diet;
