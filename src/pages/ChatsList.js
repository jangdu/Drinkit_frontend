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

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    width: "80%",
    maxWidth: "450px",
    position: "fixed",
    height: "90%",
    top: "5%",
    left: "50%",
    backgroundColor: "white",
    padding: "1rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    animation: "slide-up 0.8s", // 애니메이션 적용
  },
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
                  {/* <Link to={`/chats/${jsonRoom["roomId"]}`}>들어가기</Link> */}
                  <Button
                    text={"들어가기"}
                    onClick={() => {
                      console.log(jsonRoom);
                      setModalIsOpen(true);
                      setClickedRoom(jsonRoom);
                    }}
                  />
                  {/* 추가 정보 표시 */}
                </div>
              );
            })}
            <Modal isOpen={modalIsOpen} style={customStyles}>
              <style>{slideUpAnimation}</style>
              <div className="">
                <ChatsModal clickedRoom={clickedRoom} socket={socket} setModalIsOpen={setModalIsOpen} />
              </div>
            </Modal>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
