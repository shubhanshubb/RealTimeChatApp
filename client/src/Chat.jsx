import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { IoSend } from 'react-icons/io5';

function Chat({ socket, roomid }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      await socket.emit('send-message', {
        room: roomid,
        message: currentMessage.trim(),
      });
      setMessageList((list) => [...list,  {
        room: roomid,
        message: currentMessage.trim(),
      }]);

    }
    setCurrentMessage('');
  };

  // listening event in frontend and receiving data from backend
  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off('receive-message');
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chugli Chatting | roomID: {roomid}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div className="message" key={index}>
              <div>
                <div className="message-meta">
                  <p id="author">{messageContent.author}</p>
                </div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Say Something..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onClick={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default Chat;
