import express from "express";
import { MongoClient } from "mongodb";
import chalk from "chalk";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import cors from "cors";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

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

app.post("/sign-up", async (req, res) => {
    const user = req.body;
    const { name, email, password, password_confirmation }=user;
  
    const passwordHash = bcrypt.hashSync(user.password, 10);
    
    const userSchema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(15).required(),
      password_confirmation: Joi.any()
        .valid(Joi.ref("password"))
        .required()
    });
    
    const { error } = userSchema.validate(user);
    if(error){
      return res.status(422).send(error.details.map(detail => detail.message));
    }
    try {
      await db.collection("users").insertOne({ ...user, password: passwordHash });
      res.sendStatus(201);
    } catch {
      res.status(401);
    }
  });

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;


  const login={email,password};
  
  const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(15).required()
  });
  
  const { error } = signinSchema.validate(login);
  if (error) {
    return res.status(422).send(error.details.map(detail => detail.message));
  }

  try {
    const user = await db.collection('users').findOne({ email });
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      
      const token = uuid();
  
      await db.collection('sessions').insertOne({ token, userId: user._id });
  
      res.send(token);
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(401)
  }
});



app.get("/meus-dados",async (req,res)=>{
  const {authorization}=req.headers;
  console.log(authorization);
  const token=authorization?.replace('Bearer ','');

  if(!token){
    return res.sendStatus(401)
  }

  const session = await db.collection('sessions').findOne({token});
  if(!session){
    return res.sendStatus(401);
  }
  const user=await db.collection('users').findOne({_id:session.userId});
  if(!user){
    return res.sendStatus(401);
  }

  delete user.password;
  res.send(user);
});

app.listen(port, () => {
  console.log(chalk.green.bold("Servidor Conectado na porta ", port));
});
