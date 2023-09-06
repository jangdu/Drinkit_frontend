import React, { useState } from "react";
import { TbMessageCircleQuestion } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import CustomerService from "../CustomerService";
import CustomerManager from "../CustomerManager";

const cardStyles = {
  position: "fixed",
  bottom: "80px",
  right: "20px",
  width: "400px",
  height: "700px",
  zIndex: "1100",
  animation: "slide-up 0.5s",
};

const slideUpAnimation = `
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translate(10%, 0);
      }
      to {
        opacity: 1;
        transform: translate(0, 0);
      }
    }
  `;

const ToggleButton = () => {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);

  const toggleCustomerService = () => {
    setIsCustomerServiceOpen(!isCustomerServiceOpen);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "30px", zIndex: "1000" }}>
      {/* 아이콘을 클릭하여 고객센터 토글 */}
      <div onClick={toggleCustomerService} className={`text-red-500 cursor-pointer text-6xl hover:scale-110 transition-transform ${isCustomerServiceOpen ? "rotate-180 " : ""}`}>
        {isCustomerServiceOpen ? <IoClose /> : <TbMessageCircleQuestion />}
      </div>
      {/* 고객센터 컴포넌트 */}
      {isCustomerServiceOpen && (
        <div className={`transition-opacity rounded-3xl shadow-2xl bg-pink-200 `} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <CustomerManager toggleCustomerService={toggleCustomerService} onClose={() => setIsCustomerServiceOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ToggleButton;
