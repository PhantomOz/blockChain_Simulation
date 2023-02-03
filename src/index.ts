import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database";
// import Mailer from "./utils/mailer";

//initiate application
dotenv.config();
// Mailer();
connectDB();
const app = express();
const Port = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(Port, () => {
  console.log(`Server listening on http://localhost:${Port}/`);
});
