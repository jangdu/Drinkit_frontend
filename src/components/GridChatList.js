import React from "react";
import Button from "./ui/Button";

export default function GridChatList({ list }) {
  console.log(list);
  return (
    <div>
      {list &&
        Object.entries(list).map(([roomSize, item]) => {
          console.log(item);
          return (
            <div key={item["roomName"]} className="flex flex-row justify-between  my-4 p-3">
              <div className="flex text-center flex-row items-center gap-3">
                <span className="text-lg font-bold">{item["roomName"]}</span>
                {item["currentUser"].length === item["maxNumberOfPerson"] && <span className="font-semibold text-slate-500">[자리없음]</span>}
              </div>
              <Button text={"들어가기"} />
            </div>
          );
        })}
    </div>
  );
}
