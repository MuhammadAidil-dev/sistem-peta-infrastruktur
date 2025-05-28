const errorHandler = (err, req, res, next) => {
  console.error('err', {
    name: err.name,
    status: err.statusCode,
    stack: err.stack,
    path: err.path ?? '',
  });

  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
