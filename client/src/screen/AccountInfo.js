import React from "react";

const AccountInfo = ({ data }) => {
  return (
    <>
      {data.length > 0 &&
        data.map((item, key) => (
          <div key={key} className="p-3 bg-gray-200 m-1 rounded-md">
            <p>{item.currency}</p>
            <p>{item.balance}</p>
          </div>
        ))}
    </>
  );
};

export default AccountInfo;
