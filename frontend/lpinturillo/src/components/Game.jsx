import { useEffect, useState } from "react"
import { socket } from "../socket"
import MessageInput from "./MessageInput"
import MessagesBoard from "./MessagesBoard"
import { ConnectionManager } from "./ConnectionManager"
import Canva from "./Canva"
import PropTypes from "prop-types"

function Game({userState}) {
  
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userName, setUserName] = useState("new user");
  const [usersOnline, setUsersOnline] = useState(0);

  useEffect( () => {

    const onConnect = () => {
      setIsConnected(true)
    };
    
    const onDisconnect = () => {
      setIsConnected(false)
      setUsersOnline(previus => previus-1)
    };

    const onMessage = (newMessage) => {
      setMessages(previus => [...previus, {id:newMessage.user, message:newMessage.message}])
    }

    const onUsersOnline = (initualUsers) => {
      setUsersOnline(initualUsers)
    }
    
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat", onMessage)
    socket.on("users-online", onUsersOnline)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat", onMessage)
      socket.off("users-online", onUsersOnline)
    }
  },[userState])

  useEffect(()=> {
    console.log(userState);
    socket.emit("credentials", userState)
  },[isConnected, userState])

  const addValue = (newValue) => {
    if(newValue === "") return
    const newArray = messages.concat([{id:userName, message:newValue}])
    setMessages(newArray)
    socket.current.timeout(5000).emit("chat", {user:userName, message: newValue}, () => { console.log("emmited");
    });
  }
  
  return (
    <>
      <div>
        <p>{'' + isConnected}</p>
        <Canva></Canva>
        <MessagesBoard messages={messages}></MessagesBoard>
        <MessageInput 
          onClickHandler={(newvalue) => addValue(newvalue)}
          userName={userName}
          changeUserName={(newUserName) => setUserName(newUserName) }>
        </MessageInput>
        <ConnectionManager></ConnectionManager>
        <p>Users Online: {usersOnline}</p>
      </div>
   </>
  )
}

Game.propTypes = {
  gameState: PropTypes.objectOf({
    name: PropTypes.string,
    lobby: PropTypes.string
  })
}

export default Game
