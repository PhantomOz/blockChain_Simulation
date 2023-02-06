import { Request, Response, Router } from "express";
import CoinStore from "../models/coin";

const coinStore = new CoinStore();

const index = async (req: Request, res: Response) => {
  try {
    const coins = await coinStore.index();
    res.status(200).json(coins);
  } catch (error) {
    res.status(404).json(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    await coinStore.create(req.body);
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const coinRoutes = (app: Router) => {
  app.get("/", index);
  app.post("/", create);
};

export default coinRoutes;
