import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Address";
// import { onclickEmailConfirmBtn, signupUser } from "../api/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPersonal, setIsPerisPersonal] = useState(false);
  const [addressDetail, setAddressDetail] = useState("");
  const [addressName, setAddressName] = useState("");
  const [code, setCode] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const { naver } = window;

  useEffect(() => {
    const validEmail = Cookies.get("email");

    if (!validEmail) {
      alert("세션이 유효하지 않습니다.");
      return (window.location = "http://localhost:3200");
    }

    setEmail(validEmail);
  }, []);

  const sendSMS = async (e) => {
    console.log(phoneNumber.length);
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
        if (response.status === 201) {
          alert("문자가 발송됐습니다. 코드를 입력해주세요.");
        } else {
          alert("번호를 확인해주세요.");
        }
      } catch (error) {
        alert(error.message);
        console.error("Error occurred during signup:", error);
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
      alert(error.message);
      console.error("Error occurred during signup:", error);
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
            email,
            isPersonal,
            isAdmin: false,
            phoneNumber,
            nickname,
            address: {
              address: enroll_company.address + addressDetail,
              y,
              x,
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

        if (response.status === 201) {
          alert("회원가입에 성공하였습니다.");
          Cookies.remove("email");
          return (window.location = "http://localhost:3200");
        } else {
          alert(response.message);
          setConfirm("");
          setEmail("");
          setIsPerisPersonal(false);
          setName("");
          setNickname("");
          setPassword("");
          setPhoneNumber("");
        }
      } catch (error) {
        alert(error.message);
        console.error("Error occurred during signup:", error);
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
    <div className="flex flex-col">
      <h2 className="mx-auto mb-5 text-xl font-bold text-center">
        {" "}
        {"회원가입"}
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          required
          onChange={(e) => setConfirm(e.target.value)}
        />
        <input
          type="number"
          placeholder="휴대폰번호"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="button" onClick={sendSMS}>
          인증 번호 발급
        </button>
        <input
          type="number"
          placeholder="코드"
          value={code}
          required
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="button" onClick={codeAuth}>
          인증
        </button>
        <input
          type="nickname"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <div className="address_search">
          <input
            className="user_enroll_text"
            placeholder="주소"
            type="text"
            required={true}
            value={enroll_company.address}
          />
          <input
            placeholder="상세 주소"
            type="text"
            required={true}
            onChange={(e) => setAddressDetail(e.target.value)}
            value={addressDetail}
          />
          <input
            placeholder="주소명"
            type="text"
            required={true}
            onChange={(e) => setAddressName(e.target.value)}
            value={addressName}
          />
          <button type="button" onClick={handleComplete}>
            우편번호 찾기
          </button>
          {popup && (
            <Post
              company={enroll_company}
              setcompany={setEnroll_company}
            ></Post>
          )}
        </div>
        <button
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          type="submit"
        >
          {"회원가입"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
