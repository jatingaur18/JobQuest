// src/pages/MeetingRoom.tsx
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function MeetingRoom() {
  const { roomId } = useParams();
  const containerRef = useRef(null);

  useEffect(() => {
    const loadJitsi = () => {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomId,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };
      // @ts-ignore
      const api = new window.JitsiMeetExternalAPI(domain, options);
    };

    if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = loadJitsi;
      document.body.appendChild(script);
    }
  }, [roomId]);

  return (
    <div className="h-screen w-full" ref={containerRef}>
    </div>
  );
}
