import * as express from "express";
import "dotenv/config";
import expressApp from "./express-app";
import errorHandler from "./utils/errors/index";
import { CreateChannel } from "./utils";
import { databaseConnection } from "./database";
const StartServer = async () => {
  const app = express();
  await databaseConnection();
  const channel = await CreateChannel();
  await expressApp(app, channel);
  errorHandler(app);
  app.listen(process.env.PORT, () => {
    console.log(`listening to port ${process.env.PORT}`);
  });
};
StartServer();
