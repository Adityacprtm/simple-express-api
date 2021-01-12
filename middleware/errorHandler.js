const process = require("process");

function errorHandler(err, req, res) {
  if (process.env.PRODUCTION === false) {
    res.status(res.statusCode || 500).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(res.statusCode || 500).json({
      message: err.message,
    });
  }
}

module.exports = errorHandler;
