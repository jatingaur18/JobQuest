import { useState, useRef, useEffect } from 'react';

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoCall() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const joinRoom = async () => {
    if (!roomId) return alert("Enter a room ID");

    wsRef.current = new WebSocket('ws://localhost:3000');

    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: 'join', roomId }));
    };

    wsRef.current.onmessage = async ({ data }) => {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'offer':
          handleOffer(message.offer, message.roomId);
          break;
        case 'answer':
          handleAnswer(message.answer);
          break;
        case 'ice-candidate':
          handleNewICECandidate(message.candidate);
          break;
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));

    peerConnectionRef.current.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
      remoteVideoRef.current.srcObject = stream;
    };

    peerConnectionRef.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        wsRef.current.send(JSON.stringify({ type: 'ice-candidate', candidate, roomId }));
      }
    };

    setJoined(true);
  };

  const startCall = async () => {
    if (!peerConnectionRef.current) return;

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    wsRef.current.send(JSON.stringify({ type: 'offer', offer, roomId }));
  };

  const handleOffer = async (offer, senderRoomId) => {
    if (senderRoomId !== roomId) return; // Ignore offers from other rooms

    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    wsRef.current.send(JSON.stringify({ type: 'answer', answer, roomId }));
  };

  const handleAnswer = async (answer) => {
    await peerConnectionRef.current.setRemoteDescription(answer);
  };

  const handleNewICECandidate = async (candidate) => {
    await peerConnectionRef.current.addIceCandidate(candidate);
  };

  const leaveRoom = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    
    setLocalStream(null);
    setRemoteStream(null);
    setJoined(false);
    setRoomId('');
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">WebRTC Room-Based Video Call</h1>

      {!joined ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <button onClick={joinRoom} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Join Room
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            <div className="relative">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-80 h-60 bg-gray-200 rounded" />
              <p className="absolute bottom-2 left-2 text-white">You</p>
            </div>
            <div className="relative">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-80 h-60 bg-gray-200 rounded" />
              <p className="absolute bottom-2 left-2 text-white">Remote</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={startCall} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Start Call
            </button>
            <button onClick={leaveRoom} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Leave Room
            </button>
          </div>
        </>
      )}
    </div>
  );
}
