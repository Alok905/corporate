import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/conn.js";
import employeeRouter from "./routes/employeeRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectToDB();
const app = express();

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/employee", employeeRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
