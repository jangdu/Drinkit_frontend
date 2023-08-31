import React, { useState } from "react";
// import { loginUser } from '../api/auth';
import Cookies from "js-cookie";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVERURL}/user/signin`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log(response);
        alert("로그인에 성공했습니다.");
        window.location.reload();
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const kakaoLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVERURL}/user/kakao`);
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const naverLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVERURL}/user/naver`);
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const googleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVERURL}/user/google`);
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">로그인</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="email"
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500">
          로그인
        </button>
      </form>
      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={kakaoLogin}>
          카카오 로그인
        </button>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={naverLogin}>
          네이버 로그인
        </button>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={googleLogin}>
          구글 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
