import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loding";

export default function CustomerService() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [save, setSave] = useState([]);
  const scrollContainerRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if(localStorage.getItem('save')){
      setSave(JSON.parse(localStorage.getItem('save')))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('save', JSON.stringify(save))
  }, [save])

  useEffect(() => {
    // 스크롤 컨테이너의 scrollTop을 최대로 설정하여 항상 아래로 스크롤합니다.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [save, loading]);

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
        setCount(count + 1);
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
  }, [count]);

  const handlleSubmit = (e) => {
    e.preventDefault();

    sendMessage();
    setInput("");
  };

  const clearChat = () => {
    localStorage.removeItem('save')
    setSave("")
    setMessage("")
    setloading(false)
  }

  return (
    <div className="h-[75%]">
      <div className="flex flex-col items-end mt-1 mb-1">
        <button className="pl-2 pr-2 text-lg rounded-tr-md mr-2 mb-1 bg-pink-300 rounded-xl titleFont shadow-sm shadow-pink-400 hover:bg-pink-400 hover:shadow-none" onClick={() => {clearChat()}}>대화내용삭제</button>
      </div>
      <div ref={scrollContainerRef} className="flex flex-col gap-3 h-[100%] rounded-t-xl p-3 overflow-y-auto no-scrollbar overscroll-none" style={{ whiteSpace: "nowrap" }}>
        {save.length > 0 &&
          save.map((item) => {
            return (
              <div key={item.input} className={` items-center ${item.owner ? "flex justify-start" : "flex justify-end"}`}>
                {item.owner && <div className="bg-transparent mt-2 w-4 h-1 border-8 border-solid border-transparent border-r-yellow-100"></div>}
                <li className={`${item.owner ? `bg-yellow-100` : `bg-white`} w-fit rounded-md px-4 py-2 list-none	`}>{item.input}</li>
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
          <button disabled={loading} className="w-16 h-full text-lg rounded-tr-md mr-2 bg-pink-300 rounded-xl titleFont hover:bg-pink-400">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
