import React from "react";
import BotWrapper from "../../component/warpper/BotWrapper";
import Websocket from "react-websocket";
import moment from "moment";
import { toast } from "react-toastify";
import firebase from "firebase";
import { store } from "../../constants";

const Bot = () => {
  const [botdata, setBotData] = React.useState();
  const [tradeData, setTradeData] = React.useState();
  // const connectWs = data => {
  //   let coindata = JSON.parse(data);
  //   console.log(JSON.parse(data));
  //   let time = moment();
  //   if (coindata.type === "buy") {
  //     toast.success("매수");
  //     console.log(coindata.data);
  //   } else {
  //     console.log(coindata);
  //     setSoketData({ time, data: coindata.data });
  //   }
  // };

  React.useEffect(() => {
    let Botdoc = store
      .collection("bot")
      .where("auth", "==", firebase.auth().currentUser.email)
      .onSnapshot(
        docSnapshot => {
          console.log(`Received doc snapshot: ${docSnapshot}`);
          console.log(docSnapshot.docs);
          docSnapshot.forEach(doc => {
            console.log(doc.data());
          });
          setBotData(docSnapshot);
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );

    return () => {
      Botdoc();
    };
  }, []);
  return (
    <div className="flex flex-col items-start p-3">
      {/* <Websocket
        url="ws://localhost:8010/"
        onMessage={data => connectWs(data)}
      /> */}
      <div className="flex flex-row items-center justify-between w-full">
        <p className="font-bold text-2xl">봇 리스트</p>
      </div>
      <div className="flex flex-col items-center mt-3 w-full">
        {botdata && botdata.docs.length > 0 ? (
          <div className="flex flex-col w-full">
            {botdata.docs.map((doc, index) => (
              <BotWrapper doc={doc} key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start w-full">
            <p>봇이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bot;
