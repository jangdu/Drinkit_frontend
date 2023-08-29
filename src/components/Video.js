import { forwardRef, useEffect, useState } from "react";

const Video = forwardRef(({ email, stream, muted }, ref) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.srcObject = stream;
    }
    if (muted) {
      setIsMuted(muted);
    }
  }, [stream, muted, ref]);

  return (
    <div>
      <video ref={ref} muted={isMuted} autoPlay />
      <span>{email}</span>
    </div>
  );
});
export default Video;
