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
const settingSchema = new mongoose_1.default.Schema({
    gasfee: {
        type: Number,
        default: 0.02,
    },
    privateKey: {
        type: Number,
        default: 0.02,
    },
});
const settingModel = new mongoose_1.default.Model("setting", settingSchema);
class SettingStore {
    setFees(fees) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const set = yield settingModel.findById(fees._id);
                set.gasfee = fees.gasfee;
                set.privateKey = fees.privateKey;
                set.save();
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const set = yield settingModel.find({});
                return set[0];
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = SettingStore;
