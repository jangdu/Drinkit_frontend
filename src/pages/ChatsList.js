// ChatList.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import CreateRoom from "../components/CreateRoom";
import Button from "../components/ui/Button";
import ChatsModal from "../components/ChatsModal";
import cookies from "js-cookie";
import ReactModal from "react-modal";

// 1. http://localhost:8000
// 2. http://jangdu.me:8000
// 3. http://www.yhjs1211.online:8000 , http://118.67.143.18:8000

const socket = io("https://jangdu.me/chat", {
  transports: ["websocket"],
  withCredentials: true,
  auth: {
    accessToken: cookies.get("AccessToken"),
    refreshToken: cookies.get("RefreshToken"),
  },
});

const cardStyles = {
  position: "fixed",
  bottom: "25%",
  left: "25%",
  width: "50%",
  height: "50%",
  animation: "slide-up 0.8s",
};

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false); // 방 만들기 화면을 표시할지 여부를 상태로 관리합니다.
  const [clickedRoom, setClickedRoom] = useState();
  const [socketId, setSocketId] = useState("");

  useEffect(() => {
    socket.emit("getRooms", null, (response) => {
      setSocketId(socket.id); // peer 객체 생성시 ID 값 활용
      setChatRooms(response);
    });
  }, [isCreatingRoom, socketId]);

  const handleCreateRoomClick = () => {
    setIsCreatingRoom(true); // 버튼 클릭 시 방 만들기 화면 표시
  };

  return (
    // <div className={`flex flex-col border border-slate-500 bg-white max-w-xl mx-auto mt-2 h-[90vh] rounded-2xl p-3`}>
    <div className="rounded-xl border-slate-200 my-3 max-w-xl min-h-[90vh] mx-auto bg-white p-4 shadow-xl border flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center my-2">채팅방 목록</h1>
      <div className="flex flex-row justify-end font-bold text-xl my-2">
        <Button text={"방 만들기"} onClick={handleCreateRoomClick} />
      </div>
      {isCreatingRoom ? (
        <div className={`transition-opacity rounded-3xl shadow-2xl bg-pink-100`} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <CreateRoom socket={socket} socketId={socketId} setIsCreatingRoom={setIsCreatingRoom} setModalIsOpen={setModalIsOpen} setClickedRoom={setClickedRoom} />
        </div>
      ) : (
        chatRooms &&
        Object.entries(chatRooms).map(([roomSize, value]) => {
          return (
            <div key={roomSize} className="flex flex-col">
              {/* <h2 className="text-xl font-bold">{roomSize}명 방</h2> */}
              {chatRooms[roomSize] &&
                Object.entries(chatRooms[roomSize]).map(([roomId, roomList]) => {
                  const jsonRoom = JSON.parse(roomList);
                  return (
                    <div key={roomId} className="flex flex-col  my-4 p-3">
                      <div key={roomId} className="flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-row items-center gap-4 ">
                          <span className="text-lg text-slate-500 font-semibold">{"[" + jsonRoom["maxNumberOfPerson"] + "인방]"}</span>
                          <span className="text-lg font-bold">{jsonRoom["roomName"]}</span>
                          {/* <span>방장: {jsonRoom["roomOwner"]}</span> */}
                        </div>
                        <Button
                          text={"들어가기"}
                          onClick={() => {
                            setModalIsOpen(true);
                            setClickedRoom({ ...jsonRoom, roomId });
                          }}
                        />
                      </div>
                      {/* <div className="border w-[50%] mx-auto border-pink-300"></div> */}
                    </div>
                  );
                })}
            </div>
          );
        })
      )}
      {/* {modalIsOpen && (
        <div className={`transition-opacity rounded-3xl shadow-2xl p-6 bg-pink-100`} style={cardStyles}>
          <style>{slideUpAnimation}</style>
          <ChatsModal clickedRoom={clickedRoom} socket={socket} setModalIsOpen={setModalIsOpen} />
        </div>
      )} */}
      <ReactModal isOpen={modalIsOpen} style={cusStyle}>
        <style>{slideUpModalAnimation}</style>
        <div>
          <ChatsModal clickedRoom={clickedRoom} socket={socket} socketId={socketId} setModalIsOpen={setModalIsOpen} />
        </div>
      </ReactModal>
    </div>
  );
};

export default ChatList;
