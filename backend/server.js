import "dotenv/config";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import { initProd } from "./config/prod.js";
import { initDB } from "./config/db.js";
import { initCORS } from "./config/cors.js";
import { initPassportJS } from "./config/passport.js";
import { initRoutes } from "./routes/index.js";
import { initRateLimit } from "./config/rateLimit.js";

// load config
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 5000;
const app = express();
app.use(morgan("dev"));

initPassportJS();
initCORS(app);
initDB();
initProd(app);
initRateLimit(app);

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use(passport.session());

initRoutes(app);

// Get directory name for the current module
const __dirname = path.resolve();

// If app running in production use static folder else only use api.
// switched to development mode for now.
if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
  // Set the static folder for serving frontend files
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Any undefined route will serve index.html file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.use(morgan("dev"));
  // Basic route for the root URL
  app.get("/", (req, res) => {
    res.send("API running");
  });
}

app.listen(port, () => console.log(`Server running on ${port}`));
