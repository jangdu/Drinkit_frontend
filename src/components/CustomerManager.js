import React, { useEffect, useRef, useState } from "react";
import CustomerChat from "./CustomerChat";
import CustomerService from "./CustomerService";
import CustomerQuick from "./CustomerQuick";

export default function CustomerManager() {
  const [hName, setHname] = useState("AI 고객센터")
  const [change, setChange] = useState(1)
  const [heigth, setHeigth] = useState(1)
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {

        console.log(scrollContainerRef.current.scrollHeight)
      }
    if (scrollContainerRef.current) {
    //   scrollContainerRef.current.scrollIntoView({ behavior: 'smooth', block: "end" })
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [heigth]);

  useEffect(() => {
    if(!change){
      setHname("AI 빠른질문")
    }else if(change === 1){
      setHname("AI 고객센터")
    }else{
      setHname("AI 바텐더")
    }
  },[change])

  return (
    <div className="h-full" >
      <h1 className="titleFont text-lg text-center mt-4" >{hName}</h1>
      <div className="flex justify-center w-[70%] mx-auto border-b border-pink-500 ">
      <button className="titleFont hover:text-pink-300 " onClick={() => {setChange(0)}}>AI빠른질문</button>
        <button className="ml-3 titleFont hover:text-pink-300 " onClick={() => {setChange(1)}}>AI고객센터</button>
        <button className="ml-3 titleFont hover:text-pink-300" onClick={() => {setChange(2)}}>AI바텐더</button>
      </div>
        {change === 0 ? <CustomerQuick /> : change === 1 ? <CustomerService /> : <CustomerChat />}
    </div>
  );
}
