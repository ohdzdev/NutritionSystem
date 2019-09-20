const API_BASE_URL =
  typeof window === 'undefined'
    ? `http://localhost:${process.env.PORT}/api`
    : `${process.env.BACKEND_URL}/api`;

export default API_BASE_URL;
