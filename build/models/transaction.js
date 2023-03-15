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
const mongoose_1 = __importDefault(require("mongoose"));
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose_1.default.Schema({
    userFrom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    userTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    walletId: String,
    WID: String,
    amount: Number,
    fee: Number,
    to: String,
    type: String,
    status: { type: String, default: "pending" },
    desc: String,
    code: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
const TransactionModel = mongoose_1.default.model("transaction", TransactionSchema);
//Creating Transaction Object
class TransactionStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllTransaction = yield TransactionModel.find({}).populate(["userFrom", "userTo"]);
                return getAllTransaction;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    getTransactionByWalletId(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWalletTransaction = yield TransactionModel.find({
                    WID: walletId,
                });
                return getWalletTransaction;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    create(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: userFrom.userId, userTo: userTo.userId, WID: userFrom.address, status: "pending" }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    adminCreate(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: userFrom.userId, userTo: userTo.userId, status: "confirmed", WID: userFrom.address }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { walletId: trnx.to, to: trnx.walletId, userFrom: userFrom.userId, userTo: userTo.userId, WID: userTo.address, type: "credit", status: "confirmed" }))
                        .then((res) => {
                        res.save;
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
                else {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { WID: userFrom.address, userFrom: userFrom.userId, userTo: userTo.userId }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { type: "debit", userFrom: userFrom.userId, userTo: userTo.userId, WID: userTo.address }))
                        .then((res) => {
                        res.save;
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    confirmTrx(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TransactionModel.updateOne({ _id: trnx.id }, {
                    status: "confirmed",
                    to: trnx.to,
                    userTo: userTo.userId,
                });
                yield TransactionModel.create({
                    amount: trnx.amount,
                    walletId: trnx.to,
                    to: trnx.walletId,
                    type: "credit",
                    status: "confirmed",
                    createdAt: trnx.createdAt,
                    code: trnx.code,
                    desc: trnx.desc,
                    userFrom: userFrom.userId,
                    userTo: userTo.userId,
                    WID: userTo.address,
                })
                    .then((res) => {
                    res.save;
                })
                    .catch((e) => {
                    throw new Error(e.message);
                });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    pk(trnx, userFrom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { to: "BlockSimulation", status: "pending", userFrom: userFrom.userId, type: "requestpk", WID: userFrom.address }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    validate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield TransactionModel.updateOne({ _id: id }, {
                    status: "confirmed",
                });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = TransactionStore;
