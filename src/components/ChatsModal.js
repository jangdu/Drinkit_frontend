import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import Peer from "peerjs";

const ChatsModal = ({ clickedRoom, socket, setModalIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuthContext();
  const [newPeer, setNewPeer] = useState();
  const [myPeerId, setMyPeerId] = useState();
  const [peers, setPeers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const [myVideo, setMyVieo] = useState();

  useEffect(() => {
    var peer = new Peer();
    setNewPeer(peer);

    peer.on("open", function (data) {
      console.log("me:", data);
      setMyPeerId(data);

      socket.emit("shareId", data);
    });

    peer.on("connection", function (conn) {
      // 새로운 연결이 설정될 때 처리
      setPeers((prev) => [...prev, conn]);

      conn.on("data", function (data) {
        // 연결된 피어에서 수신
        console.log(data);
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });
    });

    // 전화 걸기

    const userMedia = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    userMedia.then((stream) => {
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.autoplay = true; // 자동 재생 설정

      // 비디오를 화면에 추가
      const videoContainer = document.getElementById("videoContainer");
      videoContainer.appendChild(videoElement);
    });

    peer.on("call", function (call) {
      //2 받기
      userMedia.then((mediaStream) => {
        // Answer the call, providing our mediaStream
        call.answer(mediaStream); // 3 답장하고
        call.on("stream", function (stream) {
          console.log("스트림 받았다잉");
          // 2-1. 받은거 작업
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.autoplay = true; // 자동 재생 설정

          // 비디오를 화면에 추가
          const videoContainer = document.getElementById("videoContainer");
          videoContainer.appendChild(videoElement);
        });
      });
    });

    socket.emit("joinRoom", clickedRoom);
    socket.on("joinedRoom", handleNewMessage);
    socket.on("userJoined", handleNewMessage);
    socket.on("broadcastMessage", handleNewMessage);

    // id: 공유받은 id
    socket.on("sharedId", async (id) => {
      console.log("누구아이디", id);
      await newConection(id);
    });

    const newConection = (id) => {
      var conn = peer.connect(id);
      conn.on("open", function () {
        conn.send("hi!", id);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((mediaStream) => {
            // Call a peer, providing our mediaStream
            var call = peer.call(id, mediaStream); // 1 걸기

            call.on("stream", function (stream) {
              console.log(stream);
              const videoElement = document.createElement("video");
              videoElement.srcObject = stream;
              videoElement.autoplay = true; // 자동 재생 설정

              // 비디오를 화면에 추가
              const videoContainer = document.getElementById("videoContainer");
              videoContainer.appendChild(videoElement);
            });
          });
      });
    };

    return () => {
      socket.off("broadcastMessage");
      socket.off("userJoined");
      socket.off("joinedRoom");
    };
  }, [socket, clickedRoom]);

  const handleLeaveRoom = () => {
    socket.emit("deleteRoom", clickedRoom.name);

    if (newPeer) {
      newPeer.destroy(); // Peer 객체 파괴
    }

    setModalIsOpen(false);
    window.location.reload();
  };

  const handleSendMessage = () => {
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

  return (
    <div style={{ height: "90%", overflowY: "auto" }}>
      <h2>{clickedRoom.name} 채팅방</h2>
      <div id="myVideoContainer">
        {myVideo && <video srcObject={myVideo} autoPlay={true}></video>}
      </div>
      <div id="videoContainer"></div>
      <div>
        {chatMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="absolute bottom-0">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="메시지를 입력하세요."
        />
        <Button text="전송" onClick={handleSendMessage} />
      </div>
      <div className="absolute right-3 top-3">
        <Button
          text="나가기"
          onClick={() => {
            // 채팅 나가기
            handleLeaveRoom();
          }}
        />
      </div>
    </div>
  );
};

export default ChatsModal;
