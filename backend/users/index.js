import express from "express";
import { userRoutes } from "./src/router.js";
import expressWinston from "express-winston";
import logger from "./logger.js";
import {} from "dotenv/config";
import "./src/mongoose.js";

const app = express();

const port = process.env.PORT || 3002;

// app.use(
//   expressWinston.logger({
//     winstonInstance: logger,
//     statusLevels: true,
//   })
// );

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
