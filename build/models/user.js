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
const mailer_1 = __importDefault(require("../utils/mailer"));
//Creating Schema & Model of User for DB
const userSchema = new mongoose_1.default.Schema({
    username: String,
    email: String,
    pin: { type: String, default: "" },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const UserModel = mongoose_1.default.model("user", userSchema);
//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;
//Creating Users Functions
class UserStore {
    //Getting All Users
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield UserModel.find({});
                return users;
            }
            catch (err) {
                throw new Error(`Error occured ${err}`);
            }
        });
    }
    //Sending Verification Code.
    sendCode(mail, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rand = parseInt(`${Math.random() * (999999 - 100000) + 100000}`);
                const message = `<p style="margin: 2px 0">Hello,</p> <p>Welcome to Krypt Wallet!</p> <p style="margin: 2px 0">Kindly verify your email address </p> <p> Here is your verification code: <strong>${rand}</strong></p><p> The code expires in 10 minutes and can be used only once. Thanks for using Krypt Wallet! <br/><br/> Best Regards <br/>  - ${mail}</p>`;
                const otpMessage = `
          <p>Hello, </p>
          <p>You've requested to login to your wallets <br/> Use this verification code to access your dashboard </p> 
          <p>Here is your verification code: <strong>${rand}</strong> </p> 
          <p>The code expires in 10 minutes and can be used only once. Thanks for using Krypt Wallet!</p> Best Regards <br/><br/>  - ${mail}</p>`;
                if (type === "otp") {
                    yield (0, mailer_1.default)(mail, otpMessage);
                }
                else {
                    yield (0, mailer_1.default)(mail, message);
                }
                return rand;
            }
            catch (error) {
                throw new Error(`Error occured ${error}`);
            }
        });
    }
    //Creating A new User
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield UserModel.findOne({ email: user.email });
                if (checkForUser) {
                    throw new Error(`409`);
                }
                const newUser = yield UserModel.create(Object.assign({}, user));
                newUser.save();
                //authenticate user
                const auth = {
                    id: newUser === null || newUser === void 0 ? void 0 : newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                };
                const token = jsonwebtoken_1.default.sign(auth, String(SECRET_KEY));
                return token;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // Logging In Users (Authentication)
    authenticate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield UserModel.findOne({
                    email: email.toLowerCase(),
                });
                if (checkForUser) {
                    const user = {
                        id: checkForUser._id,
                        username: checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.username,
                        email: checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.email,
                    };
                    const token = jsonwebtoken_1.default.sign(user, String(SECRET_KEY));
                    return Object.assign(Object.assign({}, user), { isVerified: checkForUser.isVerified, token });
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
    //Creating User Transaction Pin
    setUserPin(id, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield UserModel.findById(id);
                const hash = yield bcrypt_1.default.hash(pin + BCRYPTKEY, Number(ROUND));
                if (checkForUser) {
                    checkForUser.pin = hash;
                    checkForUser.save();
                }
                else {
                    throw new Error("400");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Verifing User Email Address
    verifyUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield UserModel.findById(id);
                if (checkForUser) {
                    checkForUser.isVerified = true;
                    checkForUser.save();
                }
                else {
                    throw new Error("400");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Verify User Transaction Pin
    verifyPin(id, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield UserModel.findById(id);
                if (checkForUser) {
                    if (bcrypt_1.default.compareSync(pin + BCRYPTKEY, checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.pin)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = UserStore;
