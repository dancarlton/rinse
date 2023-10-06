import "dotenv/config";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import winston from "winston";
import { initConfig } from "./config/config.js";
import { initRoutes } from "./routes/index.js";
import errorHandler from "./middleware/errorMiddleware.js";

// load config
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 5000;
const app = express();

initConfig(app);

// Create express session
app.use(
  session({
    // Used to compute a hash
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
    // Store session on DB
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/test",
    }),
  })
);

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(morgan("dev"));

app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.use(passport.session());

initRoutes(app);

// Get directory name for the current module
const __dirname = path.resolve();

// If app running in production use static folder else only use api.
// switched to development mode for now.
if (process.env.NODE_ENV === "production") {
  // Set the static folder for serving frontend files
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Any undefined route will serve index.html file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  // Basic route for the root URL
  app.get("/", (req, res) => {
    res.send("API running");
  });
}

// Middleware for handling errors
app.use(errorHandler);

app.listen(port, () => winston.info(`Server running on ${port}`));
