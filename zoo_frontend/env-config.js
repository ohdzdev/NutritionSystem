const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'process.env.BACKEND_URL': prod ? 'http://172.245.90.230:8080' : 'http://localhost:3333', // TODO change this back to https
};
