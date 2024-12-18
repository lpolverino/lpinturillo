import { useState } from "react";
import PropTypes from "prop-types"

const Lobby = ({enterLobby}) => {
  
  const [name, setName] = useState("");
  const [lobbyID, setLobbyId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      name,lobbyID
    });
    try{
      const response = await fetch("http://localhost:3000/game/enter",{
        method:"POST",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          lobbyID
        }) 
      }) 
      const body = await response.json();
      if(body.status !== undefined && body.status >= 0){
        enterLobby(name, lobbyID)
      }else{
        console.log("couldn enter the lobby");
      }
    }catch(error){
      console.log(error);
    }
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" onChange={(e) => setName(e.target.value)}></input>
        <label htmlFor="lobby">Lobby:</label>
        <input id="lobby" name="lobby" onChange={(e) => setLobbyId(e.target.value)}></input>
        <button>Enter</button>
      </form>
    </div>
  )
}

Lobby.propTypes = {
  enterLobby: PropTypes.func
}

export default Lobby