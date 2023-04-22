import express from "express";
import * as http from "http";
import passport from "passport";
import { authRoute } from "./src/router.js";
import logger from "./src/logger.js";
import { secureRoute } from "./src/secureRouter.js";
import * as expressWinston from "express-winston";
import "./src/mongoose.js";
import {} from "dotenv/config";

const app = express();

app.use(express.json());
// app.use(
//   expressWinston.logger({
//     winstonInstance: logger,
//     statusLevels: true,
//   })
// );

const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use("/api/auth", authRoute);
app.use(
  "/api/auth",
  passport.authenticate("jwt", { session: false }),
  secureRoute
);

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  return res.status(500).send({ error: err.message, code: err.code });
});

server.listen(port, () => {
  console.log("Server is up on Port: " + port);
});
