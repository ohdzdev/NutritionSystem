const prod = process.env.NODE_ENV === 'production';

const port = process.env.PORT || 8080;

module.exports = {
  'process.env.BACKEND_URL': prod
    ? 'https://zooapp-qemf447jya-uc.a.run.app'
    : `http://localhost:${port}`,
};
