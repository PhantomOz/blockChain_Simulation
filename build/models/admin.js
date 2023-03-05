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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Creating Schema & Model of Admin for DB
const adminSchema = new mongoose_1.default.Schema({
    email: String,
    level: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const AdminModel = mongoose_1.default.model("admin", adminSchema);
//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;
class AdminStore {
    //Creating A new Admin
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForAdmin = yield AdminModel.findOne({ email: user.email });
                if (checkForAdmin) {
                    throw new Error(`409`);
                }
                const hash = yield bcrypt_1.default.hash(user.password + BCRYPTKEY, Number(ROUND));
                const newAdmin = yield AdminModel.create(Object.assign(Object.assign({}, user), { password: hash }));
                newAdmin.save();
                //authenticate admin
                const auth = {
                    id: newAdmin === null || newAdmin === void 0 ? void 0 : newAdmin._id,
                    level: newAdmin === null || newAdmin === void 0 ? void 0 : newAdmin.level,
                    email: newAdmin.email,
                };
                const token = jsonwebtoken_1.default.sign(auth, String(SECRET_KEY));
                return token;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // Logging In Admins (Authentication)
    authenticate(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForAdmin = yield AdminModel.findOne({
                    email: admin.email,
                });
                if (checkForAdmin &&
                    bcrypt_1.default.compare(admin.password, checkForAdmin.password)) {
                    const user = {
                        id: checkForAdmin === null || checkForAdmin === void 0 ? void 0 : checkForAdmin._id,
                        level: checkForAdmin === null || checkForAdmin === void 0 ? void 0 : checkForAdmin.level,
                        email: checkForAdmin === null || checkForAdmin === void 0 ? void 0 : checkForAdmin.email,
                    };
                    const token = jsonwebtoken_1.default.sign(user, String(SECRET_KEY));
                    return token;
                }
                else {
                    throw new Error("404");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = AdminStore;
