import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Cookies from "js-cookie";
import Login from "./Login";
import Signup from "./Signup";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "80%",
    maxWidth: "450px",
    position: "absolute",
    height: "450px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "1rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    animation: "slide-up 0.5s", // 애니메이션 적용
  },
};

// 슬라이드 업 애니메이션을 위한 CSS 키 프레임 정의
const slideUpAnimation = `
  @keyframes slide-up {
    from {
      transform: translate(-50%, 100%);
    }
    to {
      transform: translateY(-50%, 0);
    }
  }
`;

Modal.setAppElement("#root"); // App 요소 설정

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(Cookies.get("AccessToken"));
  const [refreshToken, setRefreshToken] = useState(Cookies.get("RefreshToken"));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSignupLogIn, setIsSignupLogIn] = useState("login");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  console.log(Cookies.get("AccessToken"));

  useEffect(() => {
    const storedToken = Cookies.get("AccessToken");
    setRefreshToken(Cookies.get("RefreshToken"));
    setToken(storedToken);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  return (
    <header className="flex max-w-4xl mx-auto justify-between border-b border-gray p-3">
      {/* <div className="w-32">
        <button onClick={goBack} className="text-3xl text-center mx-auto py-1 px-2 rounded-xl font-bold text-pink-300 hover:text-pink-500">
          <MdArrowBackIos />
        </button>
      </div> */}
      <div className="">
        <Link to={"/"} className="flex text-4xl text-black font-bold">
          <h1>Drin!t</h1>
        </Link>
      </div>
      <div className=" flex justify-end items-center gap-2 font-semibold">
        <div className="hidden sm:block">
          <input placeholder="검색어 입력" className="placeholder:text-gray-500 p-2 bg-pink-300 border rounded-lg"></input>
        </div>
        <div>
          <Link className="text-black-300 hover:text-pink-500" to={"/subscribes"}>
            술구독
          </Link>
        </div>
        <div>
          <Link className="text-black-300 hover:text-pink-500" to={"/chatList"}>
            같이 술
          </Link>
        </div>
        {/* <Link to="/posts">Post</Link> */}
        {token || refreshToken ? (
          <Link className="text-black-300 hover:text-pink-500" to="/profile">
            프로필
          </Link>
        ) : (
          <button
            className="text-black-300 hover:text-pink-500"
            onClick={() => {
              setModalIsOpen(true);
              setIsSignupLogIn("signup");
            }}>
            회원가입
          </button>
        )}
        {token || refreshToken ? (
          <button
            className="text-black-300 hover:text-pink-500"
            onClick={() => {
              Cookies.remove("AccessToken");
              Cookies.remove("RefreshToken");
              window.location.reload();
            }}>
            로그아웃
          </button>
        ) : (
          <button
            className="text-black-300 hover:text-pink-500"
            onClick={() => {
              setModalIsOpen(true);
              setIsSignupLogIn("login");
            }}>
            로그인
          </button>
        )}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <style>{slideUpAnimation}</style>
        <div className="">{isSignupLogIn === "login" ? <Login /> : <Signup />}</div>
      </Modal>
    </header>
  );
}
