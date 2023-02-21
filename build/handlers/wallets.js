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
const wallet_1 = __importDefault(require("../models/wallet"));
const authorization_1 = __importDefault(require("../middleware/authorization"));
const walletStore = new wallet_1.default();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield walletStore.index();
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.create(JSON.parse(req.user).id, req.body.activatedCoins, req.params.type);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const importWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.importWallet(req.body.phrase, req.body.type, JSON.parse(req.user).id);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const addToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.addCoinToWallet(req.body.walletId, req.body.coins);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const getUserWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWallets = yield walletStore.getUserWallets(JSON.parse(req.user).id);
        res.status(200).json(userWallets);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const showWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield walletStore.show(req.params.id);
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const trnxWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.debitWallet(req.body.sender, req.body.coin, req.body.amount);
        yield walletStore.creditWallet(req.body.receiver, req.body.coin, req.body.amount);
        res.status(204).send({ message: "Success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const walletRoutes = (app) => {
    app.get("/", index);
    app.post("/", authorization_1.default, createWallet);
    app.post("/import", authorization_1.default, importWallet);
    app.put("/addtoken", authorization_1.default, addToken);
    app.get("/user", authorization_1.default, getUserWallets);
    app.put("/trxn%20wallet/:type", authorization_1.default, trnxWallet);
    app.get("/:id", authorization_1.default, showWallet);
};
exports.default = walletRoutes;
