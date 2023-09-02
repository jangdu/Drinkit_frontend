import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import PostSubscribesModal from "../components/PostSubscribesModal";
import UpdateSubscribesModal from "../components/UpdateSubscribesModal";
import DeleteSubscribesModal from "../components/DeleteSubscribesModal";
import Modal from "react-modal"
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

export default function Subscribes() {
  const { user, isLoading, myStore } = useAuthContext();
  const [ isSubscribe, setIsSubscribe] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState();

  useEffect(() => {
    const getSubscribe = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SERVERURL}/subscribes`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const data = await response.data;
          if(data !== ''){
            setIsSubscribe(true)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getSubscribe();
  }, [])

  return  <div>
            <div className="w-[90%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-center text-white hover:bg-pink-500 mb-3">술 구독 페이지</div>
            <div className="w-[90%] mx-auto text-center">소개 글 내용들</div>
            <div className="w-[90%] mx-auto text-center">소개 글 내용들</div>
            <div className="grid grid-cols-1 gap-4 justify-items-center">
              {isSubscribe ? <div>
                <button
                className="rounded-2xl max-w-xs me-2 bg-pink-400 text-center font-bold hover:text-pink-500"
                onClick={() => {
                  setModalIsOpen(true);
                  setSubscribeStatus('update')
                }}>
                구독수정
              </button>
              <button
                className="rounded-2xl max-w-xs ms-2 bg-pink-400 text-center font-bold hover:text-pink-500"
                onClick={() => {
                  setModalIsOpen(true);
                  setSubscribeStatus('delete')
                }}>
                구독취소
              </button>
              </div> : <button
                className="text-black-300 rounded-2xl max-w-xs bg-pink-400 text-center font-bold font hover:text-pink-500"
                onClick={() => {
                  setModalIsOpen(true);
                  setSubscribeStatus('post')
                }}>
                구독하기
              </button>}

            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
              <style>{slideUpAnimation}</style>
              <div className="">
                {" "}
                {subscribeStatus === 'post' ? <PostSubscribesModal user={user} /> 
                : subscribeStatus === 'update' ? <UpdateSubscribesModal user={user} /> 
                : <DeleteSubscribesModal user={user} />}
              </div>
            </Modal>
          </div>
}
