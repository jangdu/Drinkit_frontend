import Cookies from "js-cookie";
import React, { useState } from "react";
import axios from "axios";
// import { onclickEmailConfirmBtn, signupUser } from "../api/auth";

const Signup = ({ isUpdateProfile }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPersonal, setIsPerisPersonal] = useState(false);
  const [adress, setAdress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("비빌번호를 확인해주세요!");
      setPassword("");
      setConfirm("");
      return;
    }
    const userData = { name, password, confirmPassword: confirm, email, phoneNumber, nickname, isPersonal, adress };
    try {
      if (isUpdateProfile) {
        await axios.put(
          `${process.env.REACT_APP_API_SERVERURL}/user/authenticate`,
          { name, email, phoneNumber, nickname, adress },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        alert("내 정보가 수정되었습니다.");
        window.location.reload();

        // 성공적으로 업로드 후 처리할 로직을 작성하세요.
      } else {
        // 회원가입
        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVERURL}/user/signup`,
          { name, password, confirm, email, isPersonal, isAdmin: false, phoneNumber, nickname, adress },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          const data = await response;
          alert("회원가입에 성공하였습니다.");
          window.location.reload();
        } else {
          const data = await response;
          alert(data.message);
          setConfirm("");
          setEmail("");
          setIsPerisPersonal(false);
          setName("");
          setNickname("");
          setPassword("");
          setPhoneNumber("");
        }
      }
    } catch (error) {
      alert(error.message);
      console.error("Error occurred during signup:", error);
    }
  };

  const onClickDelBtn = () => {
    console.log("삭제");
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-5 mx-auto text-xl font-bold text-center"> {isUpdateProfile ? "회원정보 변경" : "회원가입"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="이름" value={name} required onChange={(e) => setName(e.target.value)} />
        <input type="password" placeholder="비밀번호" value={password} required onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="비밀번호 확인" value={confirm} required onChange={(e) => setConfirm(e.target.value)} />
        <input type="email" placeholder="이메일" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="휴대폰번호" value={phoneNumber} required onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type="nickname" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="지역" value={adress} onChange={(e) => setAdress(e.target.value)} />

        {!isUpdateProfile && (
          <div>
            <span className="me-5">사장님이세요?</span>
            <input type="checkbox" placeholder="사장님이세요?" value={isPersonal} onChange={(e) => setIsPerisPersonal(e.target.checked)} />
          </div>
        )}
        <button className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500" type="submit">
          {isUpdateProfile ? "회원정보 변경" : "회원가입"}
        </button>
      </form>
      {isUpdateProfile && (
        <button className="my-3 w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500" onClick={onClickDelBtn}>
          {"회원 삭제"}
        </button>
      )}
    </div>
  );
};

export default Signup;
