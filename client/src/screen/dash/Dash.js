import React from "react";
import firebase from "firebase";
import moment from "moment";
import { store } from "../../constants";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
const Dash = () => {
  const [tradeData, setTradeData] = React.useState([]);
  const [userdatabase, setUserdatabase] = React.useState();
  const [cul, setCul] = React.useState(0);
  const [today, setToday] = React.useState(moment());
  const [newTradeData, setNewTradeData] = React.useState([]);
  React.useEffect(() => {
    let doc = store
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        docSnapshot => {
          console.log(`Received doc snapshot: ${docSnapshot}`);
          console.log(docSnapshot.data());
          setUserdatabase(docSnapshot.data());
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
    let trade = store
      .collection("trade")
      .where("auth", "==", firebase.auth().currentUser.email)
      .onSnapshot(
        docSnapshot => {
          console.log(`Received doc snapshot: ${docSnapshot}`);
          console.log(docSnapshot.docs);
          let newArray = [];
          docSnapshot.forEach(doc => {
            newArray.push(doc.data());
          });
          newArray.sort((a, b) => {
            return moment(b.created_at) - moment(a.created_at);
          });
          setTradeData(newArray);
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
    return () => {
      doc();
      trade();
    };
  }, []);

  React.useEffect(() => {
    console.log(newTradeData, userdatabase);
    // 주문 리스트 불러오기

    let newpriceArray = [];
    let buyprice = 0;
    let setllprice = 0;

    for (let i = 0; i < newTradeData.length; i++) {
      let findexindex = newpriceArray.findIndex(
        item => item[0].market === newTradeData[i].market
      );
      if (findexindex === -1) {
        let arry = [];
        arry.push(newTradeData[i]);
        newpriceArray.push(arry);
      } else {
        newpriceArray[findexindex].push(newTradeData[i]);
      }
    }

    console.log(newpriceArray);
    if (newpriceArray.length > 0) {
      for (let n = 0; n < newpriceArray.length; n++) {
        for (let j = 0; j < newpriceArray[n].length; j++) {
          let bid = newpriceArray[n].filter(item => item.side === "bid");
          let ask = newpriceArray[n].filter(item => item.side === "ask");
          console.log(bid.length, ask.length);
          if (bid.length !== ask.length) {
            //  매수중 첫번째 배열은 빼고 계산
            if (bid.length > ask.length) {
              if (newpriceArray[n][j].side === "bid") {
                if (j !== 0) {
                  buyprice +=
                    newpriceArray[n][j].price * newpriceArray[n][j].volume -
                    newpriceArray[n][j].paid_fee;
                }
              } else if (newpriceArray[n][j].side === "ask") {
                setllprice +=
                  newpriceArray[n][j].price * newpriceArray[n][j].volume -
                  newpriceArray[n][j].paid_fee;
                //  매도 모두 계산
              }
            } else if (bid.length < ask.length) {
              if (newpriceArray[n][j].side === "bid") {
                buyprice +=
                  newpriceArray[n][j].price * newpriceArray[n][j].volume -
                  newpriceArray[n][j].paid_fee;
              } else if (newpriceArray[n][j].side === "ask") {
                if (j !== 0) {
                  setllprice +=
                    newpriceArray[n][j].price * newpriceArray[n][j].volume -
                    newpriceArray[n][j].paid_fee;
                  //  매도 모두 계산
                }
              }
            }
          } else {
            if (newpriceArray[n][j].side === "bid") {
              buyprice +=
                newpriceArray[n][j].price * newpriceArray[n][j].volume -
                newpriceArray[n][j].paid_fee;
            } else if (newpriceArray[n][j].side === "ask") {
              setllprice +=
                newpriceArray[n][j].price * newpriceArray[n][j].volume -
                newpriceArray[n][j].paid_fee;
              //  매도 모두 계산
            }
          }
        }
      }

      console.log({ buyprice, setllprice });
      if (buyprice > 0 && setllprice > 0) {
        let cul = ((setllprice - buyprice) / buyprice) * 100;
        setCul(cul.toFixed(2));
      }
    } else {
      setCul(false);
    }
  }, [newTradeData, userdatabase, cul]);

  const clickPrv = () => {
    console.log(today);
    let newtoday = moment(today).subtract(1, "days");
    setToday(newtoday);
  };
  const clickNext = () => {
    console.log(today);
    let newtoday = moment(today).add(1, "days");
    setToday(newtoday);
  };

  React.useEffect(() => {
    console.log("todya 수정");

    let newTradeData = tradeData.filter(item =>
      moment(moment(item.created_at).format("YYYY-MM-DD")).isSame(
        moment(today).format("YYYY-MM-DD"),
        "day"
      )
    );
    setNewTradeData(newTradeData);
  }, [today, tradeData]);
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-row  items-center mt-3">
        <p className="font-bold text-2xl">대쉬보드</p>
        <div className="ml-3">
          {userdatabase && userdatabase.accesskey ? (
            <div className="px-4 py-1 rounded-full border-green-500 border flex flex-col items-center">
              <p className="text-green-500">API 인증완료</p>
            </div>
          ) : (
            <div className="px-4 py-1 rounded-full border-red-500 border flex flex-col items-center outline-none">
              <p className="text-red-500">
                계정설정을 통해 API KEY를 설정해주세요
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 bg-gray-300 flex flex-col items-start w-full p-3">
        <p className="text-black">투자내역</p>
        <div className="mt-3 bg-gray-100  w-full flex flex-row items-center justify-between py-3 px-12">
          <div onClick={() => clickPrv()}>
            <AiFillCaretLeft className="text-4xl" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-black text-xl mt-3">
              {today.format("YYYY년MM월DD일")}
            </p>
            <div
              onClick={() => setToday(moment())}
              className="border border-green-600 px-6 py-1 rounded-full mt-3"
            >
              <p className="text-green-600">오늘</p>
            </div>
            <p className="text-black mt-3">수익율</p>
            <p className="text-gray-400 mt-1 text-sm">
              당일 매수, 매도 건에 적용됩니다
            </p>

            <div className="mt-3">
              {cul ? (
                <p
                  className={`text-2xl font-bold ${
                    cul >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {cul}%
                </p>
              ) : (
                <p className={"text-2xl "}>거래 내역이 없습니다</p>
              )}
            </div>
          </div>
          <div onClick={() => clickNext()}>
            <AiFillCaretRight className="text-4xl" />
          </div>
        </div>
        <div className="mt-3 bg-gray-100  w-full  flex flex-col items-center p-3">
          <p className="font-bold text-xl border-b w-full text-center pb-3">
            거래 내역
          </p>
          {newTradeData.length > 0 ? (
            <div className="w-full flex flex-col mt-3">
              {newTradeData.map(item => (
                <div className="flex flex-row w-full items-center mt-1">
                  <p
                    className={`text-black ${
                      item.side === "bid" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {item.side === "bid" ? "매수" : "매도"}
                  </p>
                  <p className="text-black ml-1 md:ml-6">{item.market}</p>
                  <p className="text-black  ml-1 md:ml-6">{item.price}</p>
                  <p className="text-black  ml-1 md:ml-6">{item.volume}</p>
                  <p className="text-black  ml-1 md:ml-6">
                    {moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={"text-2xl "}>거래 내역이 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dash;
