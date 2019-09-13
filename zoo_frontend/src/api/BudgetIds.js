import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class BudgetIds {
  constructor(token) {
    this.token = token;
  }

  async getBudgetCodes(filter) {
    let query = `${API_BASE_URL}/BudgetIds/`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }
}

export default BudgetIds;
