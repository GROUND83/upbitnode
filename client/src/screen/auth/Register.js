import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../helpers/auth";
const Register = () => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [code, setCode] = React.useState();

  const handleSubmit = e => {
    console.log("클릭");
    e.preventDefault();
    auth({ email, password }).catch(error => console.log(error));
  };
  return (
    <div className="p-3 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">AI COIN AUTO DRADING BOT</h1>
      <div className="mt-3 flex flex-col items-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center  mt-3">
            <label>Email</label>
            <input
              className="text-black"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center  mt-3">
            <label>Password</label>
            <input
              className="text-black mt-3"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center  mt-3">
            <label>Code</label>
            <input
              className="text-black  mt-3"
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            회원가입
          </button>
        </form>
      </div>

      <Link to="/login" className="mt-3">
        <p>로그인으로</p>
      </Link>
    </div>
  );
};

export default Register;
