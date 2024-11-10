import { useEffect, useState } from "react"
import {socket} from "./socket"
import MessageInput from "./components/MessageInput"
import MessagesBoard from "./components/MessagesBoard"
import ConnectionState from "./components/ConnectionState"
import Events from "./components/Events"
import { ConnectionManager } from "./components/ConnectionManager"

function App() {
  
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userName, setUserName] = useState("new user");

  useEffect( () => {
    const onConnect = () => {
      setIsConnected(true)
    };
    
    const onDisconnect = () => {
      setIsConnected(false)
    };

    const onMessage = (newMessage) => {
      setMessages(previus => [...previus, {id:newMessage.user, message:newMessage.message}])
    }
    
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat", onMessage)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat", onMessage)
    }
  },
   [])

  const addValue = (newValue) => {
    if(newValue === "") return
    const newArray = messages.concat([{id:userName, message:newValue}])
    setMessages(newArray)
    socket.timeout(5000).emit("chat", {user:userName, message: newValue}, () => { console.log("emmited");
    });
  }
  
  return (
    <>
      <div>
        <ConnectionState isConnected={isConnected}></ConnectionState>
        <Events events={[]}></Events>
        <MessagesBoard messages={messages}></MessagesBoard>
        <MessageInput 
          onClickHandler={(newvalue) => addValue(newvalue)}
          userName={userName}
          changeUserName={(newUserName) => setUserName(newUserName) }>
        </MessageInput>
        <ConnectionManager></ConnectionManager>
      </div>
   </>
  )
}

export default App
