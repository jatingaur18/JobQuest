import React, { useEffect, useRef, useState } from "react"
import { Phone, Copy, PhoneOff } from "lucide-react"
import Peer from "simple-peer"
import io from "socket.io-client"

const socket = io.connect('http://localhost:3000')

const App = () => {
  const [me, setMe] = useState("")
  const [stream, setStream] = useState(null)
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        setStream(mediaStream)
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream
        }
      } catch (err) {
        setError("Failed to access camera and microphone")
        console.error("Failed to get media stream:", err)
      }
    }

    getMediaStream()

    socket.on("me", (id) => {
      setMe(id)
    })

    socket.on("callUser", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const callUser = (id) => {
    if (!stream) {
      setError("Camera access is required to make a call")
      return
    }

    try {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      })

      peer.on("signal", (data) => {
        socket.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: me,
          name: name
        })
      })

      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream
        }
      })

      peer.on("error", (err) => {
        console.error("Peer error:", err)
        setError("Connection error occurred")
      })

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true)
        peer.signal(signal)
      })

      connectionRef.current = peer
    } catch (err) {
      console.error("Error in callUser:", err)
      setError("Failed to initiate call")
    }
  }

  const answerCall = () => {
    if (!stream) {
      setError("Camera access is required to answer the call")
      return
    }

    try {
      setCallAccepted(true)
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      })

      peer.on("signal", (data) => {
        socket.emit("answerCall", { signal: data, to: caller })
      })

      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream
        }
      })

      peer.on("error", (err) => {
        console.error("Peer error:", err)
        setError("Connection error occurred")
      })

      peer.signal(callerSignal)
      connectionRef.current = peer
    } catch (err) {
      console.error("Error in answerCall:", err)
      setError("Failed to answer call")
    }
  }

  const leaveCall = () => {
    try {
      setCallEnded(true)
      if (connectionRef.current) {
        connectionRef.current.destroy()
      }
      // Stop local stream tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      // Reset video elements
      if (myVideo.current) {
        myVideo.current.srcObject = null
      }
      if (userVideo.current) {
        userVideo.current.srcObject = null
      }
    } catch (err) {
      console.error("Error in leaveCall:", err)
    }
  }

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(me)
    } catch (err) {
      console.error("Failed to copy:", err)
      setError("Failed to copy ID")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Video Call App</h1>
      
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative bg-gray-800 rounded-lg overflow-hidden min-h-[300px]">
            {stream ? (
              <video 
                playsInline 
                muted 
                ref={myVideo} 
                autoPlay 
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                Waiting for camera access...
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-900/80 px-2 py-1 rounded">You</span>
          </div>
          
          <div className="relative bg-gray-800 rounded-lg overflow-hidden min-h-[300px]">
            {callAccepted && !callEnded ? (
              <video 
                playsInline 
                ref={userVideo} 
                autoPlay 
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                No incoming video
              </div>
            )}
            {callAccepted && !callEnded && (
              <span className="absolute bottom-2 left-2 bg-gray-900/80 px-2 py-1 rounded">
                {name || 'Caller'}
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            
            <div className="flex gap-2">
              <input
                type="text"
                value={me}
                readOnly
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                placeholder="Your ID"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ID to Call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                className="flex-1 p-2 rounded bg-gray-700 text-white"
              />
              {callAccepted && !callEnded ? (
                <button
                  onClick={leaveCall}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => callUser(idToCall)}
                  disabled={!stream}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {receivingCall && !callAccepted && (
          <div className="mt-4 bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-xl mb-4">{name} is calling...</h3>
            <button
              onClick={answerCall}
              disabled={!stream}
              className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Answer Call
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App