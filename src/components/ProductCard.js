import React from "react";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const onClickProductCard = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div onClick={onClickProductCard} className="border rounded-lg p-4 shadow-md cursor-pointer hover:scale-[103%] transition delay-75 ">
      <img src={product.imgUrl === "url" ? "https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693281937/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-08-29_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.05.31_oezzbw.png" : product.imgUrl} alt={product.productName} className="h-60" />
      <h2 className="text-lg font-bold mt-2">{product.productName}</h2>
      <p className="text-gray-600 overflow-hidden" style={{ whiteSpace: "nowrap" }}>
        {product.description}
      </p>
      <div className="mt-2 flex justify-between items-center">
        <span className={`text-xl font-semibold ${product.discount && "text-slate-300 line-through"}`}>{product.price}원</span>
        {product.discount && product.discount.discountRating && <span className="text-lg font-bold"> {Math.round(product.price * (1 - product.discount.discountRating / 100))}원</span>}
        {product.discount && product.discount.discountPrice && <span className="text-red-600">할인 {product.discount.discountPrice}%</span>}
      </div>
    </div>
  );
}
