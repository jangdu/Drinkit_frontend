import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Signup from "../components/Signup";
import Button from "../components/ui/Button";
import Loading from "../components/Loding";
import AddPoint from "../components/AddPoint";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "80%",
    "max-width": "450px",
    position: "absolute",
    height: "450px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "1rem",
    "padding-left": "2rem",
    "padding-right": "2rem",
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

export default function MyProfile() {
  const { user, isLoading, myStore } = useAuthContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isPoint, setIsPoint] = useState(false);

  if (isLoading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <></>;
  } else {
    return (
      <div className="flex flex-col gap-5 ">
        <h1 className="my-5 text-center content-center text-2xl">
          <span className="font-bold">{user.name}</span>님의 정보
        </h1>
        <div className="border-b-2 border-slate-300 mb-5"></div>
        <div className="flex flex-row  items-center text-lg justify-between">
          <div className="flex flex-col">
            <p className="font-bold">이름</p> <span className="ms-10">{user.name}</span>
          </div>
        </div>
        <div className="flex flex-row  items-center text-lg justify-between">
          <div className="flex flex-col">
            <p className="font-bold">닉네임</p> <span className="ms-10">{user.nickname}</span>
          </div>
        </div>
        <div className="flex flex-row  items-center text-lg justify-between">
          <div className="flex flex-col">
            <p className="font-bold">전화번호</p> <span className="ms-10">{user.phoneNumber}</span>
          </div>
        </div>
        <div className="flex flex-row  items-center text-lg justify-between">
          <div className="flex flex-col">
            <p className="font-bold">포인트</p> <span className="ms-10">{user.point}P
                <button
                  className="flex justify-end text-black-300  font-bold hover:text-pink-500"
                  onClick={() => {
                    setModalIsOpen(true);
                    setIsPoint(true);
                  }}>
                  포인트 충전
                </button>
              </span>
          </div>
        </div>
        <div className="flex flex-row  items-center text-lg justify-between">
          <div className="flex flex-col">
            <p className="font-bold">지역</p> <span className="ms-10">{user.adress}</span>
          </div>
          <Button text={"변경"} onClick={() => {setModalIsOpen(true); setIsPoint(false);}}></Button>
        </div>
        <div className="border-b-2 border-slate-300 mb-5"></div>
        {user.isPersonal && (
          <div>
            <h1 className="text-center text-xl font-bold">{`${myStore.name}님의 가게 정보`}</h1>
            <div className="border-b-2 border-slate-300 my-5"></div>
          </div>
        )}
        {user && user.isPersonal && (
          <div>
            <Link to={`/ordered`} className="font-bold hover:text-pink-300">
              나의 가게 주문내역
            </Link>
          </div>
        )}
        {user && user.isAdmin && (
          <div>
            <Link to={`/admin`} className="font-bold hover:text-pink-300">
              관리자 페이지
            </Link>
          </div>
        )}
        {user && (
          <div>
            <Link to={`/userOrdered`} className="font-bold hover:text-pink-300">
              나의 주문내역
            </Link>
          </div>
        )}
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
          <style>{slideUpAnimation}</style>
          <div className="">
            {" "}
            {isPoint ? <AddPoint user={user} /> : <Signup isUpdateProfile={true} />}
          </div>
        </Modal>
      </div>
    );
  }
}
