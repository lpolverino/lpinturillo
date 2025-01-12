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
  const [gameState, setGameState] = useState(false);
  const [currentWord, setCurrentWord] = useState(undefined)
  const [currentWinner,setCurrentWinner] = useState(undefined)
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
    
    const onErrorFromServer = (error) => {
      console.log(error);
    }

    const onStartGame = () => {
      console.log("start");
      setGameState(true)
    }

    const onNewWord = (word) => {
      console.log(word);
      
      setCurrentWord(word.word)      
    }

    const onAwnser = (winnerName) => {
      console.log(winnerName);
      setCurrentWinner(winnerName);
      setGameState(false)
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat", onMessage)
    socket.on("users-online", onUsersOnline)
    socket.on("error", onErrorFromServer)
    socket.on("start", onStartGame)
    socket.on("get-word", onNewWord)
    socket.on("awnser", onAwnser)
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat", onMessage)
      socket.off("users-online", onUsersOnline)
      socket.off("error", onErrorFromServer)
      socket.off("start", onStartGame)
      socket.off("get-word", onNewWord)
      socket.off("awnser", onAwnser)
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
    socket.emit("chat", {user:userName, message: newValue}, () => { console.log("emmited");
    });
  }
  
  return (
    <>
      <div>
        {currentWord !== undefined ? <p>{"WORD:" + currentWord} </p>: <p>Press Start</p>}
        <Canva lobby={userState.lobby} gameState={gameState}></Canva>
        {currentWinner !== undefined && <p>{""+currentWinner}</p>}
        <MessagesBoard messages={messages}></MessagesBoard>
        <MessageInput 
          onClickHandler={(newvalue) => addValue(newvalue)}
          userName={userName}
          changeUserName={(newUserName) => setUserName(newUserName) }>
        </MessageInput>
        <button onClick={()=>{socket.emit("start-game", userState.lobby)}}>Start</button>
        <p>{'' + isConnected}</p>
        <ConnectionManager></ConnectionManager>
        <p>Users Online: {usersOnline}</p>
      </div>
   </>
  )
}

Game.propTypes = {
  userState: PropTypes.objectOf({
    name: PropTypes.string,
    lobby: PropTypes.string
  })
}

export default Game
