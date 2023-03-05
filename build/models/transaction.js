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
    walletId: String,
    amount: Number,
    to: String,
    type: String,
    status: String,
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
                const getAllTransaction = yield TransactionModel.find({});
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
                    walletId,
                });
                return getWalletTransaction;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    create(trnx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { status: "pending" }))
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
    adminCreate(trnx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { status: "confirmed" }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { walletId: trnx.to, to: trnx.walletId, type: "credit", status: "confirmed" }))
                        .then((res) => {
                        res.save;
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
                else {
                    yield TransactionModel.create(Object.assign({}, trnx))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                    yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { walletId: trnx.to, to: trnx.walletId, type: "debit" }))
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
    confirmTrx(trnx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getTrnx = yield TransactionModel.findOne({
                    walletId: trnx.walletId,
                });
                getTrnx.status = "confirmed";
                getTrnx.to = trnx.to;
                getTrnx.save();
                yield TransactionModel.create(Object.assign(Object.assign({}, trnx), { walletId: trnx.to, to: trnx.walletId, type: "credit", status: "confirmed" }))
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
}
exports.default = TransactionStore;
