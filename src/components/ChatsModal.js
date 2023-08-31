import React, { useState, useEffect } from "react";
import Button from "./ui/Button";

const ChatsModal = ({ clickedRoom, socket, setModalIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    // 채팅방에 입장하기 위해 서버에 join 이벤트를 전송합니다.
    console.log("aaaaa");
    socket.emit("joinRoom", {
      roomName: clickedRoom.name,
      maxNumberOfPerson: clickedRoom.maxNumberOfPerson,
      nickname: "사용자 닉네임", // 사용자의 닉네임을 여기에 설정해야 합니다.
    });

    // 서버로부터 새로운 메시지를 받았을 때 처리하는 이벤트 핸들러를 등록합니다.
    socket.on("broadcastMessage", (data) => {
      // 받은 메시지를 기존 메시지 목록에 추가합니다.
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // 컴포넌트 언마운트 시 이벤트 핸들러를 정리합니다.
    return () => {
      socket.off("broadcastMessage");
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      // 입력한 메시지를 서버로 전송합니다.
      socket.emit("sendChat", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div>
      <h2>{clickedRoom.name} 채팅방</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div>
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="메시지를 입력하세요." />
        <Button text="전송" onClick={handleSendMessage} />
      </div>
      <Button
        text="나가기"
        onClick={() => {
          // 채팅방에서 나가기 위해 서버에 leave 이벤트를 전송합니다.
          socket.emit("leaveRoom", clickedRoom.name);
          setModalIsOpen(false);
        }}
      />
    </div>
  );
};

export default ChatsModal;
