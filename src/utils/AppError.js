 

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)          // calls the parent Error class with the message
    this.statusCode = statusCode  // attach the HTTP status code to the error
  }
}

module.exports = AppError