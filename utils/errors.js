const ErrorBad = 400;
class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
const ErrorForbidden = 403;
const ErrorNot = 404;
const ErrorConflict = 409;
const ErrorServer = 500;

module.exports = {
  ErrorBad,
  ErrorUnauthorized,
  ErrorForbidden,
  ErrorNot,
  ErrorConflict,
  ErrorServer,
};
