"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { SECRET_KEY } = process.env;
//Check if the user is logged In
const isAuthorized = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ")[1];
        const user = jsonwebtoken_1.default.verify(String(token), String(SECRET_KEY));
        req.user = JSON.stringify(user);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Access Denied, Invalid token" });
    }
};
exports.default = isAuthorized;
