/* eslint-disable import/no-import-module-exports */
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import baseRoutes from "./baseRoutes.js";
import errorHandler from "../middleware/errorMiddleware.js";

export function initRoutes(app) {
  app.use("/api", baseRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/healthcheck", (req, res) => res.send("Router routing OK"));
  app.use(errorHandler);
}
