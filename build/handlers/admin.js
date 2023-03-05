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
const admin_1 = __importDefault(require("../models/admin"));
const settings_1 = __importDefault(require("../models/settings"));
const settingStore = new settings_1.default();
const store = new admin_1.default();
const createAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield store.create(req.body);
        res.status(201).json(admin);
    }
    catch (e) {
        res.status(409).json({
            message: "User Exist",
        });
    }
});
const loginAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield store.authenticate(req.body);
        res.status(201).json(admin);
    }
    catch (e) {
        res.status(404).json({
            message: "Not Found",
        });
    }
});
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield settingStore.index();
        res.status(200).json(getUser);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const setSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield settingStore.setFees(req.body);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const admin_routes = (app) => {
    app.post("/", createAdmins);
    app.post("/auth", loginAdmins);
    app.get("/settings", getSettings);
    app.put("/settings", setSettings);
};
exports.default = admin_routes;
