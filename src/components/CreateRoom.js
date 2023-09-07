// CreateRoom.js
import React, { useState } from "react";
import Button from "./ui/Button";

// const socket = io("http://localhost:8000/chat", {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

const CreateRoom = ({
  socket,
  socketId,
  setIsCreatingRoom,
  setModalIsOpen,
  setClickedRoom,
}) => {
  const [roomName, setRoomName] = useState("");
  const [maxNumberOfPerson, setMaxNumberOfPerson] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateRoom = () => {
    const roomData = {
      roomName,
      maxNumberOfPerson: parseInt(maxNumberOfPerson),
      password,
    };

    socket.emit("drinkitRoom", roomData, (response) => {
      setModalIsOpen(true);
      setClickedRoom({ ...response });
    });
  };

  return (
    <div className="flex flex-col gap-2 p-6 text-lg">
      <div className="absolute right-5 top-5">
        <Button text={"닫기"} onClick={() => setIsCreatingRoom(false)} />
      </div>
      <h1>새 채팅방 만들기</h1>
      <div>
        <label>방 이름: </label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div>
        <label>최대 참여 인원: </label>
        <input
          type="number"
          value={maxNumberOfPerson}
          onChange={(e) => setMaxNumberOfPerson(e.target.value)}
        />
      </div>
      <div>
        <label>비밀번호: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="w-fit">
        <Button text={"방 만들기"} onClick={handleCreateRoom} />
      </div>
    </div>
  );
};

export default CreateRoom;
