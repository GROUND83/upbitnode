import React, { Component } from "react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import moment from "moment";

import { store } from "../../constants";

const BotWrapper = ({ doc }) => {
  // 봇 시작
  const [deleteSetting, setDeleteSetting] = React.useState();

  const startBot = async () => {
    console.log("봇시작");
    await store
      .collection("bot")
      .doc(doc.id)
      .update({ work: true, updated: moment().unix() })
      .then(doc => toast.success("봇이 시작 되었습니다."));
  };
  // 봇 정지
  const stopBot = async () => {
    console.log("봇정지");
    await store
      .collection("bot")
      .doc(doc.id)
      .update({ work: false, updated: moment().unix() })
      .then(doc => toast.info("봇이 중지 되었습니다."));
  };
  const deleteBot = async () => {
    await store
      .collection("bot")
      .doc(doc.id)
      .delete()
      .then(() => {
        toast.info("봇 삭제가 완료되었습니다.");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  };

  const confirmAction = () => {
    if (window.confirm("봇을 삭제합니다.")) {
      deleteBot();
    } else {
    }
  };

  return (
    <div
      className="flex flex-col items-start p-6 rounded-2xl shadow-xl  w-full bg-gray-100 m-2"
      style={{ minHeight: 400 }}
    >
      <div className="flex flex-row items-center justify-between w-full border-b pb-3">
        <p className="text-2xl font-bold">{doc.data().title}</p>
        {/* <p className="text-2xl ">
          {doc.data().canplay ? "로딩완료" : "로딩중"}
        </p> */}
        <div className="flex flex-row items-center self-end">
          {doc.data().work && (
            <ReactLoading
              type={"bars"}
              color={"#059669"}
              height={40}
              width={40}
            />
          )}
          <div className="ml-3">
            {doc.data().work ? (
              <>
                {doc.data().canplay ? (
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => stopBot()}
                    style={{ minWidth: 80 }}
                  >
                    <AiFillPauseCircle className="text-3xl" />
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center"
                    style={{ minWidth: 80 }}
                  >
                    <AiFillPauseCircle className="text-3xl text-gray-500" />
                  </div>
                )}
              </>
            ) : (
              <>
                {doc.data().canplay ? (
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => startBot()}
                    style={{ minWidth: 80 }}
                  >
                    <AiFillPlayCircle className="text-3xl text-green-500" />
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center"
                    style={{ minWidth: 80 }}
                  >
                    <AiFillPlayCircle className="text-3xl text-gray-500" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3  w-full p-3 flex flex-col items-start bg-gray-200 rounded-xl">
        <div className="flex flex-col w-full  p-3 rounded-md">
          <div className="flex flex-col items-start justify-between ">
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">현재가 검색 범위</p>
              <div className="flex flex-row">
                <p>{doc.data().lowprice}원 ~</p>
                <p> {doc.data().highprice}원</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">등락률 순위</p>
              <div className="flex flex-row">
                <p>{doc.data().firstPriceRate}위 ~</p>
                <p> {doc.data().secondPriceRate}위</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">일 거래량 평균</p>
              <div className="flex flex-row">
                <p>{doc.data().dayVolumeCont}일 </p>
                <p> {doc.data().dayVolumePercent}%~</p>
                <p> {doc.data().dayVolumePercentplus}%</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">금일 등락률</p>
              <div className="flex flex-row">
                <p>{doc.data().lowrange}% ~</p>
                <p className="ml-3">{doc.data().highrange}% </p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">전일 시가 대비 전일 종가</p>
              <div className="flex flex-row">
                <p>{doc.data().endplowricerange}% ~</p>
                <p className="ml-3">{doc.data().endpricerange}%</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">전일 최고 변동률</p>
              <div className="flex flex-row">
                <p>{doc.data().lowlastbystartprice}% ~</p>
                <p className="ml-3">{doc.data().lastbystartprice}%</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">실시간 GAP</p>
              <div className="flex flex-row">
                {/* <p>{doc.data().gaptype === "down" ? "하락" : "상승"}</p> */}
                <p className="ml-3">{doc.data().lowgap}%</p>
                <p className="ml-3">또는</p>
                <p className="ml-3">{doc.data().gap}%</p>
              </div>
            </div>

            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">틱 변화</p>
              <div className="flex flex-col items-end md:flex-row">
                <p className="ml-3">{doc.data().volumeTypeValue} 틱</p>
                <div className="flex mt-1 md:mt-0 flex-row ml-3 bg-gray-400 rounded-full px-3">
                  <p>거래량 변동</p>
                  <p className="ml-3">{doc.data().volume}%</p>
                </div>
                <div className="flex mt-1 md:mt-0 flex-row ml-3 bg-gray-400 rounded-full px-3">
                  <p>현재가 변동</p>
                  <p className="ml-3">{doc.data().changeRate}%</p>
                </div>
              </div>
            </div>

            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">조건식 당 최대 구매 종목수</p>
              <p>{doc.data().maxBuy}개</p>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">종목당 투자금액</p>
              <div className="flex flex-row">
                <p>{doc.data().maxBaseMoney.toLocaleString()}</p>
                <p>{doc.data().maxBaseMoneyType === "price" ? "원" : "%"}</p>
              </div>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">로스컷</p>
              <div className="flex flex-row">
                <p>{doc.data().loseCut}%</p>
              </div>
            </div>

            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">재매수</p>
              <p>{doc.data().buyAgain ? "사용" : "사용안함"}</p>
            </div>
            <div className="p-3 flex flex-row items-center  justify-between border-b border-gray-300 w-full">
              <p className="font-bold">미체결 자동 취소</p>
              <p>{doc.data().orderFailed}초</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3  w-full p-3 flex flex-col items-start rounded-xl bg-white border">
        <p>주문 설정</p>
        <div className="flex-1 flex flex-col border  p-2 m-1 text-black w-full rounded-xl">
          <p className="">매수</p>
          <div className="flex flex-row p-3">
            {doc.data().buytype === "limit" ? (
              <div className="flex flex-row">
                <p className="">지정가</p>
                <p className="ml-3">{doc.data().buyRate}호가</p>
              </div>
            ) : (
              <div>
                <p className="">시장가</p>
              </div>
            )}
          </div>
          <p className="">매도</p>
          <div className="flex flex-row p-3">
            {doc.data().selltype === "limit" ? (
              <div className="flex flex-row">
                <p className="">지정가</p>
                <p className="ml-3">{doc.data().sellRate}호가</p>
              </div>
            ) : (
              <div>
                <p className="">시장가</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col border  p-2 m-1 text-black w-full rounded-xl">
          <p className="">매도설정</p>
          <div className="flex flex-row">
            <div className="flex flex-col flex-1  p-3 rounded-md">
              <p className="">이익실현</p>
              <p className="">{doc.data().sellPlusRate}%</p>
            </div>
            <div className="flex flex-col flex-1  p-3 mt-1 rounded-md">
              <p className="">손실제한</p>
              <p className="">{doc.data().sellLimitRate}%</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="mt-3  w-full p-3 flex flex-col bg-red-600 rounded-xl border"
        onClick={() => confirmAction()}
      >
        <div className="flex flex-row items-center justify-center">
          <p className="mr-4 text-white">삭제</p>
        </div>
      </div>
    </div>
  );
};

export default BotWrapper;
