import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./config/wiston.js";
import moment from "moment";
import bodyParser from "body-parser";
import route from "./routers/index.js";
import admin from "firebase-admin";
import serviceAccount from "./firebaseAccountKey.json";
import { getUpbitMarket } from "./upbit/upnitCandel.js";
import bot from "./bot/bot.js";

let now = moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");

let daychart = [];
let botArray = [];

// 1. firestore init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export const db = admin.firestore();

async function getmarket({ count, key }) {
  return new Promise(async (resolve, reject) => {
    await getUpbitMarket({ count, key })
      .then(async result => {
        // 데이차트 일평균 구할것
        resolve({
          daychart: result.daychartarray,
          marketData: result.marketData,
        });
      })
      .catch(error => reject(error));
  });
}

// 데이터 베이스 실시간 감시

export const sub = db.collection("bot").onSnapshot(async function (snapshot) {
  snapshot.docChanges().forEach(async function (change) {
    if (change.type === "added") {
      // 서버 재시작 시 봇 일시정기
      await db
        .collection("bot")
        .doc(change.doc.id)
        .update({ work: false })
        .then(result => logger.info(`bot reset : ${now}`));
    }
    if (change.type === "modified") {
      // console.log("봇 수정");
      if (change.doc.data().work === false) {
        let idIndex = botArray.findIndex(
          item => item.bot.botId == change.doc.id
        );
        if (idIndex > -1) {
          botArray[idIndex].bot.closeInterval();
          botArray[idIndex].bot.soket.close();
          let newArray = botArray.filter(
            item => item.bot.botId !== change.doc.id
          );
          botArray = newArray;
          logger.info(`bot stop - soket close and clearinterval : ${now}`);
        }
      } else if (change.doc.data().work === true) {
        let idIndex = botArray.findIndex(
          item => item.bot.botId == change.doc.id
        );
        if (idIndex <= -1) {
          let auth = change.doc.data().auth;
          // console.log(auth);
          let key = await db
            .collection("users")
            .where("email", "==", auth)
            .get()
            .then(querySnapshot => {
              let key = {};
              querySnapshot.forEach(doc => {
                key = {
                  accesskey: doc.data().accesskey,
                  seceret: doc.data().secretkey,
                };
                // console.log(doc.data().accesskey);
              });
              return key;
            })
            .catch(error => {
              // console.log("Error getting documents: ", error);
            });
          // console.log(key);
          logger.info(`bot start - searching candle : ${now}`);
          await getmarket({ count: change.doc.data().dayVolumeCont, key }).then(
            result => {
              let b = new bot();
              b.startBot({
                botid: change.doc.id,
                daychart: result.daychart,
                marketData: result.marketData,
                botdata: change.doc.data(),
                key,
              });
              logger.info(`bot start - soket start : ${now}`);
              b.startRestApi({
                botdata: change.doc.data(),
                marketData: result.marketData,
                botid: change.doc.id,
                key,
              });
              botArray.push({ bot: b, botData: change.doc.data() });
            }
          );
        }
      }
    }
    if (change.type === "removed") {
      // console.log("제거됨: ", change.doc.data());
      let idIndex = botArray.findIndex(item => item.bot.botId == change.doc.id);
      if (idIndex > -1) {
        botArray[idIndex].bot.soket.close();
        let newArray = botArray.filter(
          item => item.bot.botId !== change.doc.id
        );
        botArray = newArray;
        logger.info(`bot delete : ${now}`);
      } else {
      }
    }
  });
});
// 타이머 아침 9시?
// sub();
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", route);
// const wsServer = new ws.Server({ port: 8010 });
// let sendSoket = "";

app.listen(port, () => {
  logger.info(`server is running on ${port} : ${now}`);
  // console.log(`express is running on ${port}`);
});
