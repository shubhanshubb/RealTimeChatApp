import './App.css';
import {useState, useEffect} from 'react'
import io from 'socket.io-client' //for establishing connection
import Chat from './Chat';

const socket = io.connect("http://10.100.7.18:3000") //connecting frontend to backend

function App() {
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  const Socket = socket;
  const joinRoom = ()=>{
    socket.emit('join-room', room);
    setShowChat(true);
  }
  useEffect(() => {
    // console.log(socket);
    Socket.on('connect', () => {
      console.log('Connected to server');
    });
    console.log('jbdsjs');
    Socket.on('receive-message', data => {
      setShowChat(data)
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
        <button onClick={joinRoom}>Join the chat</button>
      </div>
    ) : (
      <Chat socket={socket} roomid={room} />
    )}
  </div>
  );
}

export default App;
