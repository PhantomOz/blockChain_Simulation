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
//Creating Schema and Model For DB
const coinSchema = new mongoose_1.default.Schema({
    coinName: String,
    code: String,
    img: String,
    amount: Number,
});
const CoinModel = mongoose_1.default.model("coin", coinSchema);
//Creating Coin Object
class CoinStore {
    //Getting All Coins
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCoins = yield CoinModel.find({});
                return getAllCoins;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Creating Coin
    create(coin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCoin = yield CoinModel.create(Object.assign({}, coin));
                newCoin.save();
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = CoinStore;
