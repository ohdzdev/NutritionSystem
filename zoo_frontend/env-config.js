const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'process.env.BACKEND_URL': prod ? process.env.PROD_API_URL : 'http://localhost:8080', // TODO change this back to https
};
