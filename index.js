import express from 'express';
import { MongoClient } from "mongodb";
import chalk from 'chalk';
// import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

const port =process.env.PORT ||5000;

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
const promise = mongoClient.connect();
promise.then(() => {
    db = mongoClient.db(process.env.DATABASE);
  }).catch((e) => {
    console.log(chalk.red.bold("Falha ao conectar no banco"));
  });

app.listen(port, ()=>{
    console.log(chalk.green.bold("Servidor Conectado na porta ",port));
})
