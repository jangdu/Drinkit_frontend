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
const cardStyles = {
  position: "fixed",
  bottom: "120px",
  right: "2.5%",
  width: "95%",
  height: "80vh",
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
  const [isCreatingRoom, setIsCreatingRoom] = useState(false); // 방 만들기 화면을 표시할지 여부를 상태로 관리합니다.
  const [clickedRoom, setClickedRoom] = useState();
  const [socket, setSocket] = useState(
    io("http://localhost:8000/chat", {
      transports: ["websocket"],
      auth: {
        accessToken: cookies.get("AccessToken"),
        refreshToken: cookies.get("RefreshToken"),
      },
      reconnectionAttempts: 3,
      reconnection: true,
    })
  );

  // Room State
  const [roomForTwo, setRoomForTwo] = useState([]);
  const [roomForThree, setRoomForThree] = useState([]);
  const [roomForFour, setRoomForFour] = useState([]);

  useEffect(() => {
    socket.emit("getRooms", null, (response) => {
      Object.entries(response).forEach(([max, rooms]) => {
        if (max === "2") {
          setRoomForTwo([...roomForTwo, rooms]);
        } else if (max === "3") {
          setRoomForThree([...roomForThree, rooms]);
        } else if (max === "4") {
          setRoomForFour([...roomForFour, rooms]);
        }
      });
    });
  }, [isCreatingRoom]);

  console.log(socket.id);

  const handleCreateRoomClick = () => {
    setIsCreatingRoom(true); // 버튼 클릭 시 방 만들기 화면 표시
  };

  return (
    <div className={`flex flex-col`}>
      <h1 className="text-2xl font-bold text-center">채팅방 목록</h1>
      <div className="w-fit ">
        <Button text={"내 채팅방 만들기"} onClick={handleCreateRoomClick} />
      </div>
      {isCreatingRoom ? (
        <div
          className={`transition-opacity rounded-3xl shadow-2xl bg-pink-100`}
          style={cardStyles}
        >
          <style>{slideUpAnimation}</style>
          <CreateRoom
            socket={socket}
            setIsCreatingRoom={setIsCreatingRoom}
            setModalIsOpen={setModalIsOpen}
            setClickedRoom={setClickedRoom}
          />
        </div>
      ) : (
        // Object.entries(chatRooms).map(([roomSize, value]) => {
        //   return (
        //     <div key={roomSize} className="flex flex-col p-2">
        //       <h2 className="text-xl font-bold">{roomSize}명 방</h2>
        //       {chatRooms[roomSize] &&
        //         Object.entries(chatRooms[roomSize]).map(
        //           ([roomId, roomList]) => {
        //             const jsonRoom = JSON.parse(roomList);
        // return (
        //   <div
        //     key={roomId}
        //     className="flex flex-row items-center justify-between gap-3 p-4 my-4"
        //   >
        //     <span className="text-lg ">
        //       방 이름: {jsonRoom["roomName"]}
        //     </span>
        //     {/* <span>방장: {jsonRoom["roomOwner"]}</span> */}
        //     {/* <span className="text-lg">최대 인원: {jsonRoom["maxNumberOfPerson"]}</span> */}
        //     <Button
        //       text={"들어가기"}
        //       onClick={() => {
        //         setModalIsOpen(true);
        //         setClickedRoom({ ...jsonRoom, roomId });
        //       }}
        //     />
        //   </div>
        // );
        //           }
        //         )}
        //     </div>
        //   );
        // })
        console.log("hi")
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
          <ChatsModal
            clickedRoom={clickedRoom}
            socket={socket}
            socketId={socket.id}
            setModalIsOpen={setModalIsOpen}
          />
        </div>
      </ReactModal>
    </div>
  );
};

export default ChatList;

// Object.entries(room).map(([id,info])=>{
//   return (
//     <div
//       key={id}
//       className="flex flex-row items-center justify-between gap-3 p-4 my-4"
//     >
//       <span className="text-lg ">
//         방 이름: {info["roomName"]}
//       </span>
//       {/* <span>방장: {jsonRoom["roomOwner"]}</span> */}
//       {/* <span className="text-lg">최대 인원: {jsonRoom["maxNumberOfPerson"]}</span> */}
//       <Button
//         text={"들어가기"}
//         onClick={() => {
//           setModalIsOpen(true);
//           setClickedRoom({ ...info, id });
//         }}
//       />
//     </div>
//   );
// })
