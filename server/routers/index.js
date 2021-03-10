import express from "express";
import dotenv from "dotenv";
import { db, sub } from "../server.js";
// import admin from "firebase-admin";

// var db = admin.firestore();
const router = express.Router();
dotenv.config();
router.get("/", (req, res) => res.json({ username: `${process.env.DB_NAME}` }));

router.get("/group", (req, res) => res.json({ username: "dev group. bryan" }));
// 업비트 어카운드

router.post("/bot/", async (req, res) => {
  let botId = req.body.botid;
  let type = req.body.type;
  console.log("봇시작");
  console.log(botId);

  // 리스너 분리 해결할것

  if (!type) {
    // 봇정지
    sub();
  } else {
    // 봇시작

    sub();
  }
});

export default router;

// const docfalse = db.collection("bot").where("work", "==", false);
