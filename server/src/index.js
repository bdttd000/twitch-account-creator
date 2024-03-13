import express from "express";
import dotenv from "dotenv";
import createAccount from "./scrapper.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/create", async (req, res) => {
  await new Promise(r => setTimeout(r, 1000))
  const result = await createAccount();
  res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`[Listening port:${port}`);
});
