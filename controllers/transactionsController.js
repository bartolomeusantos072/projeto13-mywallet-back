import dayjs from "dayjs";

import db from "../dbStrategy/DbMongo.js";
import dotenv from 'dotenv';
dotenv.config();

import transactionSchema from "../schemas/transactionSchema.js";

export async function getTransactions(req, res) {
 
  const {user} = res.locals;
  try {
    const transactions = await db.collection("transactions").find({userId: user._id}).toArray();
    res.send(transactions);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function addTransaction(req, res) {
  const { error } = transactionSchema.validate(req.body);
  if(error) return res.status(422).send(error.details.map(detail => detail.message));

  const {user} = res.locals;
  try {
    const { type, description, value } = req.body;
    await db.collection("transactions").insertOne({
      type,
      value,
      description,
      date: dayjs().format('DD/MM'),
      userId: user._id
    });
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
