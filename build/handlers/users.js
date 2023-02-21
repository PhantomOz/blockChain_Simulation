"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const authorization_1 = __importDefault(require("../middleware/authorization"));
const userStore = new user_1.default();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield userStore.index();
        res.status(200).json(getUser);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const sendCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sendCode = yield userStore.sendCode(req.body.email);
        res.status(200).json({ code: sendCode });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userStore.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(409).json(error);
    }
});
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield userStore.authenticate(req.body.email);
        res.status(201).json({ token });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userStore.verifyUser(JSON.parse(req.user).id);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const setUserPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userStore.setUserPin(JSON.parse(req.user).id, req.body.pin);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        res.status(404).json({ error });
    }
});
const verifyPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userStore.verifyPin(JSON.parse(req.user).id, req.params.pin);
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const user_routes = (app) => {
    app.get("/", index);
    app.post("/send%20verification%20code", sendCode);
    app.post("/register", create);
    app.post("/login", authenticate);
    app.put("/setpin", authorization_1.default, setUserPin);
    app.put("/verify", authorization_1.default, verifyUser);
    app.get("/verify%20pin/:pin", authorization_1.default, verifyPin);
};
exports.default = user_routes;
