// ChatList.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CreateRoom from "../components/CreateRoom";
import Button from "../components/ui/Button";
import ChatsModal from "../components/ChatsModal";
import cookies from "js-cookie";
import ReactModal from "react-modal";
import GridChatList from "../components/GridChatList";

// 1. http://localhost:8000
// 2. http://jangdu.me:8000
// 3. http://www.yhjs1211.online:8000 , http://118.67.143.18:8000
const cardStyles = {
  position: "fixed",
  bottom: "25%",
  right: "25%",
  width: "50%",
  height: "50vh",
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

const cusStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxWidth: "900px",
    width: "92%",
    position: "absolute",
    backgroundColor: "white",
    transform: "translate(-50%, -50%)",
    top: "50%",
    height: "80vh",
    left: "50%",
    padding: "1rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    animation: "slide-up 0.5s", // 애니메이션 적용
  },
};

const slideUpModalAnimation = `
@keyframes slide-up {
  from {
    transform: translate(-50%, 100%);
  }
  to {
    transform: translateY(-50%, 0);
  }
}
`;

const ChatList = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false); // 방 만들기 화면을 표시할지 여부를 상태로 관리합니다.
  const [clickedRoom, setClickedRoom] = useState();
  const [selectedCnt, setSelectedCnt] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Room State
  const [roomForTwo, setRoomForTwo] = useState([]);
  const [roomForThree, setRoomForThree] = useState([]);
  const [roomForFour, setRoomForFour] = useState([]);

  const [socket, setSocket] = useState({});

  useEffect(() => {
    const newSocket = io("http://localhost:8000/chat", {
      transports: ["websocket"],
      auth: {
        accessToken: cookies.get("AccessToken"),
        refreshToken: cookies.get("RefreshToken"),
      },
      reconnectionAttempts: 3,
      reconnection: true,
    });
    setSocket(newSocket);

    newSocket.emit("getRooms", null, (response) => {
      Object.entries(response).forEach(([max, room]) => {
        if (max === "2") {
          setRoomForTwo(room);
          setSelectedCnt(room);
        } else if (max === "3") {
          setRoomForThree(room);
        } else if (max === "4") {
          setRoomForFour(room);
        }
      });
    });
  }, []);

  const handleCreateRoomClick = () => {
    setIsCreatingRoom(true); // 버튼 클릭 시 방 만들기 화면 표시
  };

  return (
    <div className={`flex flex-col border max-w-xl mx-auto p-4 bg-white my-8 rounded-xl shadow-md`}>
      <h1 className="text-2xl font-bold text-center my-4">채팅방 목록</h1>
      <div className="flex flex-row gap-3 font-semibold justify-center">
        <button
          className={`hover:text-pink-500 ${selectedCnt === roomForTwo && "text-pink-500"}`}
          onClick={() => {
            setSelectedCnt(roomForTwo);
          }}>
          2인방
        </button>
        <button
          className={`hover:text-pink-500 ${selectedCnt === roomForThree && "text-pink-500"}`}
          onClick={() => {
            setSelectedCnt(roomForThree);
          }}>
          3인방
        </button>
        <button
          className={`hover:text-pink-500 ${selectedCnt === roomForFour && "text-pink-500"}`}
          onClick={() => {
            setSelectedCnt(roomForFour);
          }}>
          4인방
        </button>
      </div>
      <div className="flex justify-end">
        <Button text={"내 채팅방 만들기"} onClick={handleCreateRoomClick} />
      </div>
      {isCreatingRoom && (
        <div className={`transition-opacity rounded-3xl shadow-2xl bg-pink-100`} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <CreateRoom socket={socket} setIsCreatingRoom={setIsCreatingRoom} setClickedRoom={setClickedRoom} />
        </div>
      )}
      <ReactModal isOpen={modalIsOpen} style={cusStyle}>
        <style>{slideUpModalAnimation}</style>
        <div>
          <ChatsModal clickedRoom={clickedRoom} socket={socket} socketId={socket.id} setModalIsOpen={setModalIsOpen} />
        </div>
      </ReactModal>

      {selectedCnt && <GridChatList socket={socket} clickedRoom={clickedRoom} setClickedRoom={setClickedRoom} setModalIsOpen={setModalIsOpen} list={selectedCnt} />}
    </div>
  );
};

export default ChatList;
