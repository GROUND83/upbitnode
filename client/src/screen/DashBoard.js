import React from "react";
import Header from "../component/Header";
import Dash from "./dash/Dash";
import Setting from "./dash/Setting";
import Bot from "./dash/Bot";
import AddBot from "./dash/AddBot";

const DashBoard = () => {
  const [stage, setStage] = React.useState("dash");

  return (
    <div>
      <Header setStage={setStage} stage={stage} />
      <div className="pt-24 px-3">
        {stage === "dash" && <Dash />}
        {stage === "account" && <Setting />}
        {stage === "bot" && <Bot />}
        {stage === "addbot" && <AddBot />}
        {/* {stage === "money" && <Money />} */}
      </div>
    </div>
  );
};

export default DashBoard;
