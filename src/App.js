import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client"; //for establishing connection
import Chat from "./Chat";

const socket = io.connect("http://10.100.30.113:3000"); //connecting frontend to backend

function App() {
  const [room, setRoom] = useState("");
  const [chatType, setChatType] = useState("");
  const [userId, setUserId] = useState("");
  const [showChat, setShowChat] = useState(false);

  const Socket = socket;
  const joinRoom = () => {
    socket.emit("joinRoom", room, chatType, userId);
    socket.on("notifyTutor")
    setShowChat(true);
  };
  useEffect(() => {
    // console.log(socket);
    Socket.on("connect", () => {
      console.log("Connected to server");
    });
    Socket.on("receiveMessage", (data) => {
      setShowChat(data);
    });
  }, [Socket]);

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Enter a room</h3>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Chat Type..."
            onChange={(event) => {
              setChatType(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="User ID..."
            onChange={(event) => {
              setUserId(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join the chat</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          roomId={room}
          chatType={chatType}
          userId={userId}
        />
      )}
    </div>
  );
}

export default App;
