import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/module/auth/auth.router.js";
import userRouter from "./src/module/user/user.router.js";
import companyRouter from "./src/module/company/company.router.js";
import jobRouter from "./src/module/job/job.router.js";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
connectDB();
app.use(cors());

// &Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.use("*", (req, res, next) => {
  return next(new Error("Page Not Found", { cause: 404 }));
});

// &Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    message: false,
    error: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
