import winston from "winston";
import "express-async-errors";
// To Log on MongoDB database use:
// import "winston-mongodb";

export function initLogger() {
  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // Local file
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.Console());

  // Log on the MongoDB database
  // Uncomment the following lines and set up your MongoDB URI
  //   winston.add(new winston.transports.MongoDB({
  //     db: process.env.MONGO_URI,
  //     level: "info",
  //   }));
}
