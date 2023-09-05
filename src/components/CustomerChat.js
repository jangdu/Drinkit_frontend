import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loding";

export default function CustomerChat() {
  const [input, setInput] = useState(null);
  const [message, setMessage] = useState([]);
  const [save, setSave] = useState([]);
  const scrollContainerRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [chainMessage, setChainMessage] = useState("");
  const [isWait, setIsWait] = useState(true);

  useEffect(() => {
    // 스크롤 컨테이너의 scrollTop을 최대로 설정하여 항상 아래로 스크롤합니다.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [save, loading]);

  useEffect(() => {
    if (input === "") {
      setSave([...save, { owner: true, input: message }]);
    }
    setloading(false);
  }, [message]);

  const handlleSubmit = (e) => {
    e.preventDefault();

    setIsWait(false)
    setSave([...save, { owner: false, input: input }]);
    setChainMessage([...chainMessage, `50자 미만으로 답해. ${input}`])
    setInput("");
  };

  useEffect(() => {
    const sendMessage = async () => {
      setloading(true);
      setIsWait(true)
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_OPENAI_SERVERURL}/messages/chain`,
          { message: chainMessage},
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
          setChainMessage([...chainMessage, data])
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if(isWait === false){
      sendMessage();
    }

  }, [chainMessage])

  return (
    <div className="h-full">
      <h1 className="titleFont text-lg text-center mt-4">AI 바텐더</h1>
      <div ref={scrollContainerRef} className="flex flex-col gap-3 h-[85%] rounded-t-xl p-3 overflow-y-scroll" style={{ whiteSpace: "nowrap" }}>
        {save.length > 0 &&
          save.map((item) => {
            return (
              <div key={item.input} className={`items-center ${item.owner ? "flex justify-start" : "flex justify-end"}`}>
                {item.owner && <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-r-white"></div>}
                <li className={`bg-white w-fit rounded-md px-4 py-2 list-none	`}>{item.input}</li>
                {!item.owner && <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-l-white"></div>}
              </div>
            );
          })}
          {loading && <Loading />}
      </div>
      <div className="absolute bottom-2 h-[7%] w-full items-center">
        <div className="w-[70%] mx-auto border-t border-slate-500"></div>
        <form onSubmit={handlleSubmit} className="flex flex-row h-full justify-around  text-lg p-2 opacity-95">
          <input value={input} required onChange={(e) => setInput(e.target.value)} className="w-[80%] px-4 bg-transparent"></input>
          <button disabled={loading} className="w-20 h-full text-lg rounded-tr-md ">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
