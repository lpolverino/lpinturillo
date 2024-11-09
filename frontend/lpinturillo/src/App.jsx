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
  const {fooEvents, setFooEvents} = useState([])

  useEffect( () => {
    const onConnect = () => {
      setIsConnected(true)
    };
    
    const onDisconnect = () => {
      setIsConnected(false)
    };
    
    const onFooEvent = (value) => {
      setFooEvents(previous => [...previous, value])
    }
    
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);
    
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    }
  },
   [])

  const addValue = (newValue) => {
    const newArray = messages.concat([{id:newValue, message:newValue}])
    setMessages(newArray)
  }

  console.log(fooEvents);
  
  return (
    <>
      <div>
        <ConnectionState isConnected={isConnected}></ConnectionState>
        <Events events={[]}></Events>
        <MessagesBoard messages={messages}></MessagesBoard>
        <MessageInput onClickHandler={(newvalue) => addValue(newvalue)}></MessageInput>
        <ConnectionManager></ConnectionManager>
      </div>
   </>
  )
}

export default App
