import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

class DeliveryContainers {
  constructor(token) {
    this.token = token;
  }

  async getDeliveryContainers(filter) {
    let query = `${API_BASE_URL}/api/DeliveryContainers`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async createDeliveryContainer(dc, sortOrder, locationId) {
    const uri = `${API_BASE_URL}/api/DeliveryContainers/replaceOrCreate?access_token=${this.token}`;

    const res = await axios.post(uri, {
      dc,
      sortOrder,
      locationId,
    });
    return res;
  }

  async updateDeliveryContainer(dcId, updates) {
    const uri = `${API_BASE_URL}/api/DeliveryContainers/${dcId}?access_token=${this.token}`;
    const res = await axios.patch(uri, updates);
    return res;
  }

  async deleteDeliveryContainer(dcId) {
    const uri = `${API_BASE_URL}/api/DeliveryContainers/${dcId}?access_token=${this.token}`;
    const res = axios.delete(uri);
    return res;
  }
}

export default DeliveryContainers;
