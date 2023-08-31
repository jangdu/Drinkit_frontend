import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerChat from "./CustomerChat";

export default function CustomerService({}) {
  const [input, setInput] = useState();
  const [message, setMessage] = useState();
  const [save, setSave] = useState([]);

  const sendMessage = async () => {
      setSave([...save, {owner: false, input: input}])
      console.log(save)
    try {
      const response = await axios.post(`${process.env.REACT_APP_OPENAI_SERVERURL}/messages`, {message: input}, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        const data = await response.data;
        setMessage(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    setSave([...save, {owner: true, input: message}])
  },[message])


  return (
    <div className="h-full">
      <div className="flex flex-col h-[93%] rounded-t-3xl p-3">여기에 채팅
        {/* <li className="flex justify-start">ai 메세지 내용</li>
        <li className={`flex justify-end`}>내 메세지 내용</li> */}
        {save && save.map((item)=>{
          return <li className={`${item.owner ? "flex justify-start" : "flex justify-end"}`}>{item.input}</li>
        })}
      </div>
      <div className="absolute bottom-0 h-[7%] w-full items-center">
        <div className="flex flex-row h-full justify-around">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="w-[80%] text-lg p-2 h-full rounded-t-md rounded-bl-3xl"></input>
          <button className="w-20 h-full text-lg rounded-tr-md rounded-br-3xl hover:bg-pink-300" onClick={(e) => {sendMessage()
            setInput('')
          }}>보내기</button>
        </div>
      </div>
    </div>
  );
}
