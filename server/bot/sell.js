import { sell, findOrderById, orderCancle } from "../upbit/upBitApi.js";
import { db } from "../server.js";

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
        // console.log("매도 result", response);
        setTimeout(async () => {
          findOrderById({ orderUid: response.uuid, key })
            .then(async result => {
              console.log("매도", result);
              if (result.state === "done") {
                // 디비저장
                db.collection("trade")
                  .doc(result.uuid)
                  .set({ ...result, auth: botdata.auth })
                  .then(docRef => {
                    // 디비저장 성공
                    // console.log("Document written with ID: ", docRef.id);
                    resolve({ type: "done", result });
                  })
                  .catch(error => {
                    // 디비저장 실폐
                  });
              } else if (result.state === "wait") {
                orderCancle({
                  orderUid: result.uuid,
                  key,
                })
                  .then(cancleresult => {
                    resolve({ type: "cancle", result: cancleresult });
                  })
                  .catch(error => console.log(error));
                // 주문 취소
              } else if (result.state === "cancle") {
                // 주문 취소
              }
            })
            .catch(error => console.log(error));
        }, 500);
      })
      .catch(error => {});
  });
};
