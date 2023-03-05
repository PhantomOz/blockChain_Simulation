import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/database";
import walletRoutes from "./routes/walletRoutes";
import coinRoutes from "./routes/coinRoute";
import adminRoutes from "./routes/adminRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import userRoutes from "./routes/userRoute";
import bodyParser from "body-parser";
//initiate application
dotenv.config();
connectDB();
const app = express();
const Port = process.env.PORT || 4000;

//Swagger UI definitions
const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Blockchain Simulation API",
      version: "1.0.0",
      description: "An Educational Project to show how the blockchain works.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    schemes: ["http", "https"],
    servers: [
      {
        url: "http://localhost:4000",
      },
      {
        url: "https://blocksimul-backend.onrender.com",
      },
    ],
  },
  apis: [`${__dirname}/routes/*.ts`, "./build/routes/*.js"],
};

const specs = swaggerJsDoc(options);

//middlewares
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
  })
);

//Routes
app.use("/users", userRoutes);
app.use("/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/coins", coinRoutes);
app.use("/admin", adminRoutes);
// app.get("/", function (req: Request, res: Response) {
//   res.send("Hello World!");
// });

//Application Listener
app.listen(Port, () => {
  console.log(`Server listening on http://localhost:${Port}/`);
});
