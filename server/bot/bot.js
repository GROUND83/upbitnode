import request from "request-promise";
import websocket from "websocket";
import { logger } from "../config/wiston.js";
import moment from "moment";
import schedule from "node-schedule";
import { soketServer } from "../server.js";
import {
  serarchPriceRange,
  serarchHighRange,
  serarchEndPriceRange,
  serarchLastbyStartPrice,
  serarchDayVolumeAvg,
  priceChangeOrder,
  gap,
  tradeprice,
  tradevolume,
} from "../status/ifstarus.js";
import { buyCoin } from "../bot/buy.js";
import { sellCoin } from "../bot/sell.js";

import {
  getAccount,
  getTicker,
  orderlist,
  findOrderById,
  orderCancle,
} from "../upbit/upBitApi.js";
import { db } from "../server.js";

class bot {
  constructor(url = "wss://api.upbit.com/websocket/v1") {
    this.url = url;
    this.soket = "";
    this.botId = "";
    this.daychart = "";
    this.coindata = [];
    this.buycoin = [];
    this.traybuycoin = [];
    this.sellcoindprocess = [];
    this.checkAccount = "";
    this.checkTicker = "";
    this.tickerArray = [];
    this.account = [];
    this.sortarray = [];
    this.buying = false;
    this.selling = false;
    this.loscut = 0;
    this.startPrice = 0;
    this.loscutInterval = "";
    this.sellcoin = [];
    this.orderlist = "";
    this.orderarray = [];
    this.firstWon = 0;
    this.buyAgainArray = [];
    this.startsehedule = "";
    this.stopsehedule = "";
    this.sendData = [];
  }

  reatimeData = ({ index, result, botData }) => {
    return new Promise((resolve, reject) => {
      if (index == -1) {
        let newArray = [];
        let data = {
          code: result.code,
          trade_price: result.trade_price,
          trade_volume: result.trade_volume,
          gap: null,
          avg_trade_volume: null,
          avg_trade_price: null,
        };
        newArray.push(data);
        this.coindata.push(newArray);
        // logger.info(
        //   `Try REALTIME DATA this.coindata to PUSH - ${
        //     result.code
        //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
        // );
      } else {
        // coindata 있으면
        // 마지막가격
        let lastTradePrice = this.coindata[index][
          this.coindata[index].length - 1
        ].trade_price;
        // 현재가격
        let tradePrice = result.trade_price;
        let persent = (tradePrice - lastTradePrice) / lastTradePrice;
        // logger.info(
        //   `gap - ${persent} :${result.code}: ${moment().format(
        //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
        //   )}`
        // );
        if (this.coindata[index].length >= botData.volumeTypeValue) {
          // 틱 벨류 꽉차면
          let sum_price = 0;
          let sum_trade_volume = 0;
          async function processArray(array) {
            const promise = array.map(item => {
              sum_price += item.trade_price;
              sum_trade_volume += item.trade_volume;
            });
            await Promise.all(promise);
          }
          processArray(this.coindata[index]);
          let avg_trade_volume =
            (sum_trade_volume / this.coindata[index].length -
              result.trade_volume) /
            result.trade_volume;
          let avg_trade_price =
            (sum_price / this.coindata[index].length - result.trade_price) /
            result.trade_price;
          let data = {
            code: result.code,
            trade_price: result.trade_price,
            trade_volume: result.trade_volume,
            gap: Number(persent),
            avg_trade_volume,
            avg_trade_price,
          };
          // logger.info(
          //   `avg_trade_price - ${data.avg_trade_price} :${
          //     result.code
          //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          // logger.info(
          //   `avg_trade_volume - ${data.avg_trade_volume} :${
          //     result.code
          //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          // logger.info(
          //   `gap - ${data.gap} :${result.code}: ${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          this.coindata[index].shift();
          this.coindata[index].push(data);
          // logger.info(
          //   `this.coindata push done - ${data.gap} :${
          //     result.code
          //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          resolve();
        } else {
          // 설정된 값에 같아질때까지
          let data = {
            code: result.code,
            trade_price: result.trade_price,
            trade_volume: result.trade_volume,
            gap: Number(persent),
            avg_trade_volume: null,
            avg_trade_price: null,
          };
          this.coindata[index].push(data);
          // logger.info(
          //   `not enough botData.volumeTypeValue :${
          //     this.coindata[index].length
          //   } : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          resolve();
        }
      }
    });
  };

  async startBot({ botid, daychart, marketData, botdata, key }) {
    this.startsehedule = schedule.scheduleJob(
      { hour: Number(botdata.starttime), minute: Number(botdata.startminute) },
      function () {
        db.collection("bot")
          .doc(botid)
          .get()
          .then(doc => {
            if (!doc.data().work) {
              console.log("실행");
              db.collection("bot").doc(botid).update({ work: true });
            }
          });
      }
    );
    this.stopsehedule = schedule.scheduleJob(
      { hour: Number(botdata.endtime), minute: Number(botdata.endminute) },
      function () {
        console.log("실행종료");
        db.collection("bot").doc(botid).update({ work: false });
      }
    );
    logger.info(
      `started BOT : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
    );

    this.soket = new websocket.w3cwebsocket(this.url);
    this.botId = botid;
    this.soket.onerror = function (error) {
      logger.info(
        `upbitConnection Error ${error}  : ${moment().format(
          "YYYY-MM-DD HH:mm:ss.SSS ZZ"
        )}`
      );
    };

    this.soket.onopen = () => {
      let array = [
        { ticket: "123123kldfjsa" },
        { type: "ticker", codes: marketData },
      ];

      // console.log("WebSocket Client Connected");
      this.soket.send(JSON.stringify(array));
    };
    this.soket.onclose = function () {
      // console.log("echo-protocol Client Closed");
      logger.info(
        `upbit Client Closed : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
      );
    };

    this.soket.onmessage = async e => {
      // let data = JSON.parse(new TextDecoder().decode(e.data));

      let data = JSON.parse(new TextDecoder().decode(e.data));
      // console.log(data);
      let realtimeindex = this.coindata.findIndex(
        item => item[0].code === data.code
      );
      // 실시간 테이터 판단 현재가변동, 거랴량변동, gap
      await this.reatimeData({
        index: realtimeindex,
        result: data,
        botData: botdata,
      });
      // 실시간 변동률
      // let sortarrayindex = this.sortarray.findIndex(
      //   item => item.code === data.code
      // );
      // if (sortarrayindex > -1) {
      //   this.sortarray.splice(sortarrayindex, 1, {
      //     code: data.code,
      //     signed_change_rate: data.signed_change_rate,
      //   });
      // } else {
      //   this.sortarray.push({
      //     code: data.code,
      //     signed_change_rate: data.signed_change_rate,
      //   });
      // }

      let daychartindex = daychart.findIndex(item => item.market === data.code);
      // 일 거래량 평균
      let serearchDayVolumeAvg = await serarchDayVolumeAvg({
        daychart: daychart[daychartindex],
        dayVolumePercent: botdata.dayVolumePercent,
        dayVolumePercentplus: botdata.dayVolumePercentplus,
        acc_trade_volume: data.acc_trade_volume,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 일거래량 평균:${result.value}-${
          //     result.dayVolumePercent
          //   }-${result.dayVolumePercentplus}-${result.cul}${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => console.log(error));

      // 현재가 겁색
      let serearchpricerange = await serarchPriceRange({
        lowprice: botdata.lowprice,
        highprice: botdata.highprice,
        tradprice: data.trade_price,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 현재가 검색:${result.value}-${
          //     result.lowprice
          //   }-${result.highprice}-${result.tradprice}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      // 금일 등락률
      let searchhighrange = await serarchHighRange({
        lowrange: botdata.lowrange,
        highrange: botdata.highrange,
        signedchangerate: data.signed_change_rate,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 금일등락률:${result.value}-${
          //     result.lowrange
          //   }-${result.highrange}-${result.signedchangerate}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      //전일 시가 대비 전일 종가
      let searchendpricerange = await serarchEndPriceRange({
        daychart: daychart[daychartindex],
        endplowricerange: botdata.endplowricerange,
        endpricerange: botdata.endpricerange,
        code: data.code,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 전일 시가대비 전일 종가:${result.value}-${
          //     result.endplowricerange
          //   }-${result.endpricerange}-${result.rate}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      // 전일 최고변동률
      let serarchlaststartprice = await serarchLastbyStartPrice({
        daychart: daychart[daychartindex],
        lowlastbystartprice: botdata.lowlastbystartprice,
        lastbystartprice: botdata.lastbystartprice,
        code: data.code,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 전일최고변동률:${result.value}-${
          //     result.lowlastbystartprice
          //   }-${result.lastbystartprice}-${result.rate}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      // 금일 상승률 순위 ? 1초 tikcer 사용?
      let serearchPricChangeOrder = await priceChangeOrder({
        tickerArray: this.tickerArray,
        botdata,
        code: data.code,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 금일등락률:${result.value}-${
          //     result.firstPriceRate
          //   }-${result.secondPriceRate}-${result.cul}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      // gap 변동
      let serarchgap = await gap({
        realGap: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].gap,
        botdata,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - GAP:${result.value}-${result.dataHighgap}-${
          //     result.dataHighgap
          //   }-${result.realGap}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});
      // console.log("갭변동률", serarchgap());
      // 현재가변동 틱
      let searchtradeprice = await tradeprice({
        realTradePrice: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].avg_trade_price,
        botdata,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 현재가변동:${result.value}-${
          //     result.changeRate
          //   }-${result.realTradePrice}:${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          return result;
        })
        .catch(error => {});

      // 거래량변동 틱
      let searchtradevolume = await tradevolume({
        realvolume: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].avg_trade_volume,
        botdata,
      })
        .then(result => {
          // logger.info(
          //   `code:${data.code} - 거래량변동:${result.value}-${result.volume}-${
          //     result.realvolume
          //   }:${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          return result;
        })
        .catch(error => {});

      let arrayinde = this.coindata[realtimeindex].length;
      let accindex = this.account.findIndex(
        item => `KRW-${item.currency}` === data.code && item.currency !== "KRW"
      );
      // console.log(accindex, this.account[accindex]);
      if (
        serearchpricerange.value &&
        serearchDayVolumeAvg.value &&
        serearchPricChangeOrder.value &&
        searchhighrange.value &&
        searchendpricerange.value &&
        serarchlaststartprice.value &&
        serarchgap.value &&
        searchtradeprice.value &&
        searchtradevolume.value &&
        arrayinde >= botdata.volumeTypeValue
      ) {
        let tryarrayindex = this.traybuycoin.findIndex(
          item => item.code === data.code
        );
        let newData = {
          botdata,
          botid,
          code: data.code,
          serearchpricerange,
          serearchDayVolumeAvg,
          serearchPricChangeOrder,
          searchhighrange,
          searchendpricerange,
          serarchlaststartprice,
          serarchgap,
          searchtradeprice,
          searchtradevolume,
          arrayinde,
        };
        let sendDataIndex = this.sendData.findIndex(
          item => item[0].code === data.code
        );
        if (sendDataIndex === -1) {
          let newArray = [];
          newArray.push(newData);
          this.sendData.push(newArray);
          // console.log("없음", this.sendData, sendDataIndex);
        } else if (sendDataIndex > -1) {
          // console.log("있음", this.sendData, sendDataIndex);
          this.sendData[sendDataIndex].push(newData);
        }

        soketServer.to(botid).emit("message", JSON.stringify(this.sendData));
        // 검출 디비저장 botsearchdata
        // 원화
        // logger.info(
        //   `tryarrayindex : ${tryarrayindex}  : ${moment().format(
        //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
        //   )}`
        // );

        if (
          accindex < 0 &&
          this.account.length < Number(botdata.maxBuy) + 1 &&
          this.account.length > 0 &&
          tryarrayindex < 0 &&
          !this.buying
        ) {
          // logger.info(
          //   `accindex : ${accindex} -  this.account.length:${
          //     this.account.length
          //   } -maxbuy:${Number(botdata.maxBuy)}-this.buying:${
          //     this.buying
          //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
          // );
          let wonindex = this.account.findIndex(
            item => item.currency === "KRW"
          );

          if (
            Number(this.account[wonindex].balance) >= 5000 &&
            Number(this.account[wonindex].locked) <= 0 &&
            Number(this.account[wonindex].balance) >= botdata.maxBaseMoney
          ) {
            this.buying = true;
            this.traybuycoin.push({ code: data.code });

            let againIndex = this.buyAgainArray.findIndex(
              item => item.code === data.code
            );
            if (botdata.buyAgain) {
              await buyCoin({
                code: data.code,
                price: data.trade_price,
                botdata,
                key,
              })
                .then(async result => {
                  console.log(result);
                  // logger.info(
                  //   `매도시도 결과 리턴 ${
                  //     result.result.market
                  //   } : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                  // );
                  console.log({
                    buying: this.buying,
                    account: this.account,
                    traybuycoin: this.traybuycoin,
                  });
                  // logger.info(
                  //   `매수시도 결관 리턴  - ${data.code}: ${moment().format(
                  //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                  //   )}`
                  // );
                  if (result.type === "done") {
                    // logger.info(
                    //   `매수시도 결과 DONE - ${data.code}: ${moment().format(
                    //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    //   )}`
                    // );
                    // console.log("매수", result.result.uuid);
                    // 재매수
                    if (botdata.buyAgain) {
                      // 재매수 어래이에 푸쉬
                      // this.traybuycoin.push({ code: data.code });
                      // let newarray = this.traybuycoin.filter(
                      //   item => item.code !== result.result.market
                      // );
                      // // logger.info(
                      // //   `재매수 traybuycoin 새로운 배열 추가- ${
                      // //     result.result.market
                      // //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                      // // );
                      // this.traybuycoin = newarray;
                    }
                    let newarray = this.traybuycoin.filter(
                      item => item.code !== result.result.market
                    );
                    this.traybuycoin = newarray;
                  } else {
                    let newarray = this.traybuycoin.filter(
                      item => item.code !== result.result.market
                    );
                    // logger.info(
                    //   `매수시도 결과 NOT DONE - ${
                    //     result.result.market
                    //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                    // );
                    this.traybuycoin = newarray;
                  }
                  this.buying = false;
                  console.log({
                    buying: this.buying,
                    account: this.account,
                    traybuycoin: this.traybuycoin,
                  });
                  // logger.info(
                  //   `Try this.buying to false - ${
                  //     dresult.result.market
                  //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                  // );
                })
                .catch(error => {});
            } else if (!botdata.buyAgain && againIndex === -1) {
              await buyCoin({
                code: data.code,
                price: data.trade_price,
                botdata,
                key,
              })
                .then(async result => {
                  console.log(result);
                  // logger.info(
                  //   `매도시도 결과 리턴 ${
                  //     result.result.market
                  //   } : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                  // );
                  console.log({
                    buying: this.buying,
                    account: this.account,
                    traybuycoin: this.traybuycoin,
                  });
                  // logger.info(
                  //   `매수시도 결관 리턴  - ${data.code}: ${moment().format(
                  //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                  //   )}`
                  // );
                  if (result.type === "done") {
                    // logger.info(
                    //   `매수시도 결과 DONE - ${data.code}: ${moment().format(
                    //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    //   )}`
                    // );
                    // console.log("매수", result.result.uuid);
                    // 재매수
                    if (botdata.buyAgain) {
                      // 재매수 어래이에 푸쉬
                      // this.traybuycoin.push({ code: data.code });
                      // let newarray = this.traybuycoin.filter(
                      //   item => item.code !== result.result.market
                      // );
                      // // logger.info(
                      // //   `재매수 traybuycoin 새로운 배열 추가- ${
                      // //     result.result.market
                      // //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                      // // );
                      // this.traybuycoin = newarray;
                    }
                    let newarray = this.traybuycoin.filter(
                      item => item.code !== result.result.market
                    );
                    this.traybuycoin = newarray;
                  } else {
                    let newarray = this.traybuycoin.filter(
                      item => item.code !== result.result.market
                    );
                    // logger.info(
                    //   `매수시도 결과 NOT DONE - ${
                    //     result.result.market
                    //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                    // );
                    this.traybuycoin = newarray;
                  }
                  this.buying = false;
                  console.log({
                    buying: this.buying,
                    account: this.account,
                    traybuycoin: this.traybuycoin,
                  });
                  // logger.info(
                  //   `Try this.buying to false - ${
                  //     dresult.result.market
                  //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                  // );
                })
                .catch(error => {});
            }
            // logger.info(
            //   `traybuycoin 배열렝스 : ${
            //     this.traybuycoin.length
            //   }: ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
            // );
            // 매수시도
            // console.log("매수시도", {
            //   code: data.code,
            //   type: {
            //     serearchpricerange,
            //     serearchDayVolumeAvg,
            //     serearchPricChangeOrder,
            //     searchhighrange,
            //     searchendpricerange,
            //     serarchlaststartprice,
            //     serarchgap,
            //     searchtradeprice,
            //     searchtradevolume,
            //     arrayinde,
            //     accountLength: this.account.length,
            //     maxbuy: botdata.maxBuy,
            //   },
            // });
          }
        }
      }

      // 매도 감시
      // logger.info(
      //   `account 인덱스 ${accindex}-account 렝스:${
      //     this.account.length
      //   }-this.selling:${this.selling}: ${moment().format(
      //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
      //   )}`
      // );
      if (
        accindex > -1 &&
        this.account.length > 1 &&
        Number(this.account[accindex].locked) <= 0 &&
        !this.selling
      ) {
        let avg_buy_price = Number(this.account[accindex].avg_buy_price);
        let nowprice = Number(data.trade_price);
        let coinpicenow = Number(this.account[accindex].balance) * nowprice;
        let cul = (nowprice - avg_buy_price) / avg_buy_price;
        // 검색 코인 평가금액이 5000원이상
        let sellcoindIndex = this.sellcoin.findIndex(
          item => item.code === data.code
        );
        // console.log({
        //   accindex,
        //   accountLength: this.account.length,
        //   locked: Number(this.account[accindex].locked),
        //   avg_buy_price,
        //   nowprice,
        //   coinpicenow,
        //   cul,
        //   sellcoindIndex,
        // });
        if (coinpicenow >= 5000 && sellcoindIndex === -1) {
          // logger.info(
          //   `현제가 : ${coinpicenow}  - sellcoin 인덱스 : ${sellcoindIndex} : ${moment().format(
          //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
          //   )}`
          // );
          if (
            cul >= botdata.sellPlusRate / 100 ||
            cul <= botdata.sellLimitRate / 100
          ) {
            // logger.info(
            //   `변동율 ${cul} -code:${data.code}- 이익실현:${
            //     botdata.sellPlusRate / 100
            //   } - 손실제한:${botdata.sellLimitRate / 100} : ${moment().format(
            //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            //   )}`
            // );
            this.selling = true;
            // logger.info(
            //   `this Selling to ${this.selling} : ${moment().format(
            //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            //   )}`
            // );

            // console.log({ avg_buy_price, nowprice, cul, coinpicenow });
            this.sellcoin.push({ code: data.code });
            // logger.info(
            //   `sellcoin 배열푸쉬 ${data.code} : ${moment().format(
            //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            //   )}`
            // );
            // logger.info(
            //   `매도시도 ${data.code} : ${moment().format(
            //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
            //   )}`
            // );
            // console.log("매도");
            await sellCoin({
              code: data.code,
              price: data.trade_price,
              volume: this.account[accindex].balance,
              type: botdata.selltype,
              botdata,
              botid,
              key,
            })
              .then(result => {
                console.log(result);
                // logger.info(
                //   `매도시도 결과 리턴 ${
                //     result.result.market
                //   } : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                // );
                console.log({
                  selling: this.selling,
                  sellcoin: this.sellcoin,
                });
                let newarray = this.sellcoin.filter(
                  item => item.code !== result.result.market
                );
                console.log(result.result.market);
                this.sellcoin = newarray;
                console.log({
                  selling: this.selling,
                  newarray,
                  sellcoin: this.sellcoin,
                });
                // logger.info(
                //   `this.sellcoin to new Array 변경 : ${moment().format(
                //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                //   )}`
                // );
                this.selling = false;
                console.log(this.selling);
                // logger.info(
                //   `this.selling to false : ${moment().format(
                //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                //   )}`
                // );
              })
              .catch(error => {});
          }
        }
      }
    };
  }

  async startRestApi({ botdata, marketData, botid, key }) {
    // logger.info(
    //   `REST API 스타트 : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
    // );
    // ticker api
    this.checkTicker = setInterval(() => {
      // 초당 10회
      getTicker({ markets: marketData, key }).then(result => {
        // logger.info(
        //   `getTicker 1 sec : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
        // );
        let newdata = JSON.parse(result);
        newdata.sort((a, b) => {
          if (a.signed_change_rate < b.signed_change_rate) {
            return 1;
          }
          if (a.signed_change_rate === b.signed_change_rate) {
            return 0;
          }
          if (a.signed_change_rate > b.signed_change_rate) {
            return -1;
          }
        });
        // console.log(newdata);
        this.tickerArray = newdata;
      });
    }, 1000);
    const culPrice = ({ data, tickerArray }) => {
      return new Promise((resolve, reject) => {
        let sum = [];
        // console.log(data);
        // console.log(tickerArray);
        if (data.length >= 1 && tickerArray.length > 0) {
          // console.log("시작");
          for (let i = 0; i < data.length; i++) {
            let findindex = tickerArray.findIndex(
              item =>
                item.market === `${data[i].unit_currency}-${data[i].currency}`
            );

            if (data[i].currency !== "KRW" && findindex > -1) {
              sum.push({
                code: `${data[i].unit_currency}-${data[i].currency}`,
                price: Number(data[i].avg_buy_price),
                balance: Number(data[i].balance),
                newprice: tickerArray[findindex].trade_price,
              });
            } else if (data[i].currency === "KRW") {
              sum.push({
                code: `${data[i].unit_currency}-${data[i].currency}`,
                price: 1,
                balance: Number(data[i].balance),
              });
            }
          }
        }
        // console.log(sum);
        let startSum = 0;
        for (let i = 0; i < sum.length; i++) {
          if (sum[i].code === "KRW-KRW") {
            startSum += sum[i].balance;
          } else {
            startSum += sum[i].price * sum[i].balance;
          }
        }
        resolve(startSum);
      });
    };
    getAccount({ key }).then(async result => {
      let data = JSON.parse(result);
      // this.firstWon = Number(data[wonindex].balance);
      await getTicker({ markets: marketData, key })
        .then(async result => {
          let newdata = JSON.parse(result);
          return newdata;
        })
        .then(async ticker => {
          await culPrice({ data, tickerArray: ticker }).then(sum => {
            // console.log("계산초기", sum);
            this.firstWon = sum;
          });
        });
    });

    // console.log(startSum, nowSum, botdata.loseCut, cul);

    this.checkAccount = setInterval(() => {
      getAccount({ key }).then(async result => {
        // logger.info(
        //   `GET ACCOUNT 인터벌  : ${moment().format(
        //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
        //   )}`
        // );
        let data = JSON.parse(result);
        // console.log(data);
        this.account = data;
        // 배열을가저와서 filter => !KRW
        let sum = [];

        if (data.length >= 1 && this.tickerArray.length > 0) {
          // console.log("시작");
          for (let i = 0; i < data.length; i++) {
            let findindex = this.tickerArray.findIndex(
              item =>
                item.market === `${data[i].unit_currency}-${data[i].currency}`
            );
            let findaginIndex = this.buyAgainArray.findIndex(
              item =>
                item.code === `${data[i].unit_currency}-${data[i].currency}`
            );
            if (findaginIndex === -1) {
              this.buyAgainArray.push({
                code: `${data[i].unit_currency}-${data[i].currency}`,
              });
            }

            if (data[i].currency !== "KRW" && findindex > -1) {
              sum.push({
                code: `${data[i].unit_currency}-${data[i].currency}`,
                price: Number(data[i].avg_buy_price),
                balance: Number(data[i].balance),
                newprice: this.tickerArray[findindex].trade_price,
              });
            } else if (data[i].currency === "KRW") {
              sum.push({
                code: `${data[i].unit_currency}-${data[i].currency}`,
                price: 1,
                balance: Number(data[i].balance),
              });
            }
          }
        }
        // console.log(sum);
        let startSum = 0;

        for (let i = 0; i < sum.length; i++) {
          if (sum[i].code === "KRW-KRW") {
            startSum += sum[i].balance;
          } else if (sum[i].newprice > 0) {
            startSum += sum[i].newprice * sum[i].balance;
          }
        }
        let cul = (startSum - this.firstWon) / this.firstWon;

        if (cul <= botdata.loseCut / 100 && startSum > 0) {
          logger.info(
            `로스컷 발동 현재자산:${startSum}-시작자산:${
              this.firstWon
            } losecut:${cul} : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}`
          );
          const promise = this.account.map(item => {
            if (item.currency !== "KRW") {
              let findindex = this.tickerArray.findIndex(
                item => item.market === `${item.unit_currency}-${item.currency}`
              );
              if (findindex > 0) {
                this.selling = true;
                this.sellcoin.push({
                  code: `${item.unit_currency}-${item.currency}`,
                });
                sellCoin({
                  code: `${item.unit_currency}-${item.currency}`,
                  price: this.tickerArray[findindex].trade_price,
                  volume: item.balance,
                  type: "limit", // limit,market
                  botdata,
                  botid,
                  key,
                })
                  .then(async result => {
                    console.log(result);
                    // logger.info(
                    //   `매도시도 결과 리턴 ${
                    //     result.result.market
                    //   } : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ")}`
                    // );
                    console.log({
                      selling: this.selling,
                      sellcoin: this.sellcoin,
                    });
                    let newarray = this.sellcoin.filter(
                      item => item.code !== result.result.market
                    );
                    console.log(result.result.market);
                    this.sellcoin = newarray;
                    console.log({
                      selling: this.selling,
                      newarray,
                      sellcoin: this.sellcoin,
                    });
                    // logger.info(
                    //   `this.sellcoin to new Array 변경 : ${moment().format(
                    //     "YYYY-MM-DD HH:mm:ss.SSS ZZ"
                    //   )}`
                    // );
                    this.selling = false;
                    console.log(this.selling);
                  })
                  .catch(error => {
                    // 매도주문 취소 또는 매도주문 error
                    // this.orderarray.push(result.uuid);
                    let newarray = this.sellcoin.filter(
                      item => item.code !== result.result.market
                    );
                    this.sellcoin = newarray;
                    console.log(error);
                    // logger.info(
                    //   `매도 시도 실폐 - ${data.code} : ${moment().format(
                    //     "YYYY-MM-DD HH:mm:ss.SSS"
                    //   )}`
                    // );
                  });
              }
            }
          });
          await Promise.all(promise);
        }
      });
    }, 800);

    // 주문 정보저장
    //interval
  }

  close() {
    this.soket.close();
    // logger.info(`upbit soket closed  : ${now}`);
  }
  closeInterval() {
    clearInterval(this.checkAccount);
    clearInterval(this.checkTicker);
    logger.info(
      `upbit interval clear : ${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}`
    );
  }
}

export default bot;
