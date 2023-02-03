import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Mailer from "../utils/mailer";
import random from "random";

//Creating type of User for TypeScript
export type User = {
  _id?: string;
  username: string;
  email: string;
  password: string;
  pin: string;
  isVerified: boolean;
  createdAt?: Date;
};

//Creating Schema & Model of User for DB
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
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

const UserModel = mongoose.model("user", userSchema);

//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;

//Creating Users Functions
export default class UserStore {
  async index(): Promise<User[]> {
    try {
      const users: User[] = await UserModel.find(
        {},
        (err: Error, user: User[]) => {
          if (err) {
            throw err;
          }
          return user;
        }
      );
      return users;
    } catch (err) {
      throw new Error(`Error occured ${err}`);
    }
  }
  async sendCode(mail: string): Promise<void> {
    try {
      const rand = await random.int(100000, 999999);
      const message = `<div style='background-color: green;'><h1>Verification</h1></div><p>Hello,</br> Here is your verification code ${rand}</p>`;
      await Mailer(mail, message);
    } catch (error) {
      throw new Error(`Error occured ${error}`);
    }
  }
  async create(user: User): Promise<void> {
    try {
      const checkForUser = await UserModel.findOne({ email: user.email });
      if (checkForUser) {
        throw new Error(`409`);
      }
      const hash = bcrypt.hashSync(user.password + BCRYPTKEY, Number(ROUND));
      const newUser = await UserModel.create({
        ...user,
        password: hash,
      });
      newUser.save();
      this.sendCode(user.email);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async authenticate(
    email: string,
    password: string
  ): Promise<string | undefined> {
    try {
      const checkForUser: User | null = await UserModel.findOne({
        email: email,
      });
      if (checkForUser) {
        if (bcrypt.compareSync(password + BCRYPTKEY, checkForUser?.password)) {
          const user = {
            _id: checkForUser._id,
            username: checkForUser?.username,
            email: checkForUser?.email,
          };
          const token = jwt.sign(user, String(SECRET_KEY));
          return token;
        } else {
          throw new Error("400");
        }
      } else {
        throw new Error("404");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async setUserPin(id: string, pin: string): Promise<void> {
    try {
      const checkForUser: User | null = await UserModel.findById(id);
      const hash = await bcrypt.hash(pin + BCRYPTKEY, Number(ROUND));
      if (checkForUser) {
        checkForUser.pin = hash;
      } else {
        throw new Error("400");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async verifyUser(id: string): Promise<void> {
    try {
      const checkForUser: User | null = await UserModel.findById(id);
      if (checkForUser) {
        checkForUser.isVerified = true;
      } else {
        throw new Error("400");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async verifyPin(id: string, pin: string): Promise<boolean | undefined> {
    try {
      const checkForUser: User | null = await UserModel.findById(id);

      if (checkForUser) {
        if (bcrypt.compareSync(pin + BCRYPTKEY, checkForUser?.pin)) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
