import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const getReview = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVERURL}/products/${productId}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.data;
          setProduct(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getReview();
  });

  if (!product) {
    return <div>해당하는 상품이 없습니다.</div>;
  } else {
    return (
      <div className="p-8 flex flex-col mx-auto">
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="sm:w-2/5 mb-6 sm:mb-0">
            <img src={product.imgUrl} alt={product.productName} className="w-full h-auto max-h-96 object-contain" />
          </div>
          <div className="sm:w-3/5 mx-auto sm:pl-8">
            <h1 className="text-3xl font-semibold">{product.productName}</h1>
            <p className="text-gray-600 mt-2" style={{ whiteSpace: "nowrap" }}>
              {product.description}
            </p>
            <p className="text-gray-600 bg-pink-300 w-fit px-2 rounded-lg mt-2">{product.category.name}</p>
            <div className="flex items-center mt-4">
              <span className={`text-xl font-semibold ${product.discount && "text-slate-300 line-through"}`}>{product.price}원</span>
              {product.discount && <p className="ms-2 font-semibold text-xl">{"-> " + Math.round(product.price * (1 - product.discount.discountRating / 100))}원</p>}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">리뷰</h2>
          <ul>
            {product.review.map((review) => (
              <li key={review.id} className="mb-4">
                <div className="flex items-center">
                  <p className="text-yellow-500 text-2xl mr-1">★</p>
                  <p className="text-lg">{review.rating}점</p>
                </div>
                <p className="text-gray-600 mb-1">{review.content}</p>
                <p className="text-sm text-gray-500">작성자: {review.user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
