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
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressName, setAddressName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const { naver } = window;

  useEffect(() => {
    const validEmail = Cookies.get("email");

    if (!validEmail) {
      alert("세션이 유효하지 않습니다.");
      return (window.location = "http://localhost:3200");
    }

    setEmail(validEmail);
  }, []);

  const addressGeocode = async (address) => {
    await naver.maps.Service.geocode(
      { query: address },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something wrong!");
        }
        setLat(response.v2.addresses[0].y);
        setLng(response.v2.addresses[0].x);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("비빌번호를 확인해주세요!");
      setPassword("");
      setConfirm("");
      return;
    }

    setAddress(enroll_company.address);
    addressGeocode(address);
    console.log({
      name,
      password,
      confirm,
      email,
      isPersonal,
      isAdmin: false,
      phoneNumber,
      nickname,
      address: {
        address: address + addressDetail,
        lat,
        lng,
        name: addressName,
      },
    });
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
            address: address + addressDetail,
            lat,
            lng,
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

  const [enroll_company, setEnroll_company] = useState({
    address: "",
  });

  const [popup, setPopup] = useState(false);

  const handleComplete = () => {
    setPopup(!popup);
  };
  return (
    <div className="flex flex-col">
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">
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
          type="text"
          placeholder="휴대폰번호"
          value={phoneNumber}
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
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
              setcompany={setEnroll_company}></Post>
          )}
        </div>
        <button
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500"
          type="submit">
          {"회원가입"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
