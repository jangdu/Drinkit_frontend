import React, { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import CustomerService from "../CustomerService";

const cardStyles = {
  position: "fixed",
  bottom: "80px",
  right: "20px",
  width: "400px",
  height: "700px",
  zIndex: "1100",
  animation: "slide-up 0.8s",
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
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: "1000" }}>
      {/* 아이콘을 클릭하여 고객센터 토글 */}
      <div onClick={toggleCustomerService} className={`text-red-500 cursor-pointer text-5xl hover:scale-110 transition-transform ${isCustomerServiceOpen ? "rotate-180" : ""}`}>
        {isCustomerServiceOpen ? <AiFillCloseCircle /> : <FiHelpCircle />}
      </div>
      {/* 고객센터 컴포넌트 */}
      {isCustomerServiceOpen && (
        <div className={`transition-opacity rounded-3xl shadow-2xl bg-pink-100`} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <CustomerService toggleCustomerService={toggleCustomerService} onClose={() => setIsCustomerServiceOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ToggleButton;
