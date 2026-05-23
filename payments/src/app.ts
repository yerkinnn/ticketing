import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@kinnn-org-1/common";
import { newPaymentRouter } from "./routes/new";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// Middlewares
app.use(currentUser);

// Routes
app.use(newPaymentRouter);

// Not found error
app.all("*", async () => {
  throw new NotFoundError();
});

// Error handler
app.use(errorHandler);

export default app;
