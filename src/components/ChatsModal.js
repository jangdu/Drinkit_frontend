import React, { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import Video from "./Video";
import Peer from "peerjs";

const ChatsModal = ({ clickedRoom, socket, setModalIsOpen }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  // vid
  const [users, setUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null); // 로컬 비디오 스트림 상태 추가
  const [peer, setPeer] = useState(null); // Peer 객체 상태 추가
  const [remoteStreams, setRemoteStreams] = useState([]); // 원격 비디오 스트림 목록 상태 추가
  const [connectedPeers, setConnectedPeers] = useState([]);
  const [remotePeerStreams, setRemotePeerStreams] = useState({});

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async (stream) => {
        await setLocalStream(stream); // 로컬 스트림 설정
        console.log("a");

        // PeerJS 초기화
        const peer = new Peer();
        await setPeer(peer); // Peer 객체 설정
        console.log(peer);

        peer.on("open", (peerId) => {
          console.log("My peer ID is: " + peerId);
          // 서버 또는 다른 사용자와 피어 ID를 공유
          socket.emit("shareId", peerId);
        });

        peer.on("connection", (conn) => {
          conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
          });
          conn.on("open", () => {
            conn.send("hello!!");
          });
        });
        // 원격 스트림 수신 이벤트 핸들러 추가
        peer.on("call", (call) => {
          if (!connectedPeers.includes(call.peer)) {
            connectedPeers.push(call.peer);
            setConnectedPeers([...connectedPeers]);

            call.answer(stream);
            call.on("stream", (remoteStream) => {
              setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    console.log("momomo");

    // 채팅방에 입장하기 위해 서버에 join 이벤트를 전송합니다.
    console.log(clickedRoom);
    socket.emit("joinRoom", clickedRoom);
    socket.on("joinedRoom", handleNewMessage);
    socket.on("userJoined", handleNewMessage);
    socket.on("broadcastMessage", handleNewMessage);
    socket.on("sharedId", async (id) => {
      console.log(id);
      await setTimeout(() => {
        console.log("sett", peer);
      }, 1000);

      // Peer 객체가 정상적으로 초기화된 후에 shareVideoAndAudio 함수 호출
      if (peer) {
        console.log("1");
        shareVideoAndAudio(id);
      } else {
        console.log("아직 피어가 없습니답");
      }
    });

    ///////////////////////////////////////////

    // const iceServers = [
    //   { urls: "stun:stun.l.google.com:19302" }, // Google STUN 서버 주소
    // ];

    // const peerConnection = new RTCPeerConnection({ iceServers });

    return () => {
      socket.off("broadcastMessage");
      socket.off("userJoined");
      socket.off("joinedRoom");
    };
  }, [socket, clickedRoom]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      // 입력한 메시지를 서버로 전송합니다.
      socket.emit("sendChat", messageInput);
      setMessages((prevMessages) => [...prevMessages, `me: ${messageInput}`]);
      setMessageInput("");
    }
  };

  const shareVideoAndAudio = async (remotePeerId) => {
    console.log(remotePeerId);
    const call = await peer.call(remotePeerId, localStream); // 원격 사용자에게 호출

    console.log("id from sharVAA", remotePeerId);
    call.on("stream", (remoteStream) => {
      // 원격 비디오 스트림을 받아와서 화면에 표시
      console.log(remoteStream);

      // 이미 연결된 원격 피어인지 확인
      if (!remotePeerStreams[remotePeerId]) {
        setRemotePeerStreams((prevStreams) => ({
          ...prevStreams,
          [remotePeerId]: remoteStream,
        }));
      }
    });
  };

  const handleNewMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, `${data}`]);
  };

  return (
    <div style={{ height: "90%", overflowY: "auto" }}>
      <h2>{clickedRoom.name} 채팅방</h2>
      <Video stream={localStream} autoPlay={true} />
      {Object.keys(remotePeerStreams).map((remotePeerId, index) => (
        <Video key={index} stream={remotePeerStreams[remotePeerId]} autoPlay={true} />
      ))}

      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className="absolute bottom-0">
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="메시지를 입력하세요." />
        <Button text="전송" onClick={handleSendMessage} />
      </div>
      <div className="absolute right-3 top-3">
        <Button
          text="나가기"
          onClick={() => {
            // 채팅 나가기
            socket.emit("leaveRoom", clickedRoom.name);
            setModalIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default ChatsModal;
