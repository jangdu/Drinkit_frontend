import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../components/Address";
import { useAuthContext } from "../context/AuthContext";
// import { onclickEmailConfirmBtn, signupUser } from "../api/auth";

const CreateStore = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const { user, isLoading } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState("");
  const { naver } = window;

  useEffect(() => {
    if (!user.isPersonal) {
      alert("권한이 없습니다. 사업자 등록을 원하시면 관리자에게 문의 부탁드립니다.");
      return (window.location = "http://localhost:3200");
    }
  }, [user]);

  const addressGeocode = async (address) => {
    await naver.maps.Service.geocode({ query: address }, function (status, response) {
      console.log(status);
      if (status === 200) {
        setLat(response.v2.addresses[0].y);
        setLng(response.v2.addresses[0].x);
        console.log(lat);
        return;
      }
      return alert("Something wrong!");
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let x;
    let y;

    if (!selectedImage) {
      alert("이미지를 선택하세요.");
      return;
    }

    const handleGeocode = async () => {
      await naver.maps.Service.geocode({ query: enroll_company.address }, async (status, response) => {
        if (status === 200) {
          y = response.v2.addresses[0].y;
          x = response.v2.addresses[0].x;

          setLat(y);
          setLng(x);

          console.log(y, x);
          console.log(lat, lng);

          await handleRequest();
        } else {
          alert("Something wrong!");
        }
      });
    };

    await handleGeocode();

    const handleRequest = async () => {
      try {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("businessLicense", businessLicense);
        formData.append("address", enroll_company.address + addressDetail);
        formData.append("lat", y);
        formData.append("lng", x);

        const response = await axios.post(`${process.env.REACT_APP_API_SERVERURL}/stores`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          alert("가게 생성에 성공하였습니다.");
          Cookies.remove("email");
          return (window.location = "http://localhost:3200");
        } else {
          alert(response.message);
          setAddress("");
          setAddressDetail("");
          setBusinessLicense(false);
          setDescription("");
          setLat("");
          setLng("");
          setName("");
          setEnroll_company("");
        }
      } catch (error) {
        alert(error.message);
        console.error("Error occurred during signup:", error);
      }
      console.log("test", x, y);
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
      <h2 className="mb-5 mx-auto text-xl font-bold text-center"> {"가게 생성"}</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="이름" value={name} required onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="설명" value={description} required onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="사업자등록번호" value={businessLicense} required onChange={(e) => setBusinessLicense(e.target.value)} />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {selectedImage && (
          <div>
            <h2>선택한 이미지:</h2>
            <img src={URL.createObjectURL(selectedImage)} alt="선택한 이미지" />
          </div>
        )}
        <div className="address_search">
          <input className="user_enroll_text" placeholder="주소" type="text" required={true} value={enroll_company.address} />
          <input placeholder="상세 주소" type="text" required={true} onChange={(e) => setAddressDetail(e.target.value)} value={addressDetail} />
          <button type="button" onClick={handleComplete}>
            우편번호 찾기
          </button>
          {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}
        </div>
        <button className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500" type={"submit"}>
          {"가게 생성"}
        </button>
      </form>
    </div>
  );
};

export default CreateStore;
