import axios from 'axios';

let API_BASE_URL = process.env.BACKEND_URL;

if (typeof window === 'undefined') {
  API_BASE_URL = `http://localhost:${process.env.PORT}`;
}

class BudgetIds {
  constructor(token) {
    this.token = token;
  }

  async getBudgetCodes(filter) {
    let query = `${API_BASE_URL}/api/BudgetIds/`;
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
