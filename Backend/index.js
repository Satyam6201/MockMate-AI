import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./router/auth.route.js";
import userRouter from "./router/user.route.js";
import interviewRouter from "./router/interview.router.js";
import paymentRouter from "./router/payment.route.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
    db();
})
