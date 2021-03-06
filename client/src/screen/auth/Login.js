import React from "react";
import { login, resetPassword } from "../../helpers/auth";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const resetPassWord = () => {
    resetPassword({ email })
      .then(() =>
        console.log("입력하신 이메일로 비밀번호 초기화 링크를 보냈습니다.")
      )
      .catch(error => console.log(error));
  };
  const clickLogin = () => {
    if (email && password) {
      login({ email, password }).catch(error => console.log(error));
    } else {
      console.log("이메일 또는 패스워드를 확인해세요");
    }
  };

  return (
    <div className="p-3 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">AI COIN AUTO DRADING BOT</h1>
      <div className="mt-3 flex flex-col items-center">
        <input
          className="text-black"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="text-black mt-3"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-3  cursor-pointer" onClick={() => clickLogin()}>
        <p>로그인</p>
      </div>
      <Link to="/register" className="mt-3">
        <p>회원가입하기</p>
      </Link>
    </div>
  );
};

export default Login;
