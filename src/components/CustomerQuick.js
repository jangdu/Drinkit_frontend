import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loding";

export default function CustomerQuick() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [save, setSave] = useState([]);
  const scrollContainerRef = useRef(null);
  const [loading, setloading] = useState(true);
  const [statusButton, setStatusButton] = useState();
  
  const category = {
    post: ['택배', '일정'],
    refund: ['환불', '방법'],
    subscribe: ['구독', '안내', '방법']
  }

  useEffect(() => {
    // 스크롤 컨테이너의 scrollTop을 최대로 설정하여 항상 아래로 스크롤합니다.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [save, loading]);

  const sendCreateMessage = async (num) => {
    const inputMessage = `${category[statusButton][0]} / ${category[statusButton][num]} 라는 단어로 질문을 만들어 줘.`
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENAI_SERVERURL}/messages`,
        { message: inputMessage },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        const data = await response.data;
        setInput(data)
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendMessage = async () => {
    setloading(true);
    setSave([...save, { owner: false, input: input }]);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_OPENAI_SERVERURL}/messages`,
        { message: input },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        const data = await response.data;
        setMessage(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (message.length > 0) {
      setSave([...save, { owner: true, input: message }]);
    }
    setloading(false);
  }, [message]);

  const handlleSubmit = (e) => {
    e.preventDefault();

    sendMessage();
    setInput("");
  };

  return (
    <div className="h-[80%]">
      {/* <h1 className="titleFont text-lg text-center mt-4">AI 고객센터</h1> */}
      <div ref={scrollContainerRef} className="flex flex-col gap-3 h-[100%] rounded-t-xl p-3 overflow-y-scroll" style={{ whiteSpace: "nowrap" }}>
      <div className="flex flex-col items-end gap-3">
        <div className="items-center flex justify-end">
          <button value={'post'} onClick={(e) => {setStatusButton(e.target.value)}} className={`bg-white h-auto rounded-md px-4 py-2 break-words list-none mr-2`}>
            택배
          </button>
          <button value={'refund'} onClick={(e) => {setStatusButton(e.target.value)}} className={`bg-white h-auto rounded-md px-4 py-2 break-words list-none mr-2`}>
            환불
          </button>
          <button value={'subscribe'} onClick={(e) => {setStatusButton(e.target.value)}} className={`bg-white h-auto rounded-md px-4 py-2 break-words list-none`}>
            구독
          </button>
          <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-l-white"></div>
        </div>
      <div className="items-center flex flex-row">
        {statusButton && category[statusButton].map((item, i) => {
            if(i === 0){
                return true;
            }else if (i === category[statusButton].length -1){
                return(
                  <div className="flex flex-row">
                    <button value={i} onClick={(e) => {sendCreateMessage(i)}} className={`bg-white h-auto rounded-md px-4 py-2 break-words list-none`}>
                      {item}
                    </button>
                    <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-l-white"></div>
                  </div>
                )
            }
            return (
              <div className="flex flex-row">
                <button value={i} onClick={(e) => {sendCreateMessage(i)}} className={`bg-white h-auto rounded-md px-4 py-2 break-words list-none mr-2`}>
                  {item}
                </button>
              </div>
            )
        })}
      </div>
      </div>

        {save.length > 0 &&
          save.map((item) => {
            return (
              <div key={item.input} className={` items-center ${item.owner ? "flex justify-start" : "flex justify-end"}`}>
                {item.owner && <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-r-yellow-100"></div>}
                <li className={`${item.owner ? `bg-yellow-100` : `bg-white`} h-auto rounded-md px-4 py-2 break-words list-none`}>{item.input}</li>
                {!item.owner && <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-l-white"></div>}
              </div>
            );
          })}
          {loading && <Loading />}
      </div>
      <div className="absolute bottom-2 h-[7%] w-full items-center">
        <div className="w-[70%] mx-auto border-t border-pink-500"></div>
        <form onSubmit={handlleSubmit} className="flex flex-row h-full justify-around  text-lg p-2 opacity-95">
          <input value={input} required onChange={(e) => setInput(e.target.value)} className="w-[80%] px-4 bg-pink-100 rounded-xl ml-3 mr-3"></input>
          <button disabled={loading} className="w-16 h-full text-lg rounded-tr-md mr-2 bg-pink-300 rounded-xl titleFont ">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
