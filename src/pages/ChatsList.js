import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080";

const ChatsList = () => {
  const [roomList, setRoomList] = useState([]);
  const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket", "polling"],
  });

  useEffect(() => {
    // 서버로부터 방 목록을 요청
    // io.of
    socket.emit("all_users", (rooms) => console.log(rooms));

    // 서버로부터 방 목록을 받음
    socket.on("room_list", (rooms) => {
      setRoomList(rooms);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Chat Rooms</h1>
      <ul>
        {roomList.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatsList;
