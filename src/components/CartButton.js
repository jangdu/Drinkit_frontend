import React, { useEffect, useState } from "react";
import { BsCartFill } from "react-icons/bs";
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
  const { getTotalCount, cartItems, getTotalPrice } = useCart();
  const [totalPrice, setTotalPrice] = useState(getTotalPrice());
  const [totalCount, setTotalCount] = useState(getTotalCount());
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    setTotalCount(cartItems.reduce((total, item) => total + item.count, 0));
    setTotalPrice(getTotalPrice);
  }, [cartItems]);

  return (
    <div className="">
      <div
        onClick={() => {
          setModalIsOpen(true);
        }}
        className="text-red-500 cursor-pointer text-3xl hover:scale-110 relative transition">
        <BsCartFill />
        <div className="bg-black px-2 absolute rounded-full text-lg text-white top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
          <span className="text-md">{totalCount}</span>
        </div>
      </div>
      <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
        <style>{slideUpAnimation}</style>
        <Cart setModalIsOpen={setModalIsOpen} />
        {totalPrice !== 0 && (
          <Link to="/payments" className="flex w-fit text-xl text-center mx-auto py-1 px-2 rounded-xl font-bold text-white bg-pink-300 hover:bg-pink-500">
            {totalPrice + "원 주문하기"}
          </Link>
        )}
      </ReactModal>
    </div>
  );
}
