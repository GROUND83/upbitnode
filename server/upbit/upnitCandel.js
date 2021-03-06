import { getCandel, getMarket } from "../upbit/upBitApi.js";

export const getUpbitCandle = async ({ marketData, count, key }) => {
  return new Promise(async (resolve, reject) => {
    let daychartarray = [];
    let tickerArray = [];
    try {
      function sleep(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }
      // console.log("캔들");
      for (let i = 0; i < marketData.length; i++) {
        // console.log(daychartarray);
        await getCandel({ market: marketData[i], count, key }).then(result => {
          let data = JSON.parse(result);
          daychartarray.push({ market: data[0].market, data });
        });
        await sleep(200);
      }
      console.log(daychartarray);
      // await getTicker({ market: marketData }).then(result => {
      //   let data = JSON.parse(result);
      //   tickerArray = data;
      // });
      resolve({ daychartarray, marketData });
    } catch (e) {
      reject(e);
    }
  });
};

export const getUpbitMarket = async ({ count, key }) => {
  let marketData = [];
  return new Promise(async (resolve, reject) => {
    await getMarket({ key }).then(result => {
      let newdata = JSON.parse(result);
      // console.log(newdata.length);
      // console.log(typeof newdata);
      let newArray = newdata.filter(element => element.market.includes("KRW-"));
      let webSoketArray = [];
      newArray.forEach(el => {
        // console.log(el);
        if (el.market_warning === "NONE") {
          webSoketArray.push(el.market);
        }
      });
      marketData = webSoketArray;
    });
    await getUpbitCandle({ marketData, count, key })
      .then(result => {
        resolve(result);
      })
      .catch(e => reject(e));
  });
};
