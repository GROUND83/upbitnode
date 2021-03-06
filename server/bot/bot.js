import request from "request-promise";
import websocket from "websocket";
import { logger } from "../config/wiston.js";

import SortedArray from "sorted-array-async";
import moment from "moment";
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
      } else {
        // coindata 있으면
        // 마지막가격
        let lastTradePrice = this.coindata[index][
          this.coindata[index].length - 1
        ].trade_price;
        // 현재가격
        let tradePrice = result.trade_price;
        let persent = (tradePrice - lastTradePrice) / lastTradePrice;

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

          this.coindata[index].shift();
          this.coindata[index].push(data);
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
          resolve();
        }
      }
    });
  };

  startBot({ botid, daychart, marketData, botdata, key }) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
    this.soket = new websocket.w3cwebsocket(this.url);
    this.botId = botid;
    this.soket.onerror = function (error) {
      logger.info(`upbitConnection Error ${error}  : ${now}`);
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
      logger.info(`upbit Client Closed : ${now}`);
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
      let sortarrayindex = this.sortarray.findIndex(
        item => item.code === data.code
      );
      if (sortarrayindex > -1) {
        this.sortarray.splice(sortarrayindex, 1, {
          code: data.code,
          signed_change_rate: data.signed_change_rate,
        });
      } else {
        this.sortarray.push({
          code: data.code,
          signed_change_rate: data.signed_change_rate,
        });
      }

      let daychartindex = daychart.findIndex(item => item.market === data.code);
      // 일 거래량 평균
      let serearchDayVolumeAvg = await serarchDayVolumeAvg({
        daychart: daychart[daychartindex],
        dayVolumePercent: botdata.dayVolumePercent,
        dayVolumePercentplus: botdata.dayVolumePercentplus,
        acc_trade_volume: data.acc_trade_volume,
      }).catch(error => console.log(error));

      // 현재가 겁색
      let serearchpricerange = await serarchPriceRange({
        lowprice: botdata.lowprice,
        highprice: botdata.highprice,
        tradprice: data.trade_price,
      }).catch(error => {});

      // 금일 등락률
      let searchhighrange = await serarchHighRange({
        lowrange: botdata.lowrange,
        highrange: botdata.highrange,
        signedchangerate: data.signed_change_rate,
      });

      //전일 시가 대비 전일 종가
      let searchendpricerange = await serarchEndPriceRange({
        daychart: daychart[daychartindex],
        endplowricerange: botdata.endplowricerange,
        endpricerange: botdata.endpricerange,
        code: data.code,
      }).catch(error => {});

      // 전일 최고변동률
      let serarchlaststartprice = await serarchLastbyStartPrice({
        daychart: daychart[daychartindex],
        lowlastbystartprice: botdata.lowlastbystartprice,
        lastbystartprice: botdata.lastbystartprice,
        code: data.code,
      }).catch(error => {});

      // 금일 상승률 순위 ? 1초 tikcer 사용?
      let serearchPricChangeOrder = await priceChangeOrder({
        tickerArray: this.tickerArray,
        botdata,
        code: data.code,
      }).catch(error => {});

      // gap 변동
      let serarchgap = await gap({
        realGap: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].gap,
        botdata,
      }).catch(error => {});
      // console.log("갭변동률", serarchgap());
      // 현재가변동 틱
      let searchtradeprice = await tradeprice({
        realTradePrice: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].avg_trade_price,
        botdata,
      }).catch(error => {});

      // 거래량변동 틱
      let searchtradevolume = await tradevolume({
        realvolume: this.coindata[realtimeindex][
          this.coindata[realtimeindex].length - 1
        ].avg_trade_volume,
        botdata,
      }).catch(error => {});

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
        // 검출 디비저장 botsearchdata
        // 원화
        if (
          accindex < 0 &&
          this.account.length < Number(botdata.maxBuy) + 1 &&
          this.account.length > 0 &&
          tryarrayindex < 0 &&
          !this.buying
        ) {
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
            // console.log({
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
            // 매수시도

            await buyCoin({
              code: data.code,
              price: data.trade_price,
              botdata,
              key,
            })
              .then(async result => {
                if (result.type === "done") {
                  // console.log("매수", result.result.uuid);
                  // 재매수
                  if (botdata.buyAgain) {
                    // this.traybuycoin.push({ code: data.code });
                    let newarray = this.traybuycoin.filter(
                      item => item.code !== result.result.market
                    );
                    this.traybuycoin = newarray;
                  }
                } else {
                  let newarray = this.traybuycoin.filter(
                    item => item.code !== result.result.market
                  );
                  this.traybuycoin = newarray;
                }
                this.buying = false;
              })
              .catch(error => {});
          }
        }
      }

      // 매도 감시
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
          if (
            cul >= botdata.sellPlusRate / 100 ||
            cul <= botdata.sellLimitRate / 100
          ) {
            this.selling = true;
            // console.log({ avg_buy_price, nowprice, cul, coinpicenow });
            this.sellcoin.push({ code: data.code });
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
              .then(async result => {
                let newarray = this.sellcoin.filter(
                  item => item.code !== result.result.market
                );
                this.sellcoin = newarray;
                this.selling = false;
              })
              .catch(error => {});
          }
        }
      }
    };
  }

  async startRestApi({ botdata, marketData, botid, key }) {
    // ticker api
    this.checkTicker = setInterval(() => {
      // 초당 10회
      getTicker({ markets: marketData, key }).then(result => {
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
        // console.log(startSum, nowSum, botdata.loseCut, cul);
        // console.log("로스컷", {
        //   startSum,
        //   firstWon: this.firstWon,
        //   losecut: botdata.loseCut / 100,
        //   cul,
        // });
        if (cul < botdata.loseCut / 100) {
          // 로스컷실행
          const promise = this.account.map(item => {
            if (item.currency !== "KRW") {
              let findindex = this.tickerArray.findIndex(
                item => item.market === `${item.unit_currency}-${item.currency}`
              );
              if (findindex > 0) {
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
                    // 매도 주문 완료
                    this.orderarray.push(result.uuid);

                    let newarray = this.sellcoin.filter(
                      item => item.code !== data.code
                    );
                    this.sellcoin = newarray;
                  })
                  .catch(error => {
                    // 매도주문 취소 또는 매도주문 error
                    // this.orderarray.push(result.uuid);
                    let newarray = this.sellcoin.filter(
                      item => item.code !== data.code
                    );
                    this.sellcoin = newarray;
                    console.log(error);
                    logger.info(
                      `try sell failed - ${data.code}:${moment().format(
                        "YYYY-MM-DD HH:mm:ss.SSS"
                      )}`
                    );
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
    let now = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    clearInterval(this.checkAccount);
    clearInterval(this.checkTicker);
    logger.info(`upbit interval clear : ${now}`);
  }
}

export default bot;
