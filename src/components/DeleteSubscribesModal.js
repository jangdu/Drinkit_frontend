import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";

const DeleteSubscribesModal = (user) => {
  const [selectAddress, setSelectAddress] = useState()
  const [input, setInput] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(input !== '취소'){
        alert("입력창에 '취소'를 입력해주세요")
        return;
    }
        try {
            const postSubscribe = async() => {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_SERVERURL}/subscribes`,
                    {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    }
                );
                if (response.status === 200) {
                        alert("구독 취소가 완료되었습니다.");
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
      <h2 className="mb-5 mx-auto text-xl font-bold text-center">구독 취소</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <p className="flex justify-end text-slate-500 text-xs">구독을 취소합니다.</p>
        <p className="flex justify-end text-slate-500 text-xs">구독 취소를 원할 경우 아래 입력창에 '취소'를 입력해주세요.</p>
        <p className="flex justify-end text-slate-500 text-xs">매월 1일 결제 이후에 취소 시, 물품이 전달된 상황이기에</p>
        <p className="flex justify-end text-slate-500 text-xs">이미 결제 된 포인트는 반환되지 않습니다.</p>
        <p className="flex justify-start text-slate-500 font-bold text-xs">아래 입력창에 '취소'를 입력해주세요.</p>
        <input className="bg-slate-200 rounded-lg pl-2" onChange={(e) => setInput(e.target.value)}/>
        <button
          type="submit"
          className="w-[80%] mx-auto bg-pink-300 py-1.5 rounded-2xl font-bold text-white hover:bg-pink-500">
          구독 취소
        </button>
      </form>
    </div>
  );
}

export default DeleteSubscribesModal;
