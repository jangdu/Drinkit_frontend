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
  const [isAdmin, setIsAdmin] = useState(false);
  const [location, setLocation] = useState("");
  const [newStore, setNewStore] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("비빌번호를 확인해주세요!");
      setPassword("");
      setConfirm("");
      return;
    }
    const userData = { name, password, confirmPassword: confirm, email, phoneNumber, nickname, isAdmin, location };
    try {
      if (isUpdateProfile) {
        await axios.put(
          `${process.env.REACT_APP_API_SERVERURL}/user/authenticate`,
          { name, email, phoneNumber, nickname, location },
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
        const response = await fetch(`${process.env.REACT_APP_API_SERVERURL}/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.status === 201) {
          const data = await response.json();
          alert(data.message);
          window.location.reload();
        } else {
          const data = await response.json();
          alert(data.message);
          setConfirm("");
          setEmail("");
          setIsAdmin(false);
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

  // 삭제버튼 클릭시 함수
  const onClickDelBtn = () => {
    // 삭제 로직 구현
    console.log("삭제");

    // 쿠키삭제
    // Cookies.remove('Authorization');
    // 새로고침
    // window.location.reload();
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
        {/* <input type="text" placeholder="이메일 인증" value={emailConfirm} required onChange={(e) => setEmailConfirm(e.target.value)} /> */}
        <input type="nickname" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="지역" value={location} onChange={(e) => setLocation(e.target.value)} />
        {!isUpdateProfile && (
          <div>
            <span className="me-5">사장님이세요?</span>
            <input type="checkbox" placeholder="사장님이세요?" value={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          </div>
        )}
        {/* <input type="email" placeholder="프로필 이미지" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} /> */}
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
