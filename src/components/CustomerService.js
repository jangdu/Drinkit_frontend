import React, { useState } from "react";
import CustomerChat from "./CustomerChat";

export default function CustomerService({}) {
  const [input, setInput] = useState();

  return (
    <div className="h-full">
      <div className="h-[93%] rounded-t-3xl p-3">여기에 채팅</div>
      <div className="absolute bottom-0 h-[7%] w-full items-center">
        <div className="flex flex-row h-full justify-around">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="w-[80%] text-lg p-2 h-full rounded-t-md rounded-bl-3xl"></input>
          <button className="w-20 h-full text-lg rounded-tr-md rounded-br-3xl hover:bg-pink-300">보내기</button>
        </div>
      </div>
    </div>
  );
}
