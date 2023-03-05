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
//get all wallets
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield walletStore.index();
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
//Create a new wallet
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.create(JSON.parse(req.user).id, req.body.activatedCoins, req.params.type);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//Create/importing Wallet from backup phrase
const importWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.importWallet(req.body.phrase, req.body.type, JSON.parse(req.user).id);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//add a coin to activated coins
const addToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.addCoinToWallet(req.body.walletId, req.body.coins);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//get a particular user wallet
const getUserWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userWallets = yield walletStore.getUserWallets(JSON.parse(req.user).id);
        res.status(200).json(userWallets);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
//get a particular wallet
const showWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallet = yield walletStore.show(req.params.id);
        res.status(200).json(wallet);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
//perform a transaction on wallet
const trnxWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.debitWallet(req.body.sender, req.body.coin, req.body.amount, req.body.fee);
        res.status(204).json({ message: "Success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
// admin performs a transaction on wallet
const adminTrnxWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.debitWallet(req.body.sender, req.body.coin, req.body.amount, req.body.fee);
        yield walletStore.creditWallet(req.body.receiver, req.body.coin, req.body.amount);
        res.status(204).json({ message: "Success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//Admin perform Edit balance
const EditWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.EditBalance(req.body);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//Admin perform credit
const credTrnxWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield walletStore.creditWallet(req.body.receiver, req.body.coin, req.body.amount);
        res.status(204).json({ message: "Success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//Wallet Routes
const walletRoutes = (app) => {
    app.get("/", index);
    app.post("/", authorization_1.default, createWallet);
    app.post("/import", authorization_1.default, importWallet);
    app.put("/addtoken", authorization_1.default, addToken);
    app.put("/edit", EditWallet);
    app.get("/user", authorization_1.default, getUserWallets);
    app.put("/trxn%20wallet/:type", authorization_1.default, trnxWallet);
    app.put("/admin/trxn", adminTrnxWallet);
    app.put("/admin/trxn/cred", credTrnxWallet);
    app.get("/:id", authorization_1.default, showWallet);
};
exports.default = walletRoutes;
