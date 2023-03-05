import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Mailer from "../utils/mailer";

//Creating type of User for TypeScript
export type User = {
  _id?: string;
  username: string;
  email: string;
  pin: string;
  isVerified: boolean;
  createdAt?: Date;
};

//Creating Schema & Model of User for DB
const userSchema = new mongoose.Schema({
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

const UserModel = mongoose.model("user", userSchema);

//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;

//Creating Users Functions
export default class UserStore {
  //Getting All Users
  async index(): Promise<User[]> {
    try {
      const users: User[] = await UserModel.find({});
      return users;
    } catch (err) {
      throw new Error(`Error occured ${err}`);
    }
  }

  //Sending Verification Code.
  async sendCode(mail: string): Promise<number> {
    try {
      const rand = parseInt(`${Math.random() * (999999 - 100000) + 100000}`);
      const message = `<div style='background-color: white;'><img style='background-color: white;' src='https://res.cloudinary.com/weird-d/image/upload/v1676296954/cover_sakqo1.png' height=150px width=100% alt='logo'/></div><p>Hello,</br> Here is your verification code: <strong>${rand}</strong></p>`;
      await Mailer(mail, message);
      return rand;
    } catch (error) {
      throw new Error(`Error occured ${error}`);
    }
  }

  //Creating A new User
  async create(user: User): Promise<string> {
    try {
      const checkForUser = await UserModel.findOne({ email: user.email });
      if (checkForUser) {
        throw new Error(`409`);
      }

      const newUser = await UserModel.create({
        ...user,
      });
      newUser.save();
      //authenticate user
      const auth = {
        id: newUser?._id,
        username: newUser.username,
        email: newUser.email,
      };
      const token = jwt.sign(auth, String(SECRET_KEY));
      return token;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Logging In Users (Authentication)
  async authenticate(email: string): Promise<string | undefined> {
    try {
      const checkForUser: User | null = await UserModel.findOne({
        email: email,
      });
      if (checkForUser) {
        const user = {
          id: checkForUser._id,
          username: checkForUser?.username,
          email: checkForUser?.email,
        };

        const token = jwt.sign(user, String(SECRET_KEY));
        return token;
      } else {
        throw new Error("404");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Creating User Transaction Pin
  async setUserPin(id: string, pin: string): Promise<void> {
    try {
      const checkForUser = await UserModel.findById(id);
      const hash = await bcrypt.hash(pin + BCRYPTKEY, Number(ROUND));
      if (checkForUser) {
        checkForUser.pin = hash;
        checkForUser.save();
      } else {
        throw new Error("400");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Verifing User Email Address
  async verifyUser(id: string): Promise<void> {
    try {
      const checkForUser = await UserModel.findById(id);
      if (checkForUser) {
        checkForUser.isVerified = true;
        checkForUser.save();
      } else {
        throw new Error("400");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  //Verify User Transaction Pin
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
