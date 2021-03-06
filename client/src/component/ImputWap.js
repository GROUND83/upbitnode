import React from "react";
import Switch from "react-switch";

const InputWrap = ({
  name,
  value,
  secondValue,
  func,
  secondfunc,
  type,
  checked,
  switchFunc,
  subtitle,
  option,
  optionValue,
  optionFunc,
  option2,
  option2Value,
  option2Func,
  option3Value,
  option3func,
  placeholder,
}) => {
  return (
    <div className="w-full flex flex-col items-start mt-3 border-b  pb-3 bg-white p-3 rounded-xl shadow-sm">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-bold">{name}</p>
      </div>
      {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
      {type === "range" ? (
        <div className="flex flex-row items-center w-full mt-4">
          <input
            className="px-3 py-1 rounded-full  border  outline-none  "
            type="number"
            value={value}
            onChange={e => func(e.target.value)}
          />
          <p className="ml-3 mr-3 text-green-600">~</p>
          <input
            className="px-3 py-1 rounded-full  border  outline-none"
            type="number"
            value={secondValue}
            onChange={e => secondfunc(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex flex-row items-center w-full mt-3">
          {option && (
            <select
              className="w-1/3 m-1 px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none"
              value={optionValue}
              onChange={e => {
                optionFunc(e.target.value);
              }}
            >
              <option value={option[0]}>
                {option[0] === "high"
                  ? "상승"
                  : option[0] === "limit"
                  ? "지정가"
                  : "원화"}
              </option>
              <option value={option[1]}>
                {option[1] === "down"
                  ? "하락"
                  : option[1] === "marketprice"
                  ? "시장가"
                  : "%"}
              </option>
            </select>
          )}
          {option2 && (
            <div className="flex flex-row items-center">
              <input
                className="w-2/3 px-3 py-1 rounded-full  border  outline-none m-1"
                type="text"
                value={option2Value}
                placeholder={subtitle}
                onChange={e => option2Func(e.target.value)}
              />
            </div>
          )}
          {option2Value && (
            <div className="flex flex-row items-center">
              <input
                className="w-2/3 px-3 py-1 rounded-full  border  outline-none m-1"
                type="text"
                value={option2Value}
                placeholder={subtitle}
                onChange={e => option2Func(e.target.value)}
              />
            </div>
          )}
          {func && (
            <input
              className="w-2/3 px-3 py-1 rounded-full  border  outline-none m-1"
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={e => func(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputWrap;
