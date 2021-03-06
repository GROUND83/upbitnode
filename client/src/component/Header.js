import React from "react";
import { logout } from "../helpers/auth";
import firebase from "firebase";

const Header = ({ setStage, stage }) => {
  let user = firebase.auth().currentUser;
  // console.log("유저", user.email);

  const clickLogout = () => {
    if (window.confirm("로그아웃 합니다")) {
      logout();
    } else {
    }
  };
  return (
    <div className="bg-green-600 fixed w-full flex flex-col justify-between z-50">
      <div className="flex flex-row items-center justify-between  h-12 p-3 ">
        <p className="font-bold">AI COIN AUTO DRADING BOT</p>
        <div>
          <p className="font-light">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-row items-center h-10 bg-green-900 p-3 w-full">
        <div className="mr-6 ">
          <button
            onClick={() => setStage("dash")}
            className={`${stage === "dash" && "text-white"} outline-none`}
          >
            대쉬보드
          </button>
        </div>
        <div className="mr-6">
          <button
            onClick={() => setStage("account")}
            className={`${stage === "account" && "text-white"} outline-none`}
          >
            계정설정
          </button>
        </div>
        <div className="mr-6">
          <button
            onClick={() => setStage("bot")}
            className={`${stage === "bot" && "text-white"} outline-none`}
          >
            봇
          </button>
        </div>
        <div className="mr-6">
          <button
            onClick={() => setStage("addbot")}
            className={`${stage === "addbot" && "text-white"} outline-none`}
          >
            봇추가
          </button>
        </div>
        <div className="mr-6">
          <button onClick={() => clickLogout()}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
