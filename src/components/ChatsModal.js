import React, { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";

const ChatsModal = ({ clickedRoom, socket, setModalIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    console.log("momomo");

    // 채팅방에 입장하기 위해 서버에 join 이벤트를 전송합니다.
    console.log(clickedRoom);
    socket.emit("joinRoom", clickedRoom);
    socket.on("joinedRoom", handleNewMessage);
    socket.on("userJoined", handleNewMessage);
    socket.on("broadcastMessage", handleNewMessage);

    ///////////////////////////////////////////
    const iceServers = [
      { urls: "stun:stun.l.google.com:19302" }, // Google STUN 서버 주소
    ];

    const peerConnection = new RTCPeerConnection({ iceServers });

    return () => {
      socket.off("broadcastMessage");
      socket.off("userJoined");
      socket.off("joinedRoom");
    };
  }, [socket, clickedRoom]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      // 입력한 메시지를 서버로 전송합니다.
      socket.emit("sendChat", messageInput);
      setMessages((prevMessages) => [...prevMessages, `me: ${messageInput}`]);
      setMessageInput("");
    }
  };

  const handleNewMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, `${data}`]);
  };

  return (
    <div style={{ height: "90%", overflowY: "auto" }}>
      <h2>{clickedRoom.name} 채팅방</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="absolute bottom-0">
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="메시지를 입력하세요." />
        <Button text="전송" onClick={handleSendMessage} />
      </div>
      <div className="absolute right-3 top-3">
        <Button
          text="나가기"
          onClick={() => {
            // 채팅 나가기
            socket.emit("leaveRoom", clickedRoom.name);
            setModalIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default ChatsModal;
