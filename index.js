import express, {json} from "express";
import cors from "cors";

import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import transactionRouter from "./routes/transactionsRouter.js";

const app = express();
app.use(json());
app.use(cors());

dotenv.config();

// routes
app.use(authRouter);
app.use(transactionRouter);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});