import request from "request-promise";
import { v4 as uuidv4 } from "uuid";
import sign from "jsonwebtoken";
import crypto from "crypto";
import queryString from "query-string";
import querystring from "querystring";

// // 계좌전체조회
// export async function getPriceRate({ market, type, count }) {
//   const payload = {
//     access_key: access_key,
//     nonce: uuidv4(),
//   };

//   let getUrl = "";
//   if (type === "minutes1") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/1?market=${market}&count=${count}`;
//   } else if (type === "minutes3") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/3?market=${market}&count=${count}`;
//   } else if (type === "minutes5") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/5?market=${market}&count=${count}`;
//   } else if (type === "minutes10") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/10?market=${market}&count=${count}`;
//   } else if (type === "minutes30") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/30?market=${market}&count=${count}`;
//   } else if (type === "minutes60") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/60?market=${market}&count=${count}`;
//   } else if (
//     type !== "minutes1" &&
//     type !== "minutes3" &&
//     type !== "minutes5" &&
//     type !== "minutes10" &&
//     type !== "minutes30" &&
//     type !== "minutes60"
//   ) {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/${type}/?market=${market}&count=${count}`;
//   }
//   const token = sign.sign(payload, secret_key);
//   const options = {
//     method: "GET",
//     url: getUrl,
//     headers: { Authorization: `Bearer ${token}` },
//   };
//   return new Promise((resolve, reject) => {
//     request(options)
//       .then(result => {
//         // console.log(result);
//         resolve(result);
//       })
//       .catch(err => reject(err));
//   });
// }
// minutes,days,weeks,months
// export async function getChageRate({ market, type, count }) {
//   const payload = {
//     access_key: access_key,
//     nonce: uuidv4(),
//   };
//   let getUrl = "";
//   if (type === "minutes1") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/1?market=${market}&count=${count}`;
//   } else if (type === "minutes3") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/3?market=${market}&count=${count}`;
//   } else if (type === "minutes5") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/5?market=${market}&count=${count}`;
//   } else if (type === "minutes10") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/10?market=${market}&count=${count}`;
//   } else if (type === "minutes30") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/30?market=${market}&count=${count}`;
//   } else if (type === "minutes60") {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/minutes/60?market=${market}&count=${count}`;
//   } else if (
//     type !== "minutes1" &&
//     type !== "minutes3" &&
//     type !== "minutes5" &&
//     type !== "minutes10" &&
//     type !== "minutes30" &&
//     type !== "minutes60"
//   ) {
//     getUrl =
//       "https://api.upbit.com" + `/v1/candles/${type}/?market=${market}&count=${count}`;
//   }

//   const token = sign.sign(payload, secret_key);
//   const options = {
//     method: "GET",
//     url: getUrl,
//     headers: { Authorization: `Bearer ${token}` },
//   };
//   return new Promise((resolve, reject) => {
//     request(options)
//       .then(result => {
//         // console.log(result);
//         resolve(result);
//       })
//       .catch(err => reject(err));
//   });
// }
export async function getCandel({ market, count, key }) {
  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
  };
  const token = sign.sign(payload, key.seceret);
  const options = {
    method: "GET",
    url:
      "https://api.upbit.com" +
      `/v1/candles/days?market=${market}&count=${count}`,
    headers: { Authorization: `Bearer ${token}` },
  };
  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        // console.log(result);
        resolve(result);
      })
      .catch(err => reject(err));
  });
}
export async function getTicker({ markets, key }) {
  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
  };
  const token = sign.sign(payload, key.seceret);
  const options = {
    method: "GET",
    url: "https://api.upbit.com" + `/v1/ticker/?markets=${markets}`,
    headers: { Authorization: `Bearer ${token}` },
  };
  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        // console.log(result);
        resolve(result);
      })
      .catch(err => reject(err));
  });
}
// 계좌전체조회
export async function getMarket({ key }) {
  // console.log(key);
  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
  };
  const token = sign.sign(payload, key.seceret);
  const options = {
    method: "GET",
    url: "https://api.upbit.com" + "/v1/market/all?isDetails=true",
    headers: { Authorization: `Bearer ${token}` },
  };
  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        // console.log(result);
        resolve(result);
      })
      .catch(err => reject(err));
  });
}
// 계좌전체조회
export async function getAccount({ key }) {
  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
  };
  const token = sign.sign(payload, key.seceret);
  const options = {
    method: "GET",
    url: "https://api.upbit.com" + "/v1/accounts",
    headers: { Authorization: `Bearer ${token}` },
  };
  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        // console.log(result);
        resolve(result);
      })
      .catch(err => reject(err));
  });
}
// 계별주문조회
export async function findOrderById({ orderUid, key }) {
  const body = {
    uuid: orderUid,
  };
  const query = querystring.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };
  const token = sign.sign(payload, key.seceret);
  const options = {
    method: "GET",
    url: "https://api.upbit.com" + "/v1/order?" + query,
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        resolve(result);
      })
      .catch(err => reject());
  });
}
// 주문리스트조회
export async function orderlist({ list, key }) {
  console.log("리스트", list);
  const state = "done";
  const uuids = list;

  const non_array_body = {
    state: state,
  };
  const array_body = {
    uuids: uuids,
  };
  const body = {
    ...non_array_body,
    ...array_body,
  };

  const uuid_query = uuids.map(uuid => `uuids[]=${uuid}`).join("&");
  const query = querystring.encode(non_array_body) + "&" + uuid_query;

  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, key.seceret);

  const options = {
    method: "GET",
    url: "https://api.upbit.com" + "/v1/orders?" + query,
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        resolve(result);
      })
      .catch(err => reject(err));
  });
}
// 주문가능조회
// export async function orderPossible({ code }) {
//   // 코인 종류
//   const body = {
//     market: code,
//   };
//   const query = queryString.stringify(body);
//   const hash = crypto.createHash("sha512");
//   const queryHash = hash.update(query, "utf-8").digest("hex");

//   const payload = {
//     access_key: access_key,
//     nonce: uuidv4(),
//     query_hash: queryHash,
//     query_hash_alg: "SHA512",
//   };

//   const token = sign.sign(payload, secret_key);

//   const options = {
//     method: "GET",
//     url: "https://api.upbit.com" + "/v1/orders/chance?" + query,
//     headers: { Authorization: `Bearer ${token}` },
//     json: body,
//   };

//   return new Promise((resolve, reject) => {
//     request(options)
//       .then(result => {
//         console.log(result);
//         resolve(result);
//       })
//       .catch(err => reject(err));
//   });
// }

// 주문취소
export async function orderCancle({ orderUid, key }) {
  // 주문번호
  const body = {
    uuid: orderUid,
  };
  const query = querystring.encode(body);

  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, key.seceret);

  const options = {
    method: "DELETE",
    url: "https://api.upbit.com" + "/v1/order?" + query,
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        resolve(result);
      })
      .catch(err => reject(err));
  });
}

// 주문취소
export async function order({ code, price, type, botdata, key }) {
  // 호가계산
  let unit = price => {
    return new Promise((resolve, reject) => {
      if (0 < price && price < 10) {
        return resolve(0.01);
      } else if (10 < price && price < 100) {
        return resolve(0.1);
      } else if (100 < price && price < 1000) {
        return resolve(1);
      } else if (1000 < price && price < 10000) {
        return resolve(5);
      } else if (10000 < price && price < 100000) {
        return resolve(10);
      } else if (100000 < price && price < 500000) {
        return resolve(50);
      } else if (500000 < price && price < 1000000) {
        return resolve(100);
      } else if (1000000 < price && price < 2000000) {
        return resolve(500);
      } else if (2000000 < price) {
        return resolve(1000);
      }
    });
  };

  let unitvalue = await unit(price);
  let buyprice =
    type === "limit"
      ? price + unitvalue * botdata.buyRate
      : botdata.maxBaseMoney;
  // 계좌의 퍼센트 의미 없음
  // let culprice = () => {
  //   if (botdata.maxBaseMoneyType !== "price") {
  //     let percent = botdata.maxBaseMoney;
  //     return Number(accountprice) * percent;
  //   } else {
  //     return Number(botdata.maxBaseMoney);
  //   }
  // };
  // 종목당 투자금액
  let canprice = botdata.maxBaseMoney;
  // 볼륨계산 = 종목탕 투자금액/ 현재금액 + 호가
  let culVolume = canprice / buyprice;
  // console.log(buyprice, canprice, culVolume, type);

  const body = {
    market: code,
    side: "bid",
    volume: type === "price" ? null : String(culVolume.toFixed(8)),
    price: String(buyprice),
    ord_type: type, //price,limit
  };
  const query = querystring.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, key.seceret);

  const options = {
    method: "POST",
    url: "https://api.upbit.com" + "/v1/orders",
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  return new Promise((resolve, reject) => {
    if (canprice < 5000) {
      reject();
    } else if (canprice >= 5000) {
      request(options)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          // console.log(err);
          reject(err);
        });
    }
  });
}

export async function sell({ code, price, volume, type, key, botdata }) {
  // console.log({ code, price, volume, type, key });
  let unit = price => {
    return new Promise((resolve, reject) => {
      if (0 < price && price < 10) {
        return resolve(0.01);
      } else if (10 < price && price < 100) {
        return resolve(0.1);
      } else if (100 < price && price < 1000) {
        return resolve(1);
      } else if (1000 < price && price < 10000) {
        return resolve(5);
      } else if (10000 < price && price < 100000) {
        return resolve(10);
      } else if (100000 < price && price < 500000) {
        return resolve(50);
      } else if (500000 < price && price < 1000000) {
        return resolve(100);
      } else if (1000000 < price && price < 2000000) {
        return resolve(500);
      } else if (2000000 < price) {
        return resolve(1000);
      }
    });
  };

  let unitvalue = await unit(price);

  let sellprice =
    type === "limit" ? price + unitvalue * botdata.sellRate : price;
  const body = {
    market: code,
    side: "ask",
    price: type === "market" ? null : String(sellprice),
    volume: String(volume),
    ord_type: type, // market 이면 price 없어도 된다.
  };
  // console.log(body);
  const query = querystring.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");

  const payload = {
    access_key: key.accesskey,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = sign.sign(payload, key.seceret);

  const options = {
    method: "POST",
    url: "https://api.upbit.com" + "/v1/orders",
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  return new Promise((resolve, reject) => {
    request(options)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
}
