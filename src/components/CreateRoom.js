// CreateRoom.js
import React, { useState } from "react";
import Button from "./ui/Button";

const CreateRoom = ({
  socket,
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
    <div className="flex flex-col gap-4 p-6 text-lg mx-auto w-[80%]">
      <div className="absolute right-5 top-5">
        <Button text={"닫기"} onClick={() => setIsCreatingRoom(false)} />
      </div>
      <h1 className="my-2 text-xl font-bold text-center">새 채팅방 만들기</h1>
      <div className="flex flex-row items-center justify-between">
        <label>방 이름: </label>
        <input
          type="text"
          className="px-2 py-1 rounded-lg"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <label>최대 참여 인원 </label>
        <input
          type="number"
          className="px-2 py-1 rounded-lg"
          value={maxNumberOfPerson}
          onChange={(e) => setMaxNumberOfPerson(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <label>비밀번호: </label>
        <input
          type="password"
          className="px-2 py-1 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mx-auto my-10 w-fit">
        <Button text={"방 만들기"} onClick={handleCreateRoom} />
      </div>
    </div>
  );
};

export default CreateRoom;
