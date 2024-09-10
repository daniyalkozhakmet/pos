import * as express from "express";
import "dotenv/config";
import expressApp from "./express-app";
import { CreateChannel } from "./utils";
import errorHandler from "./utils/errors/index";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();
  const channel = await CreateChannel();
  await expressApp(app, channel);
  errorHandler(app);
  app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
  });
};
StartServer();
