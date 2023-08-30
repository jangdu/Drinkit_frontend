// CreateRoom.js
import React, { useState } from "react";

// const socket = io("http://localhost:8000/chat", {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

const CreateRoom = ({ socket }) => {
  const [roomName, setRoomName] = useState("");
  const [maxNumberOfPerson, setMaxNumberOfPerson] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateRoom = () => {
    const roomData = {
      roomName: roomName,
      maxNumberOfPerson: parseInt(maxNumberOfPerson),
      password: password,
    };

    socket.emit("drinkitRoom", roomData, (response) => {
      console.log(response); // 백엔드에서 전달하는 응답 확인
    });
  };

  return (
    <div>
      <h1>새 채팅방 만들기</h1>
      <div>
        <label>방 이름: </label>
        <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      </div>
      <div>
        <label>최대 참여 인원: </label>
        <input type="number" value={maxNumberOfPerson} onChange={(e) => setMaxNumberOfPerson(e.target.value)} />
      </div>
      <div>
        <label>비밀번호: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleCreateRoom}>방 만들기</button>
    </div>
  );
};

export default CreateRoom;
