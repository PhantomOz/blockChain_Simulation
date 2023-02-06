import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

//Extend The Request Params to have user
declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}
const { SECRET_KEY } = process.env;
//Check if the user is logged In
const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")[1];
    const user = jwt.verify(String(token), String(SECRET_KEY));

    req.user = JSON.stringify(user);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Access Denied, Invalid token" });
  }
};

export default isAuthorized;
