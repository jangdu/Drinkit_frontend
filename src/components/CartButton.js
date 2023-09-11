import React, { useEffect, useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { useCart } from "../context/CartContext";
import ReactModal from "react-modal";
import Cart from "./Cart";
import { Link } from "react-router-dom";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "80%",
    maxWidth: "500px",
    height: "450px",
    position: "absolute",
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

export default function CartButton() {
  const { getTotalCount, clickedPickupBtn, setClickedPickupBtn, cartItems, getTotalPrice } = useCart();
  const [totalPrice, setTotalPrice] = useState(getTotalPrice());
  const [totalCount, setTotalCount] = useState(getTotalCount());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isButtonShaking, setIsButtonShaking] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setTotalCount(cartItems.reduce((total, item) => total + item.count, 0));
    setTotalPrice(getTotalPrice);
    setIsButtonShaking(true);

    if (cartItems.length > 0) {
      setAlertMessage("카트에 물건이 추가되었습니다.");
      setShowAlert(true);

      // 3초 후에 알림 메시지를 숨김
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    }

    const timeoutId = setTimeout(() => {
      setIsButtonShaking(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cartItems]);

  return (
    <div className="max-w-2xl me-4">
      <div
        onClick={() => {
          setModalIsOpen(true);
        }}
        className="">
        <div className={`text-pink-500 cursor-pointer text-4xl hover:scale-110 ${isButtonShaking ? "animate-shake " : ""} relative transition`}>
          <CgShoppingCart />
          <div className="bg-pink-300 px-2 py-0 absolute rounded-full text-base text-black top-2 right-1 transform translate-x-1/2 -translate-y-1/2">
            <span className="text-sm">{totalCount}</span>
          </div>
        </div>
        {showAlert && <div className={`alert-bubble right-8 lg:right-[40%] lg:top-20`}>{alertMessage}</div>}
      </div>
      <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <style>{slideUpAnimation}</style>
        <Cart setModalIsOpen={setModalIsOpen} />
        {totalPrice !== 0 && (
          <div className="flex flex-row">
            <Link
              to="/test"
              onClick={() => {
                setModalIsOpen(false);
                setClickedPickupBtn(!clickedPickupBtn);
              }}
              className="flex w-fit text-lg text-center mx-auto py-1 px-2 rounded-xl font-semibold text-black bg-pink-300 hover:bg-pink-500 hover:text-white">
              {"픽업: 재고 확인"}
            </Link>
            <Link
              to="/payments"
              onClick={() => {
                setModalIsOpen(false);
              }}
              className="flex w-fit text-lg text-center mx-auto py-1 px-2 rounded-xl font-semibold text-black bg-pink-300 hover:bg-pink-500 hover:text-white">
              {totalPrice + "원 주문하기"}
            </Link>
          </div>
        )}
      </ReactModal>
    </div>
  );
}
