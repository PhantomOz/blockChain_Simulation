import { Request, Response, Router } from "express";
import UserStore from "../models/user";
import isAuthorized from "../middleware/authorization";

const userStore = new UserStore();

const index = async (req: Request, res: Response) => {
  try {
    const getUser = await userStore.index();
    res.status(200).json(getUser);
  } catch (error) {
    res.status(404).json(error);
  }
};

const sendCode = async (req: Request, res: Response) => {
  try {
    const sendCode = await userStore.sendCode(JSON.parse(req.user).email);
    res.status(200).json({ code: sendCode });
  } catch (error) {
    res.status(400).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await userStore.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const token = await userStore.authenticate(
      req.body.email,
      req.body.password
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json(error);
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    await userStore.verifyUser(JSON.parse(req.user).id);
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(404).json(error);
  }
};
const setUserPin = async (req: Request, res: Response) => {
  try {
    await userStore.setUserPin(JSON.parse(req.user).id, req.body.pin);
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(404).json({ error });
  }
};
const verifyPin = async (req: Request, res: Response) => {
  try {
    await userStore.verifyPin(JSON.parse(req.user).id, req.params.pin);
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const user_routes = (app: Router) => {
  app.get("/", index);
  app.get("/send%20verification%20code", isAuthorized, sendCode);
  app.post("/register", create);
  app.post("/login", authenticate);
  app.put("/setpin", isAuthorized, setUserPin);
  app.put("/verify", isAuthorized, verifyUser);
  app.get("/verify%20pin/:pin", isAuthorized, verifyPin);
};

export default user_routes;
