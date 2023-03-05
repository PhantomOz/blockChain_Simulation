"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./utils/database"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const coinRoute_1 = __importDefault(require("./routes/coinRoute"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
//initiate application
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
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
const specs = (0, swagger_jsdoc_1.default)(options);
//middlewares
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: true,
}));
//Routes
app.use("/users", userRoute_1.default);
app.use("/wallet", walletRoutes_1.default);
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/coins", coinRoute_1.default);
app.use("/admin", adminRoutes_1.default);
// app.get("/", function (req: Request, res: Response) {
//   res.send("Hello World!");
// });
//Application Listener
app.listen(Port, () => {
    console.log(`Server listening on http://localhost:${Port}/`);
});
