import { order, findOrderById, orderCancle } from "../upbit/upBitApi.js";
import { db } from "../server.js";
import { logger } from "../config/wiston.js";
import moment from "moment";
export const buyCoin = async ({ code, price, botdata, key }) => {
  // 주문가능 금액 확인
  return new Promise(async (resolve, reject) => {
    // 매수
    await order({
      code,
      price,
      type: botdata.buytype,
      botdata,
      key,
    })
      .then(async response => {
        logger.info(
          `매수 RESPONSE : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
        );
        setTimeout(async () => {
          logger.info(
            `매수 SETTIMEOUT: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          );
          findOrderById({ orderUid: response.uuid, key })
            .then(async result => {
              // console.log("매수 result", result);
              logger.info(
                `매수 FIND ORDER: ${moment().format(
                  "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                )}`
              );
              if (result) {
                if (result.state === "done") {
                  // 디비저장
                  logger.info(
                    `매수 FIND ORDER DONE: ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  db.collection("trade")
                    .doc(result.uuid)
                    .set({ ...result, auth: botdata.auth })
                    .then(docRef => {
                      logger.info(
                        `매수 SAVE DB: ${moment().format(
                          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                        )}`
                      );
                      // 디비저장 성공
                      // console.log("Document written with ID: ", docRef.id);
                      resolve({ type: "done", result });
                    })
                    .catch(error => {
                      // 디비저장 실폐
                      logger.info(
                        `매수 SAVE DB FAILED: ${moment().format(
                          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                        )}`
                      );
                    });
                } else if (result.state === "wait") {
                  logger.info(
                    `매수 ORDER WAIT: ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  logger.info(
                    `매수 ORDER CANCLE: ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  orderCancle({
                    orderUid: result.uuid,
                    key,
                  })
                    .then(cancleresult => {
                      logger.info(
                        `매수 ORDER CANCLE RESULT: ${moment().format(
                          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                        )}`
                      );
                      resolve({ type: "cancle", result: cancleresult });
                    })
                    .catch(error => {});
                  // 주문 취소
                } else if (result.state === "cancle") {
                  // 주문 취소
                }
              }
            })
            .catch(error => {});
        }, 500);
      })
      .catch(error => {});
  });
};
