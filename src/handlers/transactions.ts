import { Request, Response, Router } from "express";
import TransactionStore from "../models/transaction";

const transactionStore = new TransactionStore();

const index = async (req: Request, res: Response) => {
  try {
    const transactions = await transactionStore.index();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json(error);
  }
};

const createTransaction = async (req: Request, res: Response) => {
  try {
    await transactionStore.create(req.body);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const adminCreateTransaction = async (req: Request, res: Response) => {
  try {
    await transactionStore.adminCreate(req.body);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const confirmTransaction = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    await transactionStore.confirmTrx(req.body);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getWalletTransaction = async (req: Request, res: Response) => {
  try {
    const tx = await transactionStore.getTransactionByWalletId(
      req.params.walletId
    );
    res.status(200).json(tx);
  } catch (error) {
    res.status(404).json(error);
  }
};

const transactionRoutes = (app: Router) => {
  app.get("/", index);
  app.post("/", createTransaction);
  app.post("/admin", adminCreateTransaction);
  app.post("/admin/confirm", confirmTransaction);
  app.get("/:walletId", getWalletTransaction);
};

export default transactionRoutes;
