import React from "react";
import firebase from "firebase";
import { store } from "../../constants";
import IfWrapper from "../../component/warpper/IfWrapper";
import Modal from "react-modal";
import { AiFillCloseCircle } from "react-icons/ai";
import Switch from "react-switch";
const If = ({ ifstatusdata }) => {
  const [title, setTitle] = React.useState();
  const [first, setFirst] = React.useState(false);
  const [second, setSecond] = React.useState(false);
  const [third, setThird] = React.useState(false);
  const [four, setFour] = React.useState(false);
  const [five, setFive] = React.useState(false);
  const [lowprice, setLowPrice] = React.useState();
  const [highprice, sethighPrice] = React.useState();
  const [endpricerange, setEndpriceRange] = React.useState();
  const [lastbystartprice, setLastByStartPrice] = React.useState();
  const [highrange, setHighRange] = React.useState();
  const [gap, setGap] = React.useState();
  const [gaptype, setGapType] = React.useState("high");
  const [isOpen, setIsOpen] = React.useState(false);

  const clickadd = async () => {
    await store
      .collection("ifstatus")
      .add({
        auth: firebase.auth().currentUser.email,
        title,
        lowprice: Number(lowprice),
        highprice: Number(highprice),
        endpricerange: Number(endpricerange),
        lastbystartprice: Number(lastbystartprice),
        highrange: Number(highrange),
        gap: Number(gap),
        gaptype,
      })
      .then(() => {
        setFirst("");
        setSecond("");
        setThird("");
        setFour("");
        setFive("");
        setLowPrice("");
        sethighPrice("");
        setEndpriceRange("");
        setLastByStartPrice("");
        setHighRange("");
        setGap("");
        setGapType("hign");
        setIsOpen(false);
      })
      .catch(error => console.log(error));
  };
  React.useEffect(() => {
    console.log(ifstatusdata.docs.length);
    ifstatusdata.forEach(doc => {
      console.log(doc.data());
    });
  }, [ifstatusdata]);
  return (
    <div className="flex flex-col items-start">
      <p className="font-bold text-2xl">?????????</p>
      <div className="flex flex-col mt-3 w-full">
        {ifstatusdata.docs.length > 0 ? (
          <div className="flex flex-col">
            <p>??????????????????</p>
            <div className="flex flex-row flex-wrap items-center mt-3">
              {ifstatusdata.docs.map((doc, index) => (
                <IfWrapper doc={doc} key={index} />
              ))}
              <div
                className="m-2 flex flex-col items-center justify-center border border-gray-700 p-3  rounded-xl shadow-md"
                style={{ minHeight: 400, minWidth: 250 }}
                onClick={() => setIsOpen(true)}
              >
                <p className="mt-3">????????? ??????</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start w-full">
            <p>????????? ???????????? ????????????.</p>

            <div
              className="m-2 flex flex-col items-center justify-center border border-gray-700 p-3  rounded-xl shadow-md"
              style={{ minHeight: 400, minWidth: 250 }}
              onClick={() => setIsOpen(true)}
            >
              <p className="mt-3">????????? ??????</p>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.8)" },
          content: {
            background: "#111827",
          },
        }}
      >
        <div className="flex flex-col w-full bg-gray-900 ">
          <div className="self-end" onClick={() => setIsOpen(false)}>
            <AiFillCloseCircle className="text-white text-3xl" />
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <p className="text-green-600 font-bold">????????? ?????????</p>
            <div className="flex flex-row items-center w-full mt-3">
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setFirst(checked)}
              checked={first}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">1. ?????? ????????? ?????? ??????</p>
            <div className="flex flex-row items-center w-full mt-3">
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none"
                type="text"
                value={lowprice}
                onChange={e => setLowPrice(e.target.value)}
              />
              <p className="ml-3 text-green-600">?????? </p>
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none ml-3"
                type="text"
                value={highprice}
                onChange={e => sethighPrice(e.target.value)}
              />
              <p className="ml-3 text-green-600">?????? </p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setSecond(checked)}
              checked={second}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">2. ???????????? ?????? ?????????</p>
            <div className="flex flex-row items-center w-full mt-3">
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none "
                type="text"
                value={endpricerange}
                onChange={e => setEndpriceRange(e.target.value)}
              />
              <p className="ml-3 text-green-600">
                % ????????? ???????????? ????????????.{" "}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setThird(checked)}
              checked={third}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">?????? ????????? ?????? ?????????</p>
            <div className="flex flex-row items-center w-full mt-3">
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none "
                type="text"
                value={lastbystartprice}
                onChange={e => setLastByStartPrice(e.target.value)}
              />
              <p className="ml-3 text-green-600">
                % ????????? ???????????? ????????????.{" "}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setFour(checked)}
              checked={four}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">?????? ?????????</p>
            <div className="flex flex-row items-center w-full mt-3">
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none "
                type="text"
                value={highrange}
                onChange={e => setHighRange(e.target.value)}
              />
              <p className="ml-3 text-green-600">
                % ????????? ???????????? ????????????.{" "}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setFive(checked)}
              checked={five}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">?????? 1?????? ?????? ?????? GAP</p>
            <div className="flex flex-row items-center w-full mt-3">
              <select
                className="px-6 py-2 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none"
                value={gaptype}
                onChange={e => setGapType(e.target.value)}
              >
                <option value="high">?????????</option>
                <option value="low">?????????</option>
              </select>
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none ml-3"
                type="text"
                value={gap}
                onChange={e => setGap(e.target.value)}
              />
              <p className="ml-3 text-green-600">%</p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 w-full  rounded-xl mt-3">
            <Switch
              onChange={checked => setFive(checked)}
              checked={five}
              onColor="#059669"
            />
            <p className="text-green-600 font-bold">
              ??? ?????????(???,???,???) ????????? ????????? ?????? - ?????? ???????????? ????????? ???
              ?????????(???,???,???) ?????? ????????? - ?????? ?????? ?????????
            </p>
            <div className="flex flex-row items-center w-full mt-3">
              <select
                className="px-6 py-2 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none"
                value={gaptype}
                onChange={e => setGapType(e.target.value)}
              >
                <option value="high">?????????</option>
                <option value="low">?????????</option>
              </select>
              <input
                className="px-3 py-1 rounded-full text-green-500 bg-gray-700 border border-green-500 outline-none ml-3"
                type="text"
                value={gap}
                onChange={e => setGap(e.target.value)}
              />
              <p className="ml-3 text-green-600">%</p>
            </div>
          </div>
          <div
            className="flex flex-row items-center w-full mt-3 bg-green-500 p-3 justify-center rounded-xl"
            onClick={() => clickadd()}
          >
            <p>????????? ??????</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default If;
