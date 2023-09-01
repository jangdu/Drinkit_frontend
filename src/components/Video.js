import React, { useRef, useEffect } from "react";

const Video = ({ stream, muted, autoPlay }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      muted={muted}
      autoPlay={autoPlay}
      style={{
        width: "240px",
        height: "180px",
        margin: "5px",

        backgroundColor: "black",
      }}></video>
  );
};

export default Video;
