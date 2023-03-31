import express, { json } from "express";
import { logger as _logger } from "express-winston";
import messageRouter from "./messageRouter.js";
import chatRouter from "./chatRouter.js";
import logger from "./logger.js";
import {} from "dotenv/config";
import "./mongoose.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  _logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);

app.use(json());

app.use("/api/chat/message", messageRouter);
app.use("/api/chat/rooms", chatRouter);

app.listen(port, () => {
  console.log(`Server started on Port ${port}`);
});
