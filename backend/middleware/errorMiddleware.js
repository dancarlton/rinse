export function notFound(req, res, next) {
  // Create a new Error object with a message containing the requested URL
  const error = new Error(`Not Found - ${req.originalUrl}`);

  // Set the response status code to 404 (Not Found)
  res.status(404);

  // Pass the error object to the next middleware
  next(error);
}

export function errorHandler(err, req, res, next) {
  // Determine the status code. Default to 500 if the current status code is 200
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let { message } = err;

  // Check for a Mongoose CastError related to ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found.';
    statusCode = 404;
  }

  // Send the response with the determined status code, error message,
  // and optionally the error stack if not in production
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? 'Pancake Stack' : err.stack,
  });
  next();
}
