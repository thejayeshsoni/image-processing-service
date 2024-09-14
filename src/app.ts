import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import router from "./router/apiRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";
import responseMessage from "./constant/responseMessage";
import httpError from "./utils/httpError";
import helmet from "helmet";
import cors from "cors";

const app: Application = express();

// middlewares
app.use(helmet());
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cors({
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "HEAD"],
    origin: ["https:client.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../", "public")));

// routes
app.use("/api/v1", router);

// 404 error hanlder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error(responseMessage.NOT_FOUND("Route"));
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

app.use(globalErrorHandler);

export default app;
