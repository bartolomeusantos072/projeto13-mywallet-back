import {Router} from "express";

import {getUser} from "./../middlewares/userMiddleware.js";

import {getTransactions, addTransaction} from "./../controllers/transactionsController.js";

const transactionRouter = Router();
transactionRouter.use(getUser);

transactionRouter.get("/transactions", getTransactions);
transactionRouter.post("/transactions", addTransaction);

export default transactionRouter;