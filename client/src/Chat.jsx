import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import {IoSend} from 'react-icons/io5'

function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async ()=>{
        if(currentMessage !== ''){
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
            }

            await socket.emit("send_message", messageData)
            setMessageList((list)=>[...list, messageData])
        }
        setCurrentMessage('')
    }

    // listening event in frontend and receiving data from backend
    useEffect(()=>{
        socket.on("receive_message", (data)=>{
            setMessageList((list)=>[...list, data])
        })
    }, [socket])
  return (
    <div className="chat-window">
    <div className="chat-header">
      <p>Chugli Chatting | roomID: {room}</p>
    </div>
    <div className="chat-body">
      <ScrollToBottom className="message-container">
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username === messageContent.author ?"you":"other"}
            >
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
          );
        })}
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
        onKeyPress={(event) => {
          event.key === "Enter" && sendMessage();
        }}
      />
      <button onClick={sendMessage}><IoSend/></button>
    </div>
  </div>
  )
}

export default Chat
