import React, { useState } from "react";
import Button from "./ui/Button";
import ReactModal from "react-modal";
import ChatsModal from "./ChatsModal";

export default function GridChatList({
  list,
  socket,
  clickedRoom,
  setModalIsOpen,
  setClickedRoom,
}) {
  const handleJoinRoom = (roomId, item) => {
    console.log(roomId);
    console.log(item);
    item.roomId = roomId;
    setClickedRoom(item);
    setModalIsOpen(true);
  };

  return (
    <div>
      {list &&
        Object.entries(list).map(([key, item]) => {
          return (
            <div
              key={item["roomName"]}
              className="flex flex-row justify-between p-3 my-4"
            >
              <div className="flex flex-row items-center gap-3 text-center">
                <span className="text-lg font-bold">{item["roomName"]}</span>
                {item["currentUser"].length === item["maxNumberOfPerson"] && (
                  <span className="font-semibold text-slate-500">
                    [자리없음]
                  </span>
                )}
              </div>
              <Button
                text={"들어가기"}
                onClick={() => handleJoinRoom(key, item)}
              />
            </div>
          );
        })}
    </div>
  );
}
