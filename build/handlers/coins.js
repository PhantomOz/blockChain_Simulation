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
const coin_1 = __importDefault(require("../models/coin"));
const coinStore = new coin_1.default();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coins = yield coinStore.index();
        res.status(200).json(coins);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield coinStore.create(req.body);
        res.status(201).json({ message: "Success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const coinRoutes = (app) => {
    app.get("/coins", index);
    app.post("/coins", create);
};
exports.default = coinRoutes;
