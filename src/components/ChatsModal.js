import React, { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import Peer, { DataConnection } from "peerjs";
import { AiOutlineClose } from "react-icons/ai";
import { BiChat } from "react-icons/bi";

const ChatsModal = ({ clickedRoom, socket, socketId, setModalIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isOpenedChat, setIsOpenChat] = useState(false);
  const scrollContainerRef = useRef(null);
  // Peer
  const [peer, setPeer] = useState(null);
  // const [myPeerId, setMyPeerId] = useState();
  // const [peers, setPeers] = useState([]);
  // const [conn, setConn] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  // Scroll
  useEffect(() => {
    // 스크롤 컨테이너의 scrollTop을 최대로 설정하여 항상 아래로 스크롤합니다.
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Video
  useEffect(() => {
    const container = document.getElementById("myVideoContainer");

    const handleMouseDown = (e) => {
      const containerRect = container.getBoundingClientRect(); // 현재 위치 정보 가져오기
      const initialX = e.clientX - containerRect.left; // 클릭한 위치에서 컨테이너의 좌측 모서리까지의 거리
      const initialY = e.clientY - containerRect.top; // 클릭한 위치에서 컨테이너의 상단 모서리까지의 거리

      setIsDragging(true);
      let draggging = true;
      container.classList.add("dragging");

      const handleMouseMove = (event) => {
        if (!draggging) return;

        const dx = event.clientX - initialX; // X 방향 이동 거리
        const dy = event.clientY - initialY; // Y 방향 이동 거리

        // 현재 위치에서 이동 거리만큼 더한 위치로 설정
        container.style.left = `${dx}px`;
        container.style.top = `${dy}px`;
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        draggging = false;
        container.classList.remove("dragging");

        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    container.addEventListener("mousedown", handleMouseDown);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Peer
  useEffect(() => {
    const peer = new Peer(socketId);
    setPeer(peer);

    socket.emit("joinRoom", clickedRoom);
  }, []);

  // peer.on("open", function (id) {
  //   setMyPeerId(id);

  //   clickedRoom.peerId = id;
  //   socket.emit("joinRoom", clickedRoom);
  // });

  // peer.on("connection", function (conn) {
  //   // 새로운 연결이 설정될 때 처리
  //   setPeers((prev) => [...prev, conn]);

  //   conn.on("data", function (data) {
  //     // 연결된 피어에서 수신
  //     console.log("connected!!", data);
  //     setChatMessages((prevMessages) => [...prevMessages, data]);
  //   });
  // });

  // // 전화 걸기

  // const userMedia = navigator.mediaDevices.getUserMedia({
  //   video: true,
  //   audio: false,
  // });
  // userMedia.then((stream) => {
  //   const videoElement = document.createElement("video");
  //   videoElement.srcObject = stream;
  //   // videoElement.className = "absolute bottom-10 w-96";
  //   videoElement.autoplay = true; // 자동 재생 설정
  //   videoElement.className =
  //     "border border-2 border-pink-500 rounded-lg shadow-xl";

  //   // 비디오를 화면에 추가
  //   const videoContainer = document.getElementById("myVideoContainer");
  //   videoContainer.appendChild(videoElement);
  // });

  // peer.on("call", function (call) {
  //   //2 받기
  //   userMedia.then((mediaStream) => {
  //     // Answer the call, providing our mediaStream
  //     call.answer(mediaStream); // 3 답장하고
  //     call.on("stream", function (stream) {
  //       console.log("스트림 받았다잉");
  //       // 2-1. 받은거 작업
  //       // `stream` is the MediaStream of the remote peer.
  //       // Here you'd add it to an HTML video/canvas element.
  //       const videoElement = document.createElement("video");
  //       videoElement.srcObject = stream;
  //       videoElement.autoplay = true; // 자동 재생 설정
  //       videoElement.className = "border rounded-lg shadow-xl";

  //       // 비디오를 화면에 추가
  //       const videoContainer = document.getElementById("videoContainer");
  //       videoContainer.appendChild(videoElement);
  //     });
  //   });
  // });

  // socket.on("joinedRoom", handleNewMessage);
  // socket.on("userJoined", handleNewMessage);
  // socket.on("broadcastMessage", handleNewMessage);

  // // id: 공유받은 id
  // socket.on("sharedId", async (id) => {
  //   const peerConn = peer.connect(id);
  //   setConn(peerConn);
  //   newConection(id, peerConn);
  // });

  // const newConection = (id, conn) => {
  //   conn.on("open", function () {
  //     conn.send("hi!", id);
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: false })
  //       .then((mediaStream) => {
  //         // Call a peer, providing our mediaStream
  //         var call = peer.call(id, mediaStream); // 1 걸기

  //         call.on("stream", function (stream) {
  //           console.log(stream);
  //           const videoElement = document.createElement("video");
  //           videoElement.srcObject = stream;
  //           videoElement.autoplay = true; // 자동 재생 설정
  //           videoElement.className = "border rounded-lg shadow-xl";

  //           // 비디오를 화면에 추가
  //           const videoContainer = document.getElementById("videoContainer");
  //           videoContainer.appendChild(videoElement);
  //         });
  //       });
  //   });
  // };

  const handleLeaveRoom = () => {
    socket.emit("outRoom", clickedRoom);

    setModalIsOpen(false);
    window.location.reload();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageInput.trim() !== "") {
      // 입력한 메시지를 서버로 전송합니다.
      socket.emit("sendChat", messageInput);
      setMessages((prevMessages) => [...prevMessages, `me: ${messageInput}`]);
      setMessageInput("");
    }
  };

  const handleNewMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, `${data}`]);
  };

  const handleBoomBtn = () => {
    socket.emit("deleteRoom", clickedRoom.name);
  };

  return (
    <div style={{ height: "90%", overflowY: "auto" }}>
      <div id="myVideoContainer" className={`w-60 index99 ${"draggable-container"}`}></div>
      <div id="videoContainer" className="grid grid-cols-2"></div>
      <div className={`absolute ${isOpenedChat && "hidden"} min-w-[280px] w-[30%] rounded-lg bottom-3 right-14 h-[90%] shadow-lg p-4 bg-pink-200 bg-opacity-80`}>
        <div ref={scrollContainerRef} className={`overflow-y-auto h-[90%] no-scrollbar overscroll-none `} style={{ whiteSpace: "nowrap" }}>
          {chatMessages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.from}: </strong>
              {msg.text}
            </div>
          ))}
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <form className="absolute bottom-0 right-0 w-full" onSubmit={handleSendMessage}>
          <input required type="text" className="bg-transparent p-4 w-[85%]" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="메시지를 입력하세요." />
          <Button text=">" />
        </form>
      </div>
      {clickedRoom.roomOwner === socketId && (
        <div className="absolute text-xl titleFont right-16 flex flex-col h-[95%] top-5 ">
          <button
            className="hover:text-red-500"
            onClick={() => {
              handleBoomBtn();
            }}>
            손 튕기기
          </button>
        </div>
      )}

      <div className="absolute text-4xl right-3 flex flex-col h-[95%] top-4 justify-between">
        <button
          className="hover:text-red-500"
          onClick={() => {
            // 채팅 나가기
            handleLeaveRoom();
          }}>
          <AiOutlineClose />{" "}
        </button>
        <button className="hover:text-red-500" onClick={() => setIsOpenChat(!isOpenedChat)}>
          <BiChat />
        </button>
      </div>
    </div>
  );
};

export default ChatsModal;
