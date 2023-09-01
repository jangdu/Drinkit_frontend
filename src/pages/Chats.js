import React, { useRef, useEffect, useState, forwardRef } from "react";
import io from "socket.io-client";
import Video from "../components/Video";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const SOCKET_SERVER_URL = "http://localhost:8000";

const Chats = () => {
  const { roomId } = useParams(); // roomId 가져오기
  const socketRef = useRef();
  const pcsRef = useRef({});
  const localVideoRef = useRef();
  const localStreamRef = useRef();
  const [users, setUsers] = useState([]);
  const { user, isLoading } = useAuthContext();

  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.log(error);
      }
    };

    init();

    // Establish socket connection and setup local stream
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    getLocalStream();

    socketRef.current.emit("join_room", {
      room: roomId,
      email: user.email,
    });

    // Event listener for receiving list of all users
    socketRef.current.on("all_users", (allUsers) => {
      allUsers.forEach(async (user) => {
        const pc = createPeerConnection(user.id, user.email);
        if (!pc || !socketRef.current) return;
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socketRef.current.emit("offer", {
            sdp: localSdp,
            offerSendID: socketRef.current.id,
            offerSendEmail: "offerSendSample@sample.com",
            offerReceiveID: user.id,
          });
        } catch (error) {
          console.error(error);
        }
      });
    });

    // Event listener for receiving offer from another user
    socketRef.current.on("getOffer", async (data) => {
      const pc = createPeerConnection(data.offerSendID, data.offerSendEmail);
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socketRef.current.emit("answer", {
          sdp: localSdp,
          answerSendID: socketRef.current.id,
          answerReceiveID: data.offerSendID,
        });
      } catch (error) {
        console.error(error);
      }
    });

    // Event listener for receiving answer from another user
    socketRef.current.on("getAnswer", async (data) => {
      const pc = pcsRef.current[data.answerSendID];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } catch (error) {
        console.error(error);
      }
    });

    // Event listener for receiving ICE candidate from another user
    socketRef.current.on("getCandidate", (data) => {
      const pc = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      pc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
        console.log("Candidate added successfully");
      });
    });

    // Event listener for user exit
    socketRef.current.on("user_exit", (data) => {
      const pc = pcsRef.current[data.id];
      if (pc) {
        pc.close();
        delete pcsRef.current[data.id];
      }
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
    });

    return () => {
      // Clean up socket connection and peer connections
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      Object.values(pcsRef.current).forEach((pc) => {
        pc.close();
      });
    };
  }, []); // Empty dependency array to run this effect only once

  // Function to get local media stream
  const getLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;
      socketRef.current.emit("join_room", {
        room: "1234",
        email: "sample@naver.com",
      });
    } catch (error) {
      console.log(`getUserMedia error: ${error}`);
    }
  };

  // Function to create peer connection
  const createPeerConnection = (socketID, email) => {
    try {
      const pc = new RTCPeerConnection(pc_config);

      pc.onicecandidate = (e) => {
        if (!(socketRef.current && e.candidate)) return;
        socketRef.current.emit("candidate", {
          candidate: e.candidate,
          candidateSendID: socketRef.current.id,
          candidateReceiveID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email,
              stream: e.streams[0],
            })
        );
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pcsRef.current[socketID] = pc;

      return pc;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  return (
    <div>
      <Video
        style={{
          width: 240,
          height: 240,
          margin: 5,
          backgroundColor: "black",
        }}
        muted
        ref={localVideoRef}
        autoPlay
      />
      {users.map((user, index) => (
        <Video key={index} email={user.email} stream={user.stream} />
      ))}
    </div>
  );
};

export default Chats;
