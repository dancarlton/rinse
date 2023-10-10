import winston from "winston";

export default function errorHandler(err, req, res, next) {
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  res.status(500).send("Something failed. Check the logs by Winston");
  // next(err);
}
