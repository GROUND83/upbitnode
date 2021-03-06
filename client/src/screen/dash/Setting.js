import React from "react";
import firebase from "firebase";
import { store } from "../../constants";
import { toast } from "react-toastify";

const Setting = () => {
  const [setting, setSetting] = React.useState(false);
  const [accesskey, setAccessKey] = React.useState();
  const [secretkey, setSercretKey] = React.useState();
  const [userdatabase, setUserdatabase] = React.useState();
  const clickUpdate = async () => {
    if (accesskey && secretkey) {
      await store
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({ accesskey, secretkey })
        .then(() => {
          toast.success("API 키 업데이트가 성공하였습니다");
          setAccessKey("");
          setSercretKey("");
        })
        .catch(error => toast.error(error));
    }
  };
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
    return () => doc();
  }, []);
  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-xl p-6 md:p-12 w-full">
      <p className="font-bold text-2xl">API 키설정</p>
      <p className="text-sm mt-3">업비트 사이트 마이페이지 에서 발급</p>

      <div className="flex flex-col mt-3 w-full">
        {userdatabase && userdatabase.accesskey ? (
          <div>
            {!setting ? (
              <div className="flex flex-col items-center">
                <p className="text-black bg-gray-300 px-4 py-1 rounded-full  w-full text-center">
                  {userdatabase.accesskey}
                </p>
                <button
                  className="mt-3 bg-green-500 px-3 py-1 rounded-full w-full"
                  onClick={() => setSetting(true)}
                >
                  API 키 업데이트
                </button>
              </div>
            ) : (
              <div className="mt-3 flex flex-col items-center w-full">
                <p>API키 가 아직 없습니다</p>
                <div className="mt-3 flex flex-col items-center w-full">
                  <input
                    className="text-black bg-gray-300 px-3 py-1 rounded-full w-full"
                    type="text"
                    value={accesskey}
                    placeholder="API키를 입력하세요"
                    onChange={e => setAccessKey(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex flex-col items-center w-full">
                  <input
                    className="text-black bg-gray-300 px-3 py-1 rounded-full w-full"
                    type="text"
                    placeholder="SECRETKEY 를 입력하세요"
                    value={secretkey}
                    onChange={e => setSercretKey(e.target.value)}
                  />
                </div>
                <button
                  className="mt-3 bg-green-500 px-3 py-1 w-full rounded-full"
                  onClick={() => clickUpdate()}
                >
                  입력
                </button>
                <button
                  className="mt-3 bg-gray-300 px-3 py-1 w-full rounded-full"
                  onClick={() => setSetting(false)}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-center w-full">
            <p>API키 가 아직 없습니다</p>
            <div className="mt-3 flex flex-col items-center w-full">
              <input
                className="text-black bg-gray-300 px-3 py-1 rounded-full w-full"
                type="text"
                value={accesskey}
                placeholder="API키를 입력하세요"
                onChange={e => setAccessKey(e.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-col items-center w-full">
              <input
                className="text-black bg-gray-300 px-3 py-1 rounded-full w-full"
                type="text"
                placeholder="SECRETKEY 를 입력하세요"
                value={secretkey}
                onChange={e => setSercretKey(e.target.value)}
              />
            </div>
            <button
              className="mt-3 bg-green-500 px-3 py-1 w-full rounded-full"
              onClick={() => clickUpdate()}
            >
              입력
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
