import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
const promise = mongoClient.connect();
promise
.then(() => {
    db = mongoClient.db(process.env.DATABASE);
  })
  .catch((e) => {
    console.log(chalk.red.bold("Falha ao conectar no banco"));
  });

export default db;