const prod = process.env.NODE_ENV === 'production';

module.exports = {
  'process.env.BACKEND_URL': prod
    ? 'https://zooapp-qemf447jya-uc.a.run.app'
    : 'http://localhost:8080', // TODO change this back to https
};
