import * as express from "express";
import "dotenv/config";
import { databaseConnection } from "./database/index";
import expressApp from "./express-app";
import { CreateChannel } from "./utils";
import errorHandler from "./utils/errors/index";
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
