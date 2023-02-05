"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./utils/database"));
const users_1 = __importDefault(require("./handlers/users"));
const wallets_1 = __importDefault(require("./handlers/wallets"));
const coins_1 = __importDefault(require("./handlers/coins"));
const transactions_1 = __importDefault(require("./handlers/transactions"));
const genAddress_1 = __importDefault(require("./utils/genAddress"));
//initiate application
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
const Port = process.env.PORT || 8080;
(0, genAddress_1.default)();
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//Routes
app.get("/", function (req, res) {
    res.send("Hello World!");
});
(0, users_1.default)(app);
(0, wallets_1.default)(app);
(0, coins_1.default)(app);
(0, transactions_1.default)(app);
//Application Listener
app.listen(Port, () => {
    console.log(`Server listening on http://localhost:${Port}/`);
});
