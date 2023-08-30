// ChatList.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CreateRoom from "../components/CreateRoom";

const socket = io("http://localhost:8000/chat", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false); // 방 만들기 화면을 표시할지 여부를 상태로 관리합니다.

  useEffect(() => {
    socket.emit("getRooms", null, (response) => {
      //   console.log(Object.keys(chatRooms));
      setChatRooms(response);
    });
  }, []);

  const handleCreateRoomClick = () => {
    setIsCreatingRoom(true); // 버튼 클릭 시 방 만들기 화면 표시
  };

  return (
    <div>
      <h1>채팅방 목록</h1>
      <button onClick={handleCreateRoomClick}>새 채팅방 만들기</button>
      {isCreatingRoom ? (
        <CreateRoom />
      ) : (
        chatRooms &&
        Object.keys(chatRooms).map((roomSize) => (
          <div key={roomSize}>
            <h2>{roomSize}명 방</h2>
            {chatRooms[roomSize].map((room) => {
              const jsonRoom = JSON.parse(room);
              return (
                <div key={jsonRoom["roomId"]}>
                  <span>방 이름: {jsonRoom["name"]}</span>
                  <span>방장: {jsonRoom["roomOwner"]}</span>
                  <span>최대 인원: {jsonRoom["maxNumberOfPerson"]}</span>

                  {/* 추가 정보 표시 */}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
