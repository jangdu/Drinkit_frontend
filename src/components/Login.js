import React, { useState } from "react";
// import { loginUser } from '../api/auth';
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
        alert("Login Success !");
        window.location.reload();
      } else {
        const data = await response.json();
        console.log(data);
      }
      document.cookie = `AccessToken=Bearer ${response.data.accessToken}; Secure; SameSite=None;`;
      document.cookie = `RefreshToken=Bearer ${response.data.refreshToken}; Secure; SameSite=None;`;
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const kakaoLogin = async (e) => {
    e.preventDefault();

    try {
      window.location = `${process.env.REACT_APP_API_SERVERURL}/user/login/kakao`;
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const naverLogin = async (e) => {
    e.preventDefault();

    try {
      window.location = `${process.env.REACT_APP_API_SERVERURL}/user/login/naver`;
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const googleLogin = async (e) => {
    e.preventDefault();

    try {
      window.location = `${process.env.REACT_APP_API_SERVERURL}/user/login/google`;
    } catch (error) {
      alert(error);
      console.error("Error occurred during signup:", error);
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    window.location = `${process.env.REACT_APP_MAINURL}/authEmail`;
  };

  return (
    <div>
      <h2 className="mx-auto mb-5 text-xl font-bold text-center">로그인</h2>
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
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
        >
          로그인
        </button>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={kakaoLogin}
        >
          카카오 로그인
        </button>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={naverLogin}
        >
          네이버 로그인
        </button>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={googleLogin}
        >
          구글 로그인
        </button>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          onClick={signup}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
