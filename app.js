import "dotenv/config";
import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import expressFileUpload from "express-fileupload";
import routeNotFound from "./middlewares/routeNotFoundMiddleware.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import BookModel from "./models/Book.js";

const server = express();
const port = 8000;

server.use(express.static("./public"));
server.use(express.json());
server.use(expressFileUpload());

server.post("/testing-here", async (request, response) => {
  const book = await BookModel.findOne({
    "author._id": "628107e940956dcec9ff98d2",
  });
  console.log("--- review", book.reviews);
  // book.reviews = book.reviews.filter((review) => review.text !== "Nice");
  // book.reviews.push({ user: "627fadd4ee505827096d52f5", text: "Wow" });
  await book.save();
  response.json({ book });
});

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
