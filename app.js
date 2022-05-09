import "dotenv/config";
import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import expressFileUpload from "express-fileupload";
import routeNotFound from "./middlewares/routeNotFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import authRouter from "./routes/authRoutes.js";

const server = express();
const port = 8000;

server.use("/testing-here", (request, response) => {
  response.send("Zesty");
});

server.use(express.static("./public"));
server.use(express.json());
server.use(expressFileUpload());

server.use("/api/v1/auth", authRouter);
server.use(routeNotFound);
server.use(errorHandlerMiddleware);

const start = async () => {
  try {
    console.log("Connecting to DB");
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected successfully");
    server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (e) {
    console.log("Failed to start server");
    console.log(e);
  }
};

start();
