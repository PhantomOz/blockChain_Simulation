import AdminStore from "../models/admin";
import { Request, Response, Router } from "express";
import SettingStore from "../models/settings";

const settingStore = new SettingStore();
const store = new AdminStore();

const createAdmins = async (req: Request, res: Response) => {
  try {
    const admin = await store.create(req.body);
    res.status(201).json(admin);
  } catch (e) {
    res.status(409).json({
      message: "User Exist",
    });
  }
};

const loginAdmins = async (req: Request, res: Response) => {
  try {
    const admin = await store.authenticate(req.body);
    res.status(201).json(admin);
  } catch (e) {
    res.status(404).json({
      message: "Not Found",
    });
  }
};

const getSettings = async (req: Request, res: Response) => {
  try {
    const getUser = await settingStore.index();
    res.status(200).json(getUser);
  } catch (error) {
    res.status(404).json(error);
  }
};
const setSettings = async (req: Request, res: Response) => {
  try {
    await settingStore.setFees(req.body);
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const admin_routes = (app: Router) => {
  app.post("/", createAdmins);
  app.post("/auth", loginAdmins);
  app.get("/settings", getSettings);
  app.put("/settings", setSettings);
};

export default admin_routes;
