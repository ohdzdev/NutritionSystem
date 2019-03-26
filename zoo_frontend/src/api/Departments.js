import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class Departments {
  constructor(token) {
    this.token = token;
  }

  async getDepartments(filter) {
    let query = `${API_BASE_URL}/api/Locations`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createDepartment(location, color, shortName) {
    const uri = `${API_BASE_URL}/api/Locations/replaceOrCreate?access_token=${this.token}`;
    const res = await axios.post(uri, {
      location,
      color,
      shortLocation: shortName,
    });
    return res;
  }

  async updateDepartment(locationId, updates) {
    const uri = `${API_BASE_URL}/api/Locations/${locationId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async deleteDepartment(locationId) {
    const uri = `${API_BASE_URL}/api/Locations/${locationId}?access_token=${this.token}`;
    const res = await axios.delete(uri);
    return res;
  }
}

export default Departments;
