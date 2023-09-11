import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Address";
// import { onclickEmailConfirmBtn, signupUser } from "../api/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPersonal, setIsPerisPersonal] = useState(false);
  const [phoneNumberEditable, setPhoneNumberEditable] = useState(true);
  const [addressDetail, setAddressDetail] = useState("");
  const [addressName, setAddressName] = useState("");
  const [code, setCode] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const { naver } = window;

  const sendSMS = async (e) => {
    if (phoneNumber.length === 11 || phoneNumber.length === 10)
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVERURL}/user/phoneAuth`,
          {
            phoneNumber,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.status === 201) {
          setPhoneNumberEditable(false);
          alert("문자가 발송됐습니다. 코드를 입력해주세요.");
        } else {
          alert("번호를 확인해주세요.");
        }
      } catch (error) {
        alert("이미 존재하는 사용자입니다.");
      }
    else return alert("번호가 올바른지 확인해 주세요.");
  };

  const codeAuth = async (e) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVERURL}/user/phoneCodeAuth`,
        {
          phoneNumber,
          code,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        alert("인증 되었습니다.");
        setIsAuth(true);
      } else {
        alert("코드가 올바르지 않습니다.");
      }
    } catch (error) {
      alert("코드가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    let x;
    let y;

    e.preventDefault();

    if (password !== confirm) {
      alert("비빌번호를 확인해주세요!");
      setPassword("");
      setConfirm("");
      return;
    }

    if (!isAuth) {
      return alert("휴대폰 인증이 필요합니다.");
    }

    const handleGeocode = async () => {
      await naver.maps.Service.geocode(
        { query: enroll_company.address },
        async (status, response) => {
          if (status === 200) {
            y = response.v2.addresses[0].y;
            x = response.v2.addresses[0].x;

            await handleRequest();
          } else {
            alert("Something wrong!");
          }
        }
      );
    };

    await handleGeocode();

    const handleRequest = async () => {
      try {
        // 회원가입
        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVERURL}/user/signup`,
          {
            name,
            password,
            confirm,
            isPersonal,
            isAdmin: false,
            phoneNumber,
            nickname,
            address: {
              address: enroll_company.address + addressDetail,
              lat: y,
              lng: x,
              name: addressName,
            },
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //쿠키 없어서 실패
        if (response.status === 302) {
          alert("세션이 유효하지 않습니다. 다시 시도해주세요.");
          return (window.location = `${process.env.REACT_APP_MAINURL}`);
        }
        if (response.status === 201) {
          alert("회원가입에 성공하였습니다.");
          return (window.location = `${process.env.REACT_APP_MAINURL}`);
        } else {
          alert(response.message);
          setConfirm("");
          setIsPerisPersonal(false);
          setName("");
          setNickname("");
          setPassword("");
          setPhoneNumber("");
        }
      } catch (error) {
        alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        return (window.location = `${process.env.REACT_APP_MAINURL}`);
      }
    };
  };

  const [enroll_company, setEnroll_company] = useState({
    address: "",
  });

  const [popup, setPopup] = useState(false);

  const handleComplete = () => {
    setPopup(!popup);
  };
  return (
    <div className="mt-20 p-2 border border-pink-300 rounded-lg bg-white">
      <h2 className="mx-auto mt-5 mb-5 text-xl font-bold text-center">
        {"회원가입"}
      </h2>
      <form
        className="flex flex-col gap-4 w-[50%] mx-auto"
        onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          value={confirm}
          required
          onChange={(e) => setConfirm(e.target.value)}
        />
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="휴대폰번호"
            disabled={!phoneNumberEditable}
            maxLength={11}
            className="p-2 border mr-5 border-pink-300 rounded-lg placeholder:text-gray-500 w-[70%]"
            value={phoneNumber}
            required
            onChange={(e) => {
              const inputText = e.target.value;
              const numericInput = inputText.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
              setPhoneNumber(numericInput);
            }}
          />
          <button
            type="button"
            className="w-40 bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
            onClick={sendSMS}>
            인증 번호 발급
          </button>
        </div>
        <div className="flex flex-row">
          <input
            type="text"
            placeholder="코드"
            className="p-2 border mr-5 border-pink-300 rounded-lg placeholder:text-gray-500 w-[70%]"
            value={code}
            required
            onChange={(e) => {
              const inputText = e.target.value;
              const numericInput = inputText.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
              setCode(numericInput);
            }}
          />
          <button
            type="button"
            className="w-40 bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
            onClick={codeAuth}>
            인증
          </button>
        </div>
        <input
          type="nickname"
          placeholder="닉네임"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className="user_enroll_text p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          placeholder="주소"
          type="text"
          disabled={true}
          required={true}
          value={enroll_company.address}
        />
        <div className="flex flex-row">
          <input
            placeholder="상세 주소"
            className="p-2 border mr-5 border-pink-300 rounded-lg placeholder:text-gray-500 w-[70%]"
            type="text"
            required={true}
            onChange={(e) => setAddressDetail(e.target.value)}
            value={addressDetail}
            style={{ marginRight: "1em" }}
          />
          <button
            type="button"
            className="w-40 bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
            onClick={handleComplete}>
            주소 검색
          </button>
        </div>
        {popup && (
          <Post company={enroll_company} setcompany={setEnroll_company}></Post>
        )}
        <input
          placeholder="주소명"
          type="text"
          required={true}
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          onChange={(e) => setAddressName(e.target.value)}
          value={addressName}
        />
        <button
          className="w-[80%] mx-auto mb-10 bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          type="submit">
          {"회원가입"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
