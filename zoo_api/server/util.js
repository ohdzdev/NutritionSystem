module.exports = {
  createError: (message = 'Server Error', code = 500) => {
    const error = new Error(message);
    error.statusCode = code;
    return error;
  },
};
