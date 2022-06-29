import express from "express";
import {mongoClient} from "mongodb";
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new mongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect();
