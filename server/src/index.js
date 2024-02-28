import express from "express";
import dotenv from "dotenv";
import createAccount from "./scrapper.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/create", (req, res) => {
  createAccount();
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[Listening port:${port}`);
});
