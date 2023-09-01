// ChatList.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CreateRoom from "../components/CreateRoom";
import Button from "../components/ui/Button";
import Modal from "react-modal";
import { Link, json } from "react-router-dom";
import ChatsModal from "../components/ChatsModal";

const socket = io("http://localhost:8000/chat", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const cardStyles = {
  position: "fixed",
  bottom: "80px",
  right: "2.5%",
  width: "95%",
  height: "85vh",
  animation: "slide-up 0.8s",
};

const slideUpAnimation = `
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translate(10%, 0);
      }
      to {
        opacity: 1;
        transform: translate(0, 0);
      }
    }
  `;

const ChatList = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false); // 방 만들기 화면을 표시할지 여부를 상태로 관리합니다.
  const [clickedRoom, setClickedRoom] = useState();

  useEffect(() => {
    socket.emit("getRooms", null, (response) => {
      console.log(response);
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
        <CreateRoom socket={socket} />
      ) : (
        chatRooms &&
        Object.entries(chatRooms).map(([roomSize, value]) => {
          return (
            <div key={roomSize}>
              <h2>{roomSize}명 방</h2>
              {chatRooms[roomSize] &&
                Object.entries(chatRooms[roomSize]).map(([roomId, roomList]) => {
                  const jsonRoom = JSON.parse(roomList);
                  return (
                    <div key={roomId}>
                      <span>방 이름: {jsonRoom["roomName"]}</span>
                      <span>방장: {jsonRoom["roomOwner"]}</span>
                      <span>최대 인원: {jsonRoom["maxNumberOfPerson"]}</span>
                      <Button
                        text={"들어가기"}
                        onClick={() => {
                          setModalIsOpen(true);
                          setClickedRoom({ ...jsonRoom, roomId });
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })
      )}
      {modalIsOpen && (
        <div className={`transition-opacity rounded-3xl shadow-2xl p-6 bg-pink-100`} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <ChatsModal clickedRoom={clickedRoom} socket={socket} setModalIsOpen={setModalIsOpen} />
        </div>
      )}
    </div>
  );
};

export default ChatList;
