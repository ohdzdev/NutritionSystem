import axios from 'axios';

import API_BASE_URL from '../util/ApiURL';

class RoleMappings {
  constructor(token) {
    this.token = token;
  }

  async getRoleMappings(filter) {
    let query = `${API_BASE_URL}/RoleMappings`;
    if (filter) {
      query += `?filter=${JSON.stringify(filter)}&access_token=${this.token}`;
    } else {
      query += `?access_token=${this.token}`;
    }
    const res = await axios.get(query);
    return res;
  }

  async assignRole(userId, roleId) {
    if (roleId >= 0) {
      const url = `${API_BASE_URL}/RoleMappings/upsertWithWhere?where=${JSON.stringify({
        and: [{ principalId: `${userId}` }, { principalType: 'USER' }],
      })}&access_token=${this.token}`;
      const res = await axios.post(url, {
        principalType: 'USER',
        principalId: `${userId}`,
        roleId,
      });
      return res;
    }
    const geturl = `${API_BASE_URL}/RoleMappings/?filter=${JSON.stringify({
      where: { and: [{ principalId: `${userId}` }, { principalType: 'USER' }] },
    })}&access_token=${this.token}`;
    const res = await axios.get(geturl);
    await Promise.all(
      res.data.map((roleMapping) => {
        const deleteUrl = `${API_BASE_URL}/RoleMappings/${roleMapping.id}?access_token=${this.token}`;
        return axios.delete(deleteUrl);
      }),
    );
    return res;
  }
}

export default RoleMappings;
