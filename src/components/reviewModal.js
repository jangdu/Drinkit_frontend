import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewModal = (paymentDetailId) => {
  const [content, setContent] = useState()
  const [rating, setRating] = useState(5)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(paymentDetailId, content, rating)
        try {
            const postSubscribe = async() => {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_SERVERURL}/reviews?paymentDetailId=${paymentDetailId.paymentDetailId}`,
                    {content, rating: Number(rating)},
                    {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    }
                );
                    console.log(response)
                if (response.status === 201) {
                        alert("리뷰 등록이 완료되었습니다.");
                        window.location.reload();
                    }
            }
            postSubscribe()
        } catch (error) {
            alert(error);
            console.error("Error occurred during add point:", error);
        }
    };      
  return (
    <div>
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">리뷰 작성</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="flex justify-end text-slate-500 text-xs">등록한 리뷰는 수정 및 삭제가 불가능합니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">별점은 최대 5점까지 가능합니다.</p>
        <select onChange={(e) => setRating(e.target.value)}>
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
        <input
          type="text"
          placeholder="리뷰 내용"
          className="p-2 border border-pink-300 rounded-lg placeholder:text-gray-500"
          required
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500">
          작성 완료
        </button>
      </form>
    </div>
  );
}

export default ReviewModal;
