import React from "react";

const ifModal = ({
  setLowPrice,
  sethighPrice,
  setEndpriceRange,
  setLastByStartPrice,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="bg-gray-700 p-3 w-full  rounded-xl">
        <p>check</p>
        <p>당일 현재가 기준 검색</p>
        <div className="flex flex-row items-center w-full mt-3">
          <input
            className="px-3 py-1 rounded-full text-black"
            type="text"
            value={lowprice}
            onChange={e => setLowPrice(e.target.value)}
          />
          <p className="ml-3">이상 </p>
          <input
            className="px-3 py-1 rounded-full text-black ml-3"
            type="text"
            value={highprice}
            onChange={e => sethighPrice(e.target.value)}
          />
          <p className="ml-3">이하 </p>
        </div>
      </div>
      <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
        <p>check</p>
        <p>종가대비 전날 시작가</p>
        <div className="flex flex-row items-center w-full mt-3">
          <input
            className="px-3 py-1 rounded-full text-black"
            type="text"
            value={endpricerange}
            onChange={e => setEndpriceRange(e.target.value)}
          />
          <p className="ml-3">% 이상은 검색하지 않습니다. </p>
        </div>
      </div>
      <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
        <p>check</p>
        <p>전일 최고가 전일 시작가</p>
        <div className="flex flex-row items-center w-full mt-3">
          <input
            className="px-3 py-1 rounded-full text-black"
            type="text"
            value={lastbystartprice}
            onChange={e => setLastByStartPrice(e.target.value)}
          />
          <p className="ml-3">% 이상은 검색하지 않습니다. </p>
        </div>
      </div>
      <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
        <p>check</p>
        <p>당일 상승률</p>
        <div className="flex flex-row items-center w-full mt-3">
          <input
            className="px-3 py-1 rounded-full text-black"
            type="text"
            value={highrange}
            onChange={e => setHighRange(e.target.value)}
          />
          <p className="ml-3">% 이상은 검색하지 않습니다. </p>
        </div>
      </div>
      <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
        <p>check</p>
        <p>당일 1분봉 주기 상승 GAP</p>
        <div className="flex flex-row items-center w-full mt-3">
          <select
            className="px-6 py-2 rounded-full text-black"
            value={gaptype}
            onChange={e => setGapType(e.target.value)}
          >
            <option value="high">상승갭</option>
            <option value="low">하락갭</option>
          </select>
          <input
            className="px-3 py-1 rounded-full text-black ml-3"
            type="text"
            value={gap}
            onChange={e => setGap(e.target.value)}
          />

          <p className="ml-3">%</p>
        </div>
      </div>
    </div>
  );
};
