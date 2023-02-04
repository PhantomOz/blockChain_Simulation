import { Application, Request, Response } from "express";
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

const transactionRoutes = (app: Application) => {
  app.get("/api/transactions", index);
  app.post("/api/transactions", createTransaction);
  app.get("/api/transactions/:walletId", getWalletTransaction);
};

export default transactionRoutes;
