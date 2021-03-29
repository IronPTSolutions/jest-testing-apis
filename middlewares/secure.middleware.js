const createError = require('http-errors');

module.exports.isAuthenticated = (req, res, next) => {
  next()
};
