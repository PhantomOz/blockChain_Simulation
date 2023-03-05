import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Mailer from "../utils/mailer";

//Creating type of Admin for TypeScript
export type Admin = {
  _id?: string;
  level: string;
  email: string;
  password: string;
  createdAt?: Date;
};

//Creating Schema & Model of Admin for DB
const adminSchema = new mongoose.Schema({
  email: String,
  level: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const AdminModel = mongoose.model("user", adminSchema);

//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;

export default class AdminStore {
  //Creating A new Admin
  async create(user: Admin): Promise<string> {
    try {
      const checkForAdmin = await AdminModel.findOne({ email: user.email });
      if (checkForAdmin) {
        throw new Error(`409`);
      }
      const hash = await bcrypt.hash(user.password + BCRYPTKEY, Number(ROUND));
      const newAdmin = await AdminModel.create({
        ...user,
        password: hash,
      });
      newAdmin.save();
      //authenticate admin
      const auth = {
        id: newAdmin?._id,
        level: newAdmin?.level,
        email: newAdmin.email,
      };
      const token = jwt.sign(auth, String(SECRET_KEY));
      return token;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Logging In Admins (Authentication)
  async authenticate(admin: Admin): Promise<string | undefined> {
    try {
      const checkForAdmin: Admin | null = await AdminModel.findOne({
        email: admin.email,
      });
      if (
        checkForAdmin &&
        bcrypt.compare(admin.password, checkForAdmin.password)
      ) {
        const user = {
          id: checkForAdmin?._id,
          level: checkForAdmin?.level,
          email: checkForAdmin?.email,
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
}
