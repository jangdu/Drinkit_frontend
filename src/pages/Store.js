import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Address";
import { useAuthContext } from "../context/AuthContext";
// import { onclickEmailConfirmBtn, signupUser } from "../api/auth";

const Signup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [imgUrls, setImgUrls] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const { user, isLoading } = useAuthContext();
  const { naver } = window;

  useEffect(() => {
    console.log(user);
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

    setAddress(enroll_company.address);
    addressGeocode(address);

    try {
      // 회원가입
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVERURL}/stores`,
        {
          name,
          description,
          businessLicense,
          imgUrls,
          address: address + addressDetail,
          lat,
          lng,
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
        setAddress("");
        setAddressDetail("");
        setBusinessLicense(false);
        setDescription("");
        setImgUrls("");
        setLat("");
        setLng("");
        setName("");
        setEnroll_company("");
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
          type="text"
          placeholder="비밀번호"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="사업자등록번호"
          value={businessLicense}
          required
          onChange={(e) => setBusinessLicense(e.target.value)}
        />
        <input
          type="text"
          placeholder="이미지"
          value={imgUrls}
          required
          onChange={(e) => setImgUrls(e.target.value)}
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
          {"가게 생성"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
