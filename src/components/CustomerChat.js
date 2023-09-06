import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loding";

export default function CustomerChat() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);
  const [save, setSave] = useState([]);
  const scrollContainerRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [chainMessage, setChainMessage] = useState("");
  const [isWait, setIsWait] = useState(true);

  useEffect(() => {
    if(localStorage.getItem('saveBar')){
      setSave(JSON.parse(localStorage.getItem('saveBar')))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('saveBar', JSON.stringify(save))
  },[save])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [save, loading]);

  useEffect(() => {
    if (loading === true) {
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
    <div className="h-[80%]">
      {/* <h1 className="titleFont text-lg text-center mt-4">AI 바텐더</h1> */}
      <div ref={scrollContainerRef} className="flex flex-col gap-3 h-[100%] rounded-t-xl p-3 overflow-y-scroll" style={{ whiteSpace: "nowrap" }}>
        {save.length > 0 &&
          save.map((item) => {
            return (
              <div key={item.input} className={`items-center ${item.owner ? "flex justify-start" : "flex justify-end"}`}>
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
          <button disabled={loading} className="w-16 h-full text-lg rounded-tr-md mr-2 bg-pink-300 rounded-xl titleFont ">
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
