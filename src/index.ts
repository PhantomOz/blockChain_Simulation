import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database";

//initiate application
dotenv.config();
connectDB();
const app = express();
const Port = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(Port, () => {
  console.log(`Server listening on http://localhost:${Port}/`);
});
