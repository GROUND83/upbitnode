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
import http from "http";
import * as io from "socket.io";

let botArray = [];
let socket = "";
// 1. firestore init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export const db = admin.firestore();
const app = express();
app.use(cors());
// app.use(bodyParser.json());
const port = process.env.PORT || 9000;
const server = http.createServer(app);
export const soketServer = new io.Server(server);

app.use("/api", route);
// const wsServer = new ws.Server({ port: 8010 });

server.listen(port, () => {
  logger.info(
    `server is running on ${server.address()} ${port} : ${moment().format(
      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
    )}`
  );
  // console.log(`express is running on ${port}`);
});
soketServer.on("connection", async function (socket) {
  console.log("hi");
  // console.log(socket.id);
  socket.on("joinRoom", function (msg) {
    // joinRoom을 클라이언트가 emit 했을 시
    let roomName = msg;
    console.log("접속", roomName);
    socket.join(roomName); // 클라이언트를 msg에 적힌 room으로 참여 시킴
  });
  socket.on("leaveRoom", function (msg) {
    // joinRoom을 클라이언트가 emit 했을 시
    let roomName = msg;
    console.log("탈퇴", roomName);
    socket.leave(roomName); // 클라이언트를 msg에 적힌 room으로 참여 시킴
  });
  socket.on("disconnect", function () {
    console.log("has disconnected from the chat.");
  });
});

// const leaveRoom = roomname =>
//   soketServer.on("connection", async function (socket) {
//     console.log("hi");
//     // console.log(socket.id);
//     socket.leaveRoom(roomname);
//   });
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
        .then(result =>
          logger.info(
            `bot reset : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          )
        );
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
          // leaveRoom(change.doc.id);

          let newArray = botArray.filter(
            item => item.bot.botId !== change.doc.id
          );
          // room.close
          botArray = newArray;
          logger.info(
            `bot stop - soket close and clearinterval : ${moment().format(
              "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            )}`
          );
        }
      } else if (change.doc.data().work === true) {
        // console.log(change.doc.data().work, change.doc.id);
        // setRoom(change.doc.id);
        // socket.on("message", data => {
        //   console.log(data);
        // });
        let idIndex = botArray.findIndex(
          item => item.bot.botId == change.doc.id
        );
        // console.log(idIndex);
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
          logger.info(
            `bot start - searching candle : ${moment().format(
              "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            )}`
          );
          // await db
          //   .collection("botplay")
          //   .doc(change.doc.id)
          //   .set({ canplay: true })
          //   .then(result => {});
          // 스캐줄러
          await getmarket({
            count: change.doc.data().dayVolumeCont,
            key,
          }).then(async result => {
            // await db
            //   .collection("botplay")
            //   .doc(change.doc.id)
            //   .set({ canplay: false })
            //   .then(result => {});
            // logger.info(
            //   `bot getmarket finished  : ${moment().format(
            //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            //   )}`
            // );
            let b = new bot();
            b.startBot({
              botid: change.doc.id,
              daychart: result.daychart,
              marketData: result.marketData,
              botdata: change.doc.data(),
              key,
            });
            b.startRestApi({
              botdata: change.doc.data(),
              marketData: result.marketData,
              botid: change.doc.id,
              key,
            });

            botArray.push({ bot: b, botData: change.doc.data() });
          });
        }
      }
    }
    if (change.type === "removed") {
      // console.log("제거됨: ", change.doc.data());
      let idIndex = botArray.findIndex(item => item.bot.botId == change.doc.id);
      if (idIndex > -1) {
        botArray[idIndex].bot.closeInterval();
        botArray[idIndex].bot.soket.close();
        // leaveRoom(change.doc.id);

        let newArray = botArray.filter(
          item => item.bot.botId !== change.doc.id
        );
        // room.close
        botArray = newArray;
        logger.info(
          `bot stop - soket close and clearinterval : ${moment().format(
            "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          )}`
        );
      }
    }
  });
});
