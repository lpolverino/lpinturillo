const WORDS = ["Cosmopolita", "Lavanderia", "Terraza", "Milicia", "Queso Untable"]

const lobbys = (function(){
  let gamesLobbys = []

  const findGame = (lobbyID) => {
    return gamesLobbys.find(game => game.lobbyId === lobbyID)
  }

  const addGame = (lobbyId) => {
    const newGame = {
      players:[],
      lobbyId: lobbyId,
      isActive: false
    }
    gamesLobbys.push(newGame)
    return newGame.lobbyId
  }

  const addPlayer = (lobbyId, playerName) => {
    const game = findGame(lobbyId);
    if(game === undefined) return
    game.players.push({
      name:playerName,
      owner:game.players.length === 0
    })
  }

  const showGames = () => {
    console.log(gamesLobbys);
  }

  const isAlreadyInGame = (lobby, user) => {
    const game = findGame(lobby)
    const player = game.players.find(player => player.name === user)
    return player !== undefined
  }

  const addPlayerSocket = (socket, playerName, playerLobbyId) => {
    gamesLobbys = gamesLobbys.map(game => {
      if( game.lobbyId === playerLobbyId){
        const newPlayers = game.players.map(player => player.name === playerName ? {...player, socket}: player)
        return {...game, players: newPlayers}
      } else {
        return game
     }
    }  
  )}

  const disconectPlayer = (playerName, playerLobbyId) => {
    const gameToUpdate = gamesLobbys.find(game => game.lobbyId === playerLobbyId)
    console.log(gameToUpdate.players.length === 1);
    console.log(gameToUpdate);
    
    if (gameToUpdate.players.length === 1 ) {
      gamesLobbys = gamesLobbys.filter(game =>
        game.lobbyId !== playerLobbyId
      )
    }
    else{
      gamesLobbys = gamesLobbys.map( game => {
        return game.lobbyId === playerLobbyId
        ? {...game, players: game.players.filter(player => player.name !== playerName)}
        : game
      })
    }
  }

  const cantStartTheLobby = (playerName, lobbyId) => {
    const game = gamesLobbys.find(game => game.lobbyId === lobbyId)
    const player = game.players.find(player => player.name === playerName)
    return player.owner
  }

  const startLobby = (lobbyId) => {
    const startingWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    gamesLobbys = gamesLobbys.map(game => {
      if(game.lobbyId===lobbyId){
        return {...game, isActive:true, word:startingWord}
      }
      return game
    })
    return startingWord
  }

  const lobbyStarted = (lobbyId) => {    
    const game = gamesLobbys.find(game => game.lobbyId === lobbyId)

    return game.isActive
  }
  
  const isTheCorrectAwnser = (lobbyId, awnser) => {
    if(typeof awnser !== "string") return false
    const trimedAwnser = awnser.trim();
    const game = gamesLobbys.find(game => game.lobbyId === lobbyId)
    return trimedAwnser === game.word
  }

  const changeOwner = (lobbyId, name) => { 
    const game = gamesLobbys.find(game => game.lobbyId === lobbyId)
    game.players = game.players.map(player => {
      return {...player, owner: player.name === name}
    })
    console.log(game);
    
  }

  return {
    addGame,
    findGame,
    addPlayer,
    showGames,
    isAlreadyInGame,
    addPlayerSocket,
    disconectPlayer,
    cantStartTheLobby,
    startLobby,
    lobbyStarted,
    isTheCorrectAwnser,
    changeOwner,
  }
})();

module.exports = lobbys