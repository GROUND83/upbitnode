import React, { Component } from "react";

const IfWrapper = ({ doc }) => {
  return (
    <div
      className="flex flex-col items-start bg-gray-700 p-3  rounded-xl shadow-md m-2"
      style={{ minHeight: 400, minWidth: 250 }}
    >
      <div>
        <p className="text-md">{doc.data().title}</p>
      </div>
      {/* 1 */}
      <div className="text-sm mt-3">
        <p>금일 금액 검색</p>
        <p>{doc.data().lowprice}원 이상</p>
        <p>{doc.data().highprice}원 이하</p>
      </div>
      <div className="text-sm mt-3">
        <p>전일종가 - 시작가 대비 종가</p>
        <p>{doc.data().endpricerange}%</p>
      </div>
      <div className="text-sm mt-3">
        <p>전날 시작가 대비 전날 최고치 - 전일 최고가</p>
        <p>{doc.data().lastbystartprice}%</p>
      </div>
      <div className="text-sm mt-3">
        <p>금일 상승률</p>
        <p>{doc.data().highrange}%</p>
      </div>
      <div className="text-sm mt-3">
        <p>금일 상승 하락 GAP - 실시간</p>
        <p>{doc.data().gaptype === "low" ? "하락" : "상승"}</p>
        <p>{doc.data().gap}%</p>
      </div>
    </div>
  );
};

export default IfWrapper;
