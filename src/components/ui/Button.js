import React, { useState } from "react";

export default function Button({ onClick, text, disabled, isActive }) {
  const [mouseDown, setMouseDown] = useState(false);
  return (
    <button
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        setTimeout(() => {
          setMouseDown(false);
        }, 100);
      }}
      className={`font-semibold rounded-full py-1 px-2 ${mouseDown && "bg-slate-200"} ${isActive ? "bg-pink-300" : " hover:text-pink-500"} `}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </button>
  );
}
