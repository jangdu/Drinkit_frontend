import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import PostSubscribesModal from "../components/PostSubscribesModal";
import UpdateSubscribesModal from "../components/UpdateSubscribesModal";
import DeleteSubscribesModal from "../components/DeleteSubscribesModal";
import Modal from "react-modal";
import axios from "axios";

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

export default function Subscribes() {
  const { user, isLoading, myStore } = useAuthContext();
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState();

  useEffect(() => {
    const getSubscribe = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/subscribes`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.data;
          if (data !== "") {
            setIsSubscribe(true);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getSubscribe();
  }, []);

  return (
    <div className="h-full  p-6">
      <h2 className="font-bold text-center my-3 text-4xl">Drink!t 구독</h2>
      <div className="flex flex-col items-center w-[90%] mx-auto font-bold py-1.5 text-center mb-3">
        <p>다양한 술을 맛보고 싶으시다구요?</p>
        <p>그런데... 종류도 잘 모르겠고</p>
        <p>선택도 못하겠다구요?</p>
        <br></br>
        <p>그럴땐 바로!!</p>
        <p>Drink!t 구독 서비스~</p>
        <img alt="" className="rounded-md w-[55%] my-4 shadow-md" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694438829/drinkit/sub1_t8gk7f.png"></img>
        <p>매달 문앞으로 찾아오는</p>
        <p className="mb-5">두근두근 선물 박스!</p>
        <br></br>
        <img alt="" className="rounded-md w-[20%]" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694439597/drinkit/free-sticker-bear-7871500_i3qsj7%EC%8A%AC%ED%8D%BC%20%EC%8A%A4%ED%8B%B0%EC%BB%A4%20%EC%A0%9C%EC%9E%91%EC%9E%90:%20aslaiart%20-%20Flaticon.png"></img>
        <p>매달 술이 바뀌는데</p>
        <p className="mb-5">받고 나서 마음에 안들면 어떡하냐구요?</p>
        <br></br>
        <img alt="" className="rounded-md w-[20%]" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694439756/drinkit/free-sticker-%EC%8A%AC%ED%8D%BC%20%EC%8A%A4%ED%8B%B0%EC%BB%A4%20%EC%A0%9C%EC%9E%91%EC%9E%90:%20aslaiart%20-%20Flaticon.png"></img>
        <p>걱정마시라!! 매월 20일 경</p>
        <p>email을 통해서 이 달의 상품을 안내 해드립니다.</p>
        <p className="mb-5">상품을 미리 확인하고 ☆패스☆ 해주세요.</p>
        <br></br>
        <p>번거롭게 구독했다가... 취소했다가...</p>
        <p>그럴 필요 전~혀 없습니다!</p>
        <p>간단한 패스 버튼으로 이번 달 스킵 가능!</p>
        <br></br>
        <img alt="" className="rounded-md w-[20%]" src="https://res.cloudinary.com/devkbqyym/image/upload/v1694440037/drinkit/free-sticker-bear-7871523_nev46s%EC%8A%AC%ED%8D%BC%20%EC%8A%A4%ED%8B%B0%EC%BB%A4%20%EC%A0%9C%EC%9E%91%EC%9E%90:%20aslaiart%20-%20Flaticon.png"></img>
        <p>즐거운 Drink!t 구독</p>
        <p>지금 바로 신청해주세요!</p>
      </div>
      <div className="flex flex-row mx-auto justify-center">
        {isSubscribe ? (
          <div>
            <button
              className="rounded-2xl w-[100px] max-w-xs me-2 bg-pink-400 text-center font-bold hover:text-pink-500"
              onClick={() => {
                setModalIsOpen(true);
                setSubscribeStatus("update");
              }}>
              구독수정
            </button>
            <button
              className="rounded-2xl w-[100px] max-w-xs ms-2 bg-pink-400 text-center font-bold hover:text-pink-500"
              onClick={() => {
                setModalIsOpen(true);
                setSubscribeStatus("delete");
              }}>
              구독취소
            </button>
          </div>
        ) : (
          <button
            className="text-black-300 w-[20%] rounded-2xl max-w-xs bg-pink-400 text-center font-bold font hover:text-pink-500"
            onClick={() => {
              setModalIsOpen(true);
              setSubscribeStatus("post");
            }}>
            구독하기
          </button>
        )}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <style>{slideUpAnimation}</style>
        <div className=""> {subscribeStatus === "post" ? <PostSubscribesModal user={user} /> : subscribeStatus === "update" ? <UpdateSubscribesModal user={user} /> : <DeleteSubscribesModal user={user} />}</div>
      </Modal>
    </div>
  );
}
