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
const random_words_1 = __importDefault(require("random-words"));
const hdaddressgenerator_1 = __importDefault(require("hdaddressgenerator"));
const generateAddress = () => __awaiter(void 0, void 0, void 0, function* () {
    const phrases = yield (0, random_words_1.default)({ exactly: 12 });
    const mnemonic = phrases.join(" ");
    const bip44 = yield hdaddressgenerator_1.default.withMnemonic(mnemonic, false, "BTC");
    const address = yield bip44.generate(1);
    return {
        privKey: address[0].privKey,
        pubKey: address[0].pubKey,
        address: address[0].address,
        mnemonic,
    };
});
exports.default = generateAddress;
