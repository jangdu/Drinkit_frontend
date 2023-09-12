import React, { useState } from "react";
import Button from "./ui/Button";
import ReactModal from "react-modal";
import ChatsModal from "./ChatsModal";

export default function GridChatList({ list, socket, clickedRoom, setModalIsOpen, setClickedRoom }) {
  const handleJoinRoom = (roomId, item) => {
    console.log(roomId);
    item.roomId = roomId;
    setClickedRoom(item);
    setModalIsOpen(true);
  };

  return (
    <div>
      {list &&
        Object.entries(list).map(([key, item]) => {
          return (
            <div key={item["roomName"]} className="flex flex-row justify-between  my-4 p-3">
              <div className="flex text-center flex-row items-center gap-3">
                <span className="text-lg font-bold">{item["roomName"]}</span>
                {item["currentUser"].length === item["maxNumberOfPerson"] && <span className="font-semibold text-slate-500">[자리없음]</span>}
              </div>
              <Button text={"들어가기"} onClick={() => handleJoinRoom(key, item)} />
            </div>
          );
        })}
    </div>
  );
}
