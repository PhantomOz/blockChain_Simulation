import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database";
import user_routes from "./handlers/users";

//initiate application
dotenv.config();
connectDB();
const app = express();
const Port = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});
// user_routes(app);

//Application Listener
app.listen(Port, () => {
  console.log(`Server listening on http://localhost:${Port}/`);
});
