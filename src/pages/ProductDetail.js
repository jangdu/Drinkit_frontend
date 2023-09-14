import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loding";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(1);
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const containerStyles = {
    position: "relative",
    width: "100%",
    maxWidth: "320px",
    height: "100%",
    maxHeight: "500px",
    minHeight: "400px",
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

  const handleAddCart = () => {
    const newItem = {
      productId: product.id,
      productName: product.productName,
      price: product.price,
      count,
    };

    addToCart(newItem);
  };

  useEffect(() => {
    const getReview = async () => {
      setIsLoading(true);

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
      setIsLoading(false);
    };
    getReview();
  }, []);

  if (isLoading) {
    return <Loading />;
  } else if (!product && !isLoading) {
    return <div>해당하는 상품이 없습니다.</div>;
  } else {
    return (
      <div className="flex flex-col p-8 mx-auto">
        <div className="flex flex-col justify-between sm:flex-row">
          <div className="h-20 mx-auto mb-6 rounded-t-lg cursor-pointer sm:" style={containerStyles} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <img src={product.imgUrl === "url" ? "https://res.cloudinary.com/dyhnnmhcf/image/upload/v1693281937/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-08-29_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.05.31_oezzbw.png" : product.imgUrl} alt={product.productName} style={imageStyles} />
          </div>
          <div className="sm:w-3/5 sm:pl-8">
            <h1 className="text-3xl font-semibold">{product.productName}</h1>
            <p className="mt-2 text-gray-600" style={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </p>
            <p className="px-2 mt-2 text-white font-bold py-1 bg-pink-500 rounded-lg w-fit">{product.category.name}</p>
            <div className="flex items-center mt-4">
              <span className={`text-xl font-semibold ${product.discount && "text-slate-300 line-through"}`}>{Number(product.price).toLocaleString()}원</span>
              {product.discount && <p className="text-xl font-semibold ms-2">{"→ " + Number(Math.round(product.price * (1 - product.discount.discountRating / 100))).toLocaleString()}원</p>}
            </div>
            <div className="flex flex-row items-center justify-end gap-3 text-lg font-bold">
              <Button
                text={"-"}
                onClick={() => {
                  setCount(count - 1);
                }}
                disabled={count === 1}
              />
              <span className="w-5 text-center">{count}</span>
              <Button
                text={"+"}
                onClick={() => {
                  if (count >= 50) {
                    return alert("장바구니에는 50개 이하로만 담을 수 있습니다.");
                  }
                  setCount(count + 1);
                }}
              />
              <Button onClick={handleAddCart} text={"담기"} />
            </div>
          </div>
        </div>
        <div className="w-[50%] mx-auto my-6 border border-b-2 border-pink-100"></div>
        <div className="mt-4 sm:mt-10">
          <h2 className="mb-6 text-2xl font-bold text-center">리뷰</h2>
          <div className="flex flex-col mx-auto w-[80%] font-semibold">
            {!product.review.length && <li className="mx-4">아직 달린 리뷰가 없어요!</li>}
            {product.review.map((review) => (
              <div key={review.id} className="flex flex-col mb-8 p-3 my-2 bg-pink-100 w-[100%] rounded-lg">
                <div className="flex flex-row">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <p key={index} className="text-yellow-500 text-2xl">
                      ★
                    </p>
                  ))}
                  {Array.from({ length: 5 - review.rating }, (_, index) => (
                    <p key={index} className="text-gray-300 text-2xl">
                      ☆
                    </p>
                  ))}
                </div>
                <p className="text-gray-500 text-md ms-4">{review.user.email}</p>
                <p className="px-4 mb-1 w-[80%] text-gray-800" style={{ wordWrap: "break-word" }}>
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
