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
exports.WalletModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const genAddress_1 = __importDefault(require("../utils/genAddress"));
//Creating Wallet Schema & Model for DB
const walletSchema = new mongoose_1.default.Schema({
    userId: String,
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        default: function () {
            const _t = this; // tslint:disable-line
            return _t.userId;
        },
    },
    privateKey: String,
    pubKey: String,
    address: String,
    phrase: String,
    type: String,
    activatedCoins: Array,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    activationBalance: {
        type: Number,
        default: 0,
    },
    pk: {
        type: Boolean,
        default: false,
    },
    validation: {
        type: String,
        default: "false",
    },
    pkValue: {
        type: Number,
        default: function () {
            return 0;
        },
    },
});
exports.WalletModel = mongoose_1.default.model("wallet", walletSchema);
//Creating Wallet Object
class WalletStore {
    //Get All Wallet
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllWallet = yield exports.WalletModel.find({}).populate("user");
                return getAllWallet;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Get a Wallet By Id
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWallet = yield exports.WalletModel.findById(id);
                if (getWallet) {
                    return getWallet;
                }
                else {
                    throw new Error(`Wallet not found 404`);
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Create Wallet for a User
    create(userId, activatedCoins, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield (0, genAddress_1.default)();
                const rand = parseInt(`${Math.random() * (9999999 - 1000000) + 1000000}`);
                // activatedCoins.forEach(async (ac) => {
                //   const phrase = address?.mnemonic.split(" ");
                //   const coinAddress = await generateAddress(phrase, ac?.code);
                //   ac.address = coinAddress.address;
                // });
                const newWallet = yield exports.WalletModel.create({
                    activatedCoins,
                    userId,
                    type,
                    phrase: address.mnemonic,
                    privateKey: address.privKey,
                    address: `#${rand}`,
                    pubKey: address.pubKey,
                    user: userId,
                });
                newWallet.save();
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Importing Wallet
    importWallet(phrase, type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield exports.WalletModel.findOne({ phrase: phrase.join(" ") });
                if (wallet) {
                    wallet.userId = userId;
                    wallet.save();
                }
                else {
                    const activatedCoins = [
                        {
                            _id: "63e76100da1821d053c21432",
                            coinName: "Bitcoin",
                            address: "bc1qzq0a3z4293z40af6hea00vyall2a646z427jak",
                            code: "BTC",
                            img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
                            amount: 0,
                            __v: 0,
                        },
                    ];
                    const address = yield (0, genAddress_1.default)(phrase);
                    // activatedCoins.forEach(async (ac) => {
                    //   const coinAddress = await generateAddress(phrase, ac?.code);
                    //   ac.address = coinAddress.address;
                    // });
                    const newWallet = yield exports.WalletModel.create({
                        activatedCoins,
                        userId,
                        type,
                        phrase: address.mnemonic,
                        privateKey: address.privKey,
                        address: address.address,
                        pubKey: address.pubKey,
                        user: userId,
                    });
                    newWallet.save();
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Add ActivatedCoins
    addCoinToWallet(walletId, coins) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Wallet = yield exports.WalletModel.findById(walletId);
                // coins.forEach(async (ac) => {
                //   const coinAddress = await generateAddress(null, ac?.code);
                //   ac.address = coinAddress.address;
                // });
                if (Wallet) {
                    Wallet.activatedCoins = [...Wallet.activatedCoins, ...coins];
                }
                Wallet.save();
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Get All Wallets of a User
    getUserWallets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            try {
                const getWallets = yield exports.WalletModel.find({
                    userId: userId,
                });
                return getWallets;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Credit Transaction
    creditWallet(address, crypto, amount, type, WID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWallet = WID
                    ? yield exports.WalletModel.findOne({
                        address: WID,
                    })
                    : yield exports.WalletModel.findOne({
                        "activatedCoins.address": address,
                    });
                if (getWallet) {
                    const Coin = yield getWallet.activatedCoins.find((coin) => coin.code === crypto && coin.address === address);
                    if (Coin) {
                        Coin.amount = Number(amount) + Number(Coin.amount);
                    }
                    if (WID && type === "credit") {
                        yield exports.WalletModel.updateOne({ address: WID }, {
                            activatedCoins: getWallet.activatedCoins,
                        });
                    }
                    else {
                        yield exports.WalletModel.updateOne({ "activatedCoins.address": address }, {
                            activatedCoins: getWallet.activatedCoins,
                        });
                    }
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Debit Transaction
    debitWallet(walletId, crypto, amount, fee, type, WID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWallet = WID
                    ? yield exports.WalletModel.findOne({
                        address: WID,
                    })
                    : yield exports.WalletModel.findOne({
                        "activatedCoins.address": walletId,
                    });
                if (getWallet) {
                    const Coin = yield getWallet.activatedCoins.find((coin) => coin.code === crypto);
                    // const Btc = await getWallet.activatedCoins.find(
                    //   (coin) => coin.code === "BTC"
                    // );
                    if (Coin) {
                        Coin.amount -= amount;
                        Coin.amount -= fee;
                    }
                    if (WID && type === "debit") {
                        yield exports.WalletModel.updateOne({ address: WID }, {
                            activatedCoins: getWallet.activatedCoins,
                        });
                    }
                    else {
                        yield exports.WalletModel.updateOne({ "activatedCoins.address": walletId }, {
                            activatedCoins: getWallet.activatedCoins,
                        });
                    }
                }
                else {
                    return;
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Edit Balance
    EditBalance(wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let getWallet = yield exports.WalletModel.findById(wallet._id);
                getWallet.activatedCoins = wallet.activatedCoins;
                getWallet.activationBalance = wallet.activationBalance;
                getWallet.save();
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //pk
    PkWallet(walletId, crypto, amount, fee, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWallet = yield exports.WalletModel.findOne({ address: walletId });
                if (getWallet) {
                    // const Coin = await getWallet.activatedCoins.find(
                    //   (coin) => coin.code === crypto
                    // );
                    // const Btc = await getWallet.activatedCoins.find(
                    //   (coin) => coin.code === "BTC"
                    // );
                    // Coin.amount -= amount;
                    // Btc.amount -= fee;
                    if (admin) {
                        yield exports.WalletModel.updateOne({ address: walletId }, {
                            pkValue: fee,
                        });
                    }
                    else {
                        yield exports.WalletModel.updateOne({ address: walletId }, {
                            activatedCoins: getWallet.activatedCoins,
                            validation: "processing",
                        });
                    }
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = WalletStore;
