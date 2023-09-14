import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const containerStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
    maxHeight: "250px",
    minHeight: "250px",
    overflow: "hidden",
  };

  const imageStyles = {
    width: "100%",
    height: "100%",
    transition: "transform 0.3s ease-in-out",
    transform: isHovered ? "scale(1.1)" : "scale(1)",
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onClickProductCard = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="rounded-lg pb-2 transition delay-75 " style={{ whiteSpace: "nowrap" }}>
      <div onClick={onClickProductCard} className="cursor-pointer h-20 rounded-xl" style={containerStyles} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img src={product.imgUrl === "url" ? "https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693281937/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-08-29_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.05.31_oezzbw.png" : product.imgUrl} alt={product.productName} style={imageStyles} />
      </div>
      <h2 onClick={onClickProductCard} className="text-lg mb-6 cursor-pointer font-bold mt-3">
        {product.productName}
      </h2>
      <p className="text-gray-600 overflow-hidden border-b py-3" style={{ whiteSpace: "nowrap" }}>
        {product.description}
      </p>
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xl font-semibold ${product.discount && "text-slate-300 line-through"}`}>{Number(product.price).toLocaleString()}원</span>
        {product.discount && product.discount.discountRating && <span className="text-lg font-bold"> {Number(Math.round(product.price * (1 - product.discount.discountRating / 100))).toLocaleString()}원</span>}
        {product.discount && product.discount.discountPrice && <span className="text-red-600">할인 {product.discount.discountPrice}%</span>}
      </div>
    </div>
  );
}
