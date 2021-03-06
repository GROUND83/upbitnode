import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/ko";
import "firebase/auth";

import Login from "./screen/auth/Login";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
// const firebaseApp = firebase.initializeApp(firebaseConfig);
// const firebaseAppAuth = firebaseApp.auth();
import { firebaseAuth } from "../src/constants";
import DashBoard from "./screen/DashBoard";
import Home from "./screen/Home";
import Register from "./screen/auth/Register";

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
const PublicRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
};

const App = () => {
  const [authed, setAuthed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const auth = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        console.log("유저", user);
        setAuthed(true);
        setLoading(false);
      } else {
        console.log("유저", user);
        setAuthed(false);
        setLoading(false);
      }
    });
    return () => {
      auth();
    };
  }, []);
  // const [account, setAccount] = React.useState([]);
  // const [market, setMarket] = React.useState([]);
  // const [range, setRange] = React.useState([]);
  // const [ifstatus, setIfstatus] = React.useState([]);
  // const clickadd = () => {
  //   fetch("api/infostatus", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title: "test",
  //       author: "tester",
  //       lowprice: 100,
  //       highprice: 10000,
  //       endpricerange: 30,
  //       lastbystartprice: 30,
  //       highrange: 20,
  //       gap: 3,
  //       gaptype: "high",
  //       work: false,
  //       published_date: "2021-02-20",
  //     }),
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("리액트", JSON.parse(data));
  //       let account = JSON.parse(data);
  //       setAccount(account);
  //     });
  // };
  // const clickAccount = () => {
  //   fetch("api/upaccount")
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("리액트", JSON.parse(data));
  //       let account = JSON.parse(data);
  //       setAccount(account);
  //     });
  // };
  // const clickfindOrder = () => {
  //   fetch(`api/findOrder`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("리액트", JSON.parse(data));
  //       let account = JSON.parse(data);
  //       setAccount(account);
  //     });
  // };
  // // upbit api 직접호출
  // const findAll = () => {
  //   const options = { method: "GET" };
  //   fetch("https://api.upbit.com/v1/market/all?isDetails=true", options)
  //     .then(response => response.json())
  //     .then(result => {
  //       // console.log(result);
  //       let finder = result.filter(
  //         el => el.market.includes("KRW-") && el.market_warning === "NONE"
  //       );
  //       console.log(finder);
  //       setMarket(finder);
  //     })
  //     .catch(err => console.error(err));
  // };
  // // upbit api 직접호출 1.주가범위 - 종가,시작가
  // // 초당 10회 분당 600회
  // const findRange = () => {
  //   const options = { method: "GET" };
  //   console.log(market);
  //   // 마켓 스트링 검색
  //   let marketStrins = "";
  //   for (let i = 0; i < market.length; i++) {
  //     if (i === 0) {
  //       marketStrins += `${market[i].market}`;
  //     } else {
  //       marketStrins += `,${market[i].market}`;
  //     }
  //   }
  //   console.log(marketStrins);
  //   fetch(`https://api.upbit.com/v1/ticker?markets=${marketStrins}`, options)
  //     .then(response => response.json())
  //     .then(result => {
  //       console.log(result);
  //       // 종가
  //       // 시가
  //       let range = result.filter(
  //         item =>
  //           item.prev_closing_price >= 10000 && item.prev_closing_price <= 20000
  //       );
  //       console.log(range);
  //       setRange(range);
  //     })
  //     .catch(err => console.error(err));
  // };
  // 2.주가등락률
  // const changeRate = () => {
  //   const options = { method: "GET" };
  //   console.log(market);
  //   // 마켓 스트링 검색
  //   let marketStrins = "";
  //   for (let i = 0; i < market.length; i++) {
  //     if (i === 0) {
  //       marketStrins += `${market[i].market}`;
  //     } else {
  //       marketStrins += `,${market[i].market}`;
  //     }
  //   }
  //   fetch(
  //     `https://api.upbit.com/v1/candles/days?count=1&market=${marketStrins}`,
  //     options
  //   )
  //     .then(response => response.json())
  //     .then(result => console.log(result))
  //     .catch(err => console.error(err));
  // };
  return loading ? (
    <h1>loading</h1>
  ) : (
    <BrowserRouter>
      <div className="bg-gray-200 text-black min-h-screen">
        <Switch>
          <PrivateRoute path="/" exact component={Home} />
          <PublicRoute authed={authed} path="/login" component={Login} />
          <PublicRoute authed={authed} path="/register" component={Register} />
          <PrivateRoute
            authed={authed}
            path="/dashboard"
            component={DashBoard}
          />
          <PrivateRoute authed={authed} path="/setting" component={DashBoard} />
          <Route path="*">
            <h3 className="text-white">No Match</h3>
          </Route>
        </Switch>
      </div>
      <ToastContainer autoClose={2000} position="top-center" />
    </BrowserRouter>
  );
};

export default App;
