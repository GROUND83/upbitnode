import React from "react";

export const RateTypeValue = ({ value, func, option2Value, option2func }) => {
  return (
    <div className="w-full flex flex-col items-start mt-3 border-b  pb-3 bg-white p-3 rounded-xl shadow-sm">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-bold">현재가 변화</p>
      </div>
      <p className="mt-2 text-green-600">
        퍼센트 | 현재가 평균 | 채결틱 기준 최근 | -100000 전체검색 | BTC ex)
        0.03
      </p>
      <div className="flex flex-row items-center w-full mt-3">
        <input
          className="w-1/3 px-3 py-1 rounded-full  border  outline-none m-1"
          type="number"
          value={option2Value}
          placeholder="최근 몇개 최대 20"
          onChange={e => option2func(e.target.value)}
        />
        <input
          className="w-2/3 px-3 py-1 rounded-full  border  outline-none m-1"
          type="number"
          value={value}
          placeholder="변화량 +-%"
          onChange={e => func(e.target.value)}
        />
      </div>
    </div>
  );
};

export const VolumeTypeValue = ({ value, func, option2Value, option2func }) => {
  return (
    <div className="w-full flex flex-col items-start mt-3 border-b  pb-3 bg-white p-3 rounded-xl shadow-sm">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-bold">거래량 변동</p>
      </div>
      <p className="mt-2 text-green-600">
        퍼센트 | 거래량 평균 | 채결틱 기준 최근 | -100000 전체검색 | BTC ex) 0.1
      </p>
      <div className="flex flex-row items-center w-full mt-3">
        <input
          className="w-1/3 px-3 py-1 rounded-full  border  outline-none m-1"
          type="number"
          value={option2Value}
          placeholder="최근 몇개 최대 20"
          onChange={e => option2func(e.target.value)}
        />
        <input
          className="w-2/3 px-3 py-1 rounded-full  border  outline-none m-1"
          type="number"
          value={value}
          placeholder="변화량 +-%"
          onChange={e => func(e.target.value)}
        />
      </div>
    </div>
  );
};
