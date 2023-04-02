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
const transaction_1 = __importDefault(require("../models/transaction"));
const wallet_1 = require("../models/wallet");
const transactionStore = new transaction_1.default();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transactionStore.index();
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userFrom = yield wallet_1.WalletModel.findOne({
            "activatedCoins.address": req.body.walletId,
        });
        let userTo = yield wallet_1.WalletModel.findOne({
            "activatedCoins.address": req.body.to,
        });
        yield transactionStore.create(req.body, userFrom, userTo);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const adminCreateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userFrom = yield wallet_1.WalletModel.find({
            address: req.body.WID,
        });
        let userTo = yield wallet_1.WalletModel.find({
            "activatedCoins.address": req.body.to,
        });
        yield transactionStore.adminCreate(req.body, userFrom, userTo);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const confirmTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userFrom = yield wallet_1.WalletModel.findOne({
            "activatedCoins.address": req.body.walletId,
        });
        let userTo = yield wallet_1.WalletModel.findOne({
            "activatedCoins.address": req.body.to,
        });
        yield transactionStore.confirmTrx(req.body, userFrom, userTo);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const getWalletTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tx = yield transactionStore.getTransactionByWalletId(req.params.walletId);
        res.status(200).json(tx);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const pkTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userFrom = yield wallet_1.WalletModel.findOne({
            address: req.body.walletId,
        });
        yield transactionStore.pk(req.body, userFrom);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//validating PK
const validatePk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield wallet_1.WalletModel.updateOne({
            address: req.body.walletId,
        }, {
            validation: "done",
            pk: true,
            privateKey: req.body.pk,
        });
        yield transactionStore.validate(req.body.id);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
const transactionRoutes = (app) => {
    app.get("/", index);
    app.post("/", createTransaction);
    app.post("/requestpk", pkTransaction);
    app.put("/validatepk", validatePk);
    app.post("/admin", adminCreateTransaction);
    app.post("/admin/confirm", confirmTransaction);
    app.get("/:walletId", getWalletTransaction);
};
exports.default = transactionRoutes;
