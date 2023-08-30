// ChatList.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000/chat", {
  transports: ["websocket", "polling"],

  withCredentials: true,
});

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState();

  useEffect(() => {
    socket.emit("getRooms", null, (response) => {
      console.log(JSON.parse(response[4]));
      setChatRooms(response[4]);
    });
  }, []);

  return (
    <div>
      <h1>채팅방 목록</h1>
      {chatRooms &&
        chatRooms.map((room) => (
          <div key={room.roomId}>
            <span>{room.name}</span>
          </div>
        ))}
    </div>
  );
};

export default ChatList;
