import React from "react";
import firebase from "firebase";
import { store } from "../../constants";
import moment from "moment";
import Switch from "react-switch";

import { toast } from "react-toastify";

const AddBot = () => {
  const [title, setTitle] = React.useState(); //봇타이틀
  const [firstPriceRate, setFirstPriceRate] = React.useState(); // 등락률순위
  const [secondPriceRate, setSecondPriceRate] = React.useState(); // 등락률순위
  const [dayVolumeCont, setDayVolumeCount] = React.useState(); // 일 거래량 평균 평균 count 최대 200
  const [dayVolumePercent, setDayVolumePercent] = React.useState(); //low일등락률
  const [dayVolumePercentplus, setDayVolumePercentPlus] = React.useState(); //high일등락률
  const [lowprice, setLowPrice] = React.useState(); // low 금액 검색
  const [highprice, sethighPrice] = React.useState(); // hign 금액 검색
  const [endpricerange, setEndpriceRange] = React.useState(); //전일 최고 변동률
  const [endplowricerange, setEndLowpriceRange] = React.useState(); // 전일 최고 변동률
  const [lowlastbystartprice, setLowLastByStartPrice] = React.useState(); // 전일 시가대비 전일 종가
  const [lastbystartprice, setLastByStartPrice] = React.useState(); // 전일 시가대비 전일 종가
  const [lowrange, setLowRange] = React.useState(); // 금일 등락률
  const [highrange, setHighRange] = React.useState(); // 금일 등락률
  // const [highrange, setHighRange] = React.useState(); // 금일 상승률 타입
  const [gap, setGap] = React.useState(); //겝
  const [lowgap, setLowGap] = React.useState(); //겝
  const [gaptype, setGapType] = React.useState("high"); // 겝타잎
  // 거래량 변동률 타입
  const [volume, setVolume] = React.useState(); // 거래량 변동률 값
  const [volumeTypeValue, setVolumeTypeValue] = React.useState(); // 몇틱?
  // 금액변동
  // const [rateType, setRateType] = React.useState(); // 금액변동률 타입

  const [changeRate, setChangeRate] = React.useState(); // 거래금액 변동률

  const [maxBuy, setMaxBuy] = React.useState(); // 최대 구매 종목수
  // 종목당 투자금액

  const [maxBaseMoneyType, setMaxBaseMoneyType] = React.useState("price"); // 종목당 투자금액 타입
  const [maxBaseMoney, setMaxBaseMoney] = React.useState(); // 종목당 투자금액
  const [loseCut, setLoseCut] = React.useState(); // 로스컷
  const [buyAgain, setBuyAgaing] = React.useState(false); // 재주문
  const [orderFailed, setOrderFailed] = React.useState(true); // 주문실폐 몇초 후 확인한다
  // 매수
  const [buytype, setBuyType] = React.useState("limit"); // 매수타입 price
  const [buyRate, setBuyRate] = React.useState(); // 매수호가
  const [selltype, setSellType] = React.useState("limit"); // 매도타입  market
  const [sellRate, setSellRate] = React.useState(); // 매도호가

  // 매도
  const [sellPlusRate, setSellPlusRate] = React.useState(); // 이익실현
  const [sellLimitRate, setSellLimitRate] = React.useState(); // 손실제한

  const clickadd = async () => {
    // console.log(typeof maxNum);
    await store
      .collection("bot")
      .add({
        auth: firebase.auth().currentUser.email,
        title,
        firstPriceRate: Number(firstPriceRate),
        secondPriceRate: Number(secondPriceRate),
        dayVolumeCont: Number(dayVolumeCont),
        dayVolumePercent: Number(dayVolumePercent),
        dayVolumePercentplus: Number(dayVolumePercentplus),

        lowprice: Number(lowprice),
        highprice: Number(highprice),
        endpricerange: Number(endpricerange),
        endplowricerange: Number(endplowricerange),
        lowlastbystartprice: Number(lowlastbystartprice),
        lastbystartprice: Number(lastbystartprice),
        lowrange: Number(lowrange),
        highrange: Number(highrange),
        gap: Number(gap),
        lowgap: Number(lowgap),
        gaptype,
        volume: Number(volume),
        volumeTypeValue: Number(volumeTypeValue),
        changeRate: Number(changeRate),
        maxBuy: Number(maxBuy),
        maxBaseMoneyType,
        maxBaseMoney: Number(maxBaseMoney),
        loseCut: Number(loseCut),
        buyAgain,
        orderFailed,
        buytype,
        buyRate: Number(buyRate),
        selltype,
        sellRate: Number(sellRate),
        sellPlusRate: Number(sellPlusRate),
        sellLimitRate: Number(sellLimitRate),
        work: false,
        canplay: true,
        created: moment().unix(),
      })
      .then(doc => {
        setTitle("");
        setFirstPriceRate("");
        setSecondPriceRate("");
        setDayVolumeCount("");
        setDayVolumePercent("");
        setDayVolumePercentPlus("");

        setLowPrice("");
        sethighPrice("");
        setEndpriceRange("");
        setEndLowpriceRange("");
        setLowLastByStartPrice("");
        setLastByStartPrice("");
        setLowRange("");

        setHighRange("");
        setGap("");
        setLowGap("");
        setGapType("");

        setVolume("");
        setVolumeTypeValue("");

        setChangeRate("");
        setMaxBuy("");
        setMaxBaseMoneyType("");
        setMaxBaseMoney("");
        setLoseCut("");
        setBuyAgaing("");
        setOrderFailed("");
        setBuyType("");
        setBuyRate("");
        setSellType("");
        setSellRate("");
        setSellPlusRate("");
        setSellLimitRate("");
        toast.success("봇이 성공적으로 추가되었습니다.");
      })
      .catch(error => console.log(error));
  };
  React.useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-start  pb-12">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-bold text-2xl">봇 추가</p>
      </div>
      <div className="flex flex-col w-full ">
        {/* 봇타이틀 */}
        <div className="w-full flex flex-col items-start mt-3 border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
          <div className="flex flex-col items-start justify-between w-full">
            <p className="font-bold">봇 타이틀</p>
            <input
              className="w-full px-3 py-1 rounded-full  border outline-none mt-2"
              type="text"
              value={title}
              placeholder={"봇 타이틀을 입력하세요"}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-6 gap-4 mt-4">
          {/* 등락률 순위 */}
          <div className="md:col-span-3 w-full flex flex-col items-start border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">등락률 순위</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={firstPriceRate}
                  placeholder=""
                  onChange={e => setFirstPriceRate(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">~</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={secondPriceRate}
                  placeholder=""
                  onChange={e => setSecondPriceRate(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 등락률 순위 */}
          <div className="md:col-span-3 w-full flex flex-col items-start border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">일 거래량 평균</p>
              </div>
              <div className="flex flex-col items-start mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={dayVolumeCont}
                  placeholder="몇일 최대 200"
                  onChange={e => setDayVolumeCount(e.target.value)}
                />
                <div className="flex flex-row mt-2">
                  <input
                    className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                    type="number"
                    value={dayVolumePercent}
                    placeholder="%"
                    onChange={e => setDayVolumePercent(e.target.value)}
                  />
                  <p className="ml-3 mr-3 text-gray-600">~</p>
                  <input
                    className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                    type="number"
                    value={dayVolumePercentplus}
                    placeholder="%"
                    onChange={e => setDayVolumePercentPlus(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 현재가 범위검색 */}
          <div className="md:col-span-3 w-full flex flex-col items-start border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">현재가 검색 범위</p>
                <p>원 단위 최대 입력 모두 검색</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  "
                  type="number"
                  value={lowprice}
                  onChange={e => setLowPrice(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">~</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none"
                  type="number"
                  value={highprice}
                  onChange={e => sethighPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 금일 등락률 */}
          <div className="md:col-span-3 w-full flex flex-col items-start border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">금일 등락률</p>
                <p>% 이상은 검색하지 않습니다</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={lowrange}
                  placeholder="-%"
                  onChange={e => setLowRange(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">~</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={highrange}
                  placeholder="+%"
                  onChange={e => setHighRange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/*  전일 시가 대비 전일 종가 */}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">전일 시가 대비 전일 종가</p>
                <p>% 이상은 검색하지 않습니다</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={endplowricerange}
                  placeholder="-%"
                  onChange={e => setEndLowpriceRange(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">~</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={endpricerange}
                  placeholder="+%"
                  onChange={e => setEndpriceRange(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/*  전일 시가 대비 전일 종가 */}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">전일 최고 변동률</p>
                <p>% 이상은 검색하지 않습니다</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={lowlastbystartprice}
                  placeholder="-%"
                  onChange={e => setLowLastByStartPrice(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">~</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={lastbystartprice}
                  placeholder="+%"
                  onChange={e => setLastByStartPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 실시간 상승 GAP*/}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">실시간 GAP</p>
                <p>최근 거래 2개를 비교합니다</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={lowgap}
                  placeholder="-%"
                  onChange={e => setLowGap(e.target.value)}
                />
                <p className="ml-3 mr-3 text-gray-600">또는</p>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={gap}
                  placeholder="+%"
                  onChange={e => setGap(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 실시간 상승 GAP*/}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">틱 변화</p>
                <p>최근 틱을 검색합니다</p>
              </div>
              <div className="flex flex-col items-start mt-2 w-full">
                <input
                  className="flex-1  px-3 py-1 rounded-full  border  outline-none mx-1"
                  type="number"
                  value={volumeTypeValue}
                  placeholder="최근 몇 틱"
                  onChange={e => setVolumeTypeValue(e.target.value)}
                />
                <div className="flex flex-row mt-2">
                  <input
                    className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                    type="number"
                    value={volume}
                    placeholder="거래량 %"
                    onChange={e => setVolume(e.target.value)}
                  />
                  <input
                    className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                    type="number"
                    value={changeRate}
                    placeholder="거래금액 %"
                    onChange={e => setChangeRate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 최대 구매 종목수 */}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-gray-300 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">최대 구매 종목수</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={maxBuy}
                  placeholder="최대 구매 종목수"
                  onChange={e => setMaxBuy(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 종목당 투자금액 */}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 bg-gray-300 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">종목당 투자금액</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <select
                  className="flex-1 m-1 px-3 py-1 rounded-full  border border-green-500 outline-none"
                  value={maxBaseMoney}
                  onChange={e => {
                    setMaxBaseMoneyType(e.target.value);
                  }}
                >
                  <option value="price">원화</option>
                  <option value="percent">퍼센트</option>
                </select>
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={maxBaseMoney}
                  placeholder="투자금액"
                  onChange={e => setMaxBaseMoney(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 종목당 투자금액 */}
          <div className="md:col-span-2 w-full flex flex-col items-start  border-b pb-3 bg-gray-300 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">로스컷</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={loseCut}
                  placeholder="전체 손절 %"
                  onChange={e => setLoseCut(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 재매수 */}
          <div className="md:col-span-2 w-full flex flex-col items-start  border-b pb-3 bg-gray-300 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">재매수</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <Switch
                  width={80}
                  onChange={checked => setBuyAgaing(checked)}
                  checked={buyAgain}
                />
                {/* <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={buyAgain}
                  placeholder="전체 손절 %"
                  onChange={e => setBuyAgaing(e.target.value)}
                /> */}
              </div>
            </div>
          </div>
          {/* 미체결 자동 취소 */}
          <div className="md:col-span-2 w-full flex flex-col items-start  border-b pb-3 bg-gray-300 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">미체결 자동 취소</p>
                <p className="">몇초후 확인 주문 취소</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  mx-1"
                  type="number"
                  value={orderFailed}
                  placeholder="초단위 입력"
                  onChange={e => setOrderFailed(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* 매수설정 */}
          <div className="md:col-span-3 w-full flex flex-col items-start  border-b pb-3 border border-red-500 bg-gray-100 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">매수설정</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <select
                  className="flex-1 m-1 px-3 py-1 rounded-full  outline-noneb border border-red-500 "
                  value={buytype}
                  onChange={e => setBuyType(e.target.value)}
                >
                  <option value="limit">현재가</option>
                  <option value="price">시장가</option>
                </select>
                {buytype === "limit" ? (
                  <div>
                    <input
                      type="number"
                      className="flex-1 px-3 py-1 rounded-full   outline-noneb border border-red-500"
                      value={buyRate}
                      placeholder="-1호가, 1호가"
                      onChange={e => setBuyRate(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">매도설정</p>
              </div>
              <div className="flex flex-row items-center mt-2 w-full">
                <select
                  className="flex-1 m-1 px-3 py-1 rounded-full  outline-noneb border border-red-500 "
                  value={selltype}
                  onChange={e => setSellType(e.target.value)}
                >
                  <option value="limit">현재가</option>
                  <option value="market">시장가</option>
                </select>
                {selltype === "limit" ? (
                  <div>
                    <input
                      type="number"
                      className="flex-1 px-3 py-1 rounded-full   outline-noneb border border-red-500"
                      value={sellRate}
                      placeholder="-1호가, 1호가"
                      onChange={e => setSellRate(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* 매도설정 */}
          <div className="md:col-span-3 w-full flex flex-col items-start   pb-3 border border-green-500 bg-gray-100 p-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-start justify-between w-full">
              <div className="flex  flex-row  justify-between w-full">
                <p className="font-bold">매도설정</p>
              </div>
              <div className="flex flex-row items-start w-full mt-3">
                <input
                  className="flex-1 px-3 py-1 rounded-full  border  outline-none  ml-3  border-green-500 "
                  type="number"
                  value={sellPlusRate}
                  placeholder="이익실현 %"
                  onChange={e => setSellPlusRate(e.target.value)}
                />
                <input
                  className="flex-1 px-3 py-1 rounded-full   outline-none ml-3 border border-yellow-500 "
                  type="number"
                  placeholder="손실제한 -%"
                  value={sellLimitRate}
                  onChange={e => setSellLimitRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-green-500 p-3 flex flex-row items-center  justify-center mt-3 w-full  cursor-pointer rounded-full"
          onClick={() => clickadd()}
        >
          <p>봇추가</p>
        </div>
      </div>
    </div>
  );
};

export default AddBot;
