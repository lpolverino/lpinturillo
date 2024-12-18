import { useState } from "react"
import Game from "./components/Game"
import Lobby from "./components/Lobby";

const App = () => {
  const [inGame, setInGame] = useState(false);
  const [userState, setUserState] = useState({
    name:undefined,
    gameID:undefined
  })

  const handleEnterLobby = (name, lobby) => {
    setInGame(true);
    setUserState({ name, lobby })
  }

  return inGame
    ?<Game userState={userState}></Game>
    :<Lobby enterLobby={handleEnterLobby}></Lobby>
}

export default App