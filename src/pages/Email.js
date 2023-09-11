import React, { useState } from "react";
import axios from "axios";

const AuthEmail = () => {
  const [email, setEmail] = useState("");

  const emailValid = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVERURL}/user/emailAuth`,
        {
          email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert(
          "메일로 인증 정보가 발송됐습니다. 메일에서 회원가입을 완료해주세요"
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        return alert(error.response.data.message);
      } else {
        return alert("오류가 발생했습니다. 관리자에게 문의하세요.");
      }
    }
  };

  return (
    <div className="mt-20 p-2 border border-pink-300 rounded-lg bg-white">
      <h1 className="mt-20 mb-10 text-xl font-bold text-center">이메일 인증</h1>
      <form className="flex flex-col gap-4 w-[50%] mx-auto">
        <input
          type="text"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          placeholder="example@example.com"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-[100%] mb-20 bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          type="submit"
          onClick={emailValid}>
          {"인증"}
        </button>
      </form>
    </div>
  );
};

export default AuthEmail;
