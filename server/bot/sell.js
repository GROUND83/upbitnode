import { sell, findOrderById, orderCancle } from "../upbit/upBitApi.js";
import { db } from "../server.js";
import { logger } from "../config/wiston.js";
import moment from "moment";
// 매도
export const sellCoin = ({
  code,
  price,
  volume,
  type,
  botdata,
  botid,
  key,
}) => {
  return new Promise((resolve, reject) => {
    // 초당 3회
    sell({
      code,
      price,
      volume,
      type,
      key,
      botdata,
    })
      .then(async response => {
        logger.info(
          `매도 SELL RESPONSE : ${moment().format(
            "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          )}`
        );
        // console.log("매도 result", response);
        setTimeout(async () => {
          logger.info(
            `매도 SELL TIMEOUT : ${moment().format(
              "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            )}`
          );
          findOrderById({ orderUid: response.uuid, key })
            .then(async result => {
              logger.info(
                `매도 FIND ORDER SELL : ${moment().format(
                  "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                )}`
              );
              // console.log("매도", result);
              if (result) {
                logger.info(
                  `매도 FINDED ORDER SELL : ${moment().format(
                    "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                  )}`
                );
                if (result.state === "done") {
                  logger.info(
                    `매도 FINDED ORDER SELL DONE : ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  // 디비저장
                  logger.info(
                    `매도 SAVE DB : ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  db.collection("trade")
                    .doc(result.uuid)
                    .set({ ...result, auth: botdata.auth })
                    .then(docRef => {
                      // 디비저장 성공
                      logger.info(
                        `매도 SAVE DB DONE SELL: ${moment().format(
                          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                        )}`
                      );
                      // console.log("Document written with ID: ", docRef.id);
                      resolve({ type: "done", result });
                    })
                    .catch(error => {
                      logger.info(
                        `매도 SAVE DB FAILED SELL: ${moment().format(
                          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                        )}`
                      );
                      // 디비저장 실폐
                    });
                } else if (result.state === "wait") {
                  logger.info(
                    `매도 FIND ORDER SELL WAIT: ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  logger.info(
                    `매도 FIND ORDER SELL CANCLE: ${moment().format(
                      "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    )}`
                  );
                  console.log(result);
                  orderCancle({
                    orderUid: result.uuid,
                    key,
                  })
                    .then(cancleresult => {
                      logger.info(
                        `매도 FIND ORDER SELL CANCLE RESULT: ${moment().format(
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
