export const serarchPriceRange = ({ lowprice, highprice, tradprice }) => {
  // console.log({ lowprice, highprice, tradprice });

  return new Promise((resolve, reject) => {
    // console.log("현재가범위", { lowprice, highprice, tradprice });
    if (lowprice <= tradprice && tradprice <= highprice) {
      resolve({ value: true, lowprice, highprice, tradprice });
    } else {
      resolve({ value: false, lowprice, highprice, tradprice });
    }
  });
};

export const serarchHighRange = ({ lowrange, highrange, signedchangerate }) => {
  // console.log("금일 등락률", { lowrange, highrange, signedchangerate });
  return new Promise((resolve, reject) => {
    if (
      lowrange / 100 <= signedchangerate &&
      signedchangerate <= highrange / 100
    ) {
      resolve({
        value: true,
        lowrange: lowrange / 100,
        highrange: highrange / 100,
        signedchangerate,
      });
    } else {
      resolve({
        value: false,
        lowrange: lowrange / 100,
        highrange: highrange / 100,
        signedchangerate,
      });
    }
  });
};

// 일거래량 평균
export const serarchDayVolumeAvg = ({
  daychart,
  dayVolumePercent,
  dayVolumePercentplus,
  acc_trade_volume,
}) => {
  return new Promise((resolve, reject) => {
    let sum = 0;
    let avg = 0;
    for (let i = 0; i < daychart.data.length; i++) {
      sum += daychart.data[i].candle_acc_trade_volume;
    }
    avg = sum / daychart.data.length;
    let cul = acc_trade_volume / avg;
    if (dayVolumePercent / 100 <= cul && cul <= dayVolumePercentplus / 100) {
      // console.log("일거래량평균", {
      //   code: daychart.market,
      //   avg,
      //   acc_trade_volume,
      //   cul,
      //   dayVolumePercent: dayVolumePercent / 100,
      //   dayVolumePercentplus: dayVolumePercentplus / 100,
      // });
      resolve({
        value: true,
        dayVolumePercent: dayVolumePercent / 100,
        dayVolumePercentplus: dayVolumePercentplus / 100,
        cul,
      });
    } else {
      resolve({
        value: false,
        dayVolumePercent: dayVolumePercent / 100,
        dayVolumePercentplus: dayVolumePercentplus / 100,
        cul,
      });
    }
  });
};
// 전일 종가가 몇프로로 끝난는가? 일 캔들 - change_rate
export const serarchEndPriceRange = ({
  daychart,
  endpricerange,
  endplowricerange,
}) => {
  let daychartCoin = daychart.data[0];
  let rate = daychartCoin.change_rate;
  return new Promise((resolve, reject) => {
    // console.log("전일 시가대비 전일 종가", {
    //   daychart,
    //   endpricerange,
    //   endplowricerange,
    //   daychartCoin,
    //   rate,
    // });
    if (endplowricerange / 100 <= rate && rate <= endpricerange / 100) {
      resolve({
        value: true,
        endplowricerange: endplowricerange / 100,
        endpricerange: endpricerange / 100,
        rate,
      });
    } else {
      resolve({
        value: false,
        endplowricerange: endplowricerange / 100,
        endpricerange: endpricerange / 100,
        rate,
      });
    }
  });
};

// 전일 최고가 몇프로가 까지 올라갔는가? 전일 고가 high_price
export const serarchLastbyStartPrice = ({
  daychart,
  lastbystartprice,
  lowlastbystartprice,
}) => {
  let daychartCoin = daychart.data[0];
  let highprice = daychartCoin.high_price;
  let startprice = daychartCoin.opening_price;
  let rate = (highprice - startprice) / startprice;

  return new Promise((resolve, reject) => {
    // console.log("전일 최고 변동률", {
    //   daychartCoin,
    //   highprice,
    //   startprice,
    //   daychartCoin,
    //   rate,
    // });
    if (lowlastbystartprice / 100 <= rate && rate <= lastbystartprice / 100) {
      resolve({
        value: true,
        lowlastbystartprice: lowlastbystartprice / 100,
        lastbystartprice: lastbystartprice / 100,
        rate,
      });
    } else {
      resolve({
        value: false,
        lowlastbystartprice: lowlastbystartprice / 100,
        lastbystartprice: lastbystartprice / 100,
        rate,
      });
    }
  });
};

export const priceChangeOrder = ({ tickerArray, botdata, code }) => {
  return new Promise((resolve, reject) => {
    if (tickerArray.length > 0) {
      let firstPriceRate = botdata.firstPriceRate;
      let secondPriceRate = botdata.secondPriceRate;
      let orderindex = tickerArray.findIndex(item => item.market === code);
      let cul = orderindex + 1;
      if (firstPriceRate <= cul && cul <= secondPriceRate) {
        // console.log("등락률순위", cul, data.code);
        resolve({
          value: true,
          firstPriceRate: firstPriceRate,
          secondPriceRate: secondPriceRate,
          cul,
        });
      } else {
        resolve({
          value: false,
          firstPriceRate: firstPriceRate,
          secondPriceRate: secondPriceRate,
          cul,
        });
      }
    }
  });
};

export const gap = ({ realGap, botdata }) => {
  return new Promise((resolve, reject) => {
    let dataHighgap = botdata.gap / 100;
    let dataLowgap = botdata.lowgap / 100;
    if (realGap >= dataHighgap || realGap <= dataLowgap) {
      resolve({
        value: true,
        dataHighgap,
        dataHighgap,
        realGap,
      });
    } else {
      resolve({
        value: false,
        dataHighgap,
        dataHighgap,
        realGap,
      });
    }
  });
};
export const tradeprice = ({ realTradePrice, botdata }) => {
  return new Promise((resolve, reject) => {
    // console.log({ realTradePrice, changeRate: botdata.changeRate / 100 });
    if (realTradePrice >= botdata.changeRate / 100) {
      resolve({
        value: true,
        changeRate: botdata.changeRate / 100,
        realTradePrice,
      });
    } else {
      resolve({
        value: false,
        changeRate: botdata.changeRate / 100,
        realTradePrice,
      });
    }
  });
};
export const tradevolume = ({ realvolume, botdata }) => {
  return new Promise((resolve, reject) => {
    if (realvolume >= botdata.volume / 100) {
      resolve({
        value: true,
        volume: botdata.volume / 100,
        realvolume,
      });
    } else {
      resolve({
        value: false,
        volume: botdata.volume / 100,
        realvolume,
      });
    }
  });
};
