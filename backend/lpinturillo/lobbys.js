const lobbys = (function(){
  let gamesLobbys = []

  const findGame = (lobbyID) => {
    return gamesLobbys.find(game => game.lobbyId === lobbyID)
  }

  const addGame = (lobbyId) => {
    const newGame = {
      players:[],
      lobbyId: lobbyId,
    }
    gamesLobbys.push(newGame)
    return newGame.lobbyId
  }

  const addPlayer = (lobbyId, player) => {
    const game = findGame(lobbyId);
    if(game === undefined) return
    game.players.push(player)
  }

  const showGames = () => {
    console.log(gamesLobbys);
  }

  const isAlreadyInGame = (lobby, user) => {
    const game = findGame(lobby)
    const player = game.players.find(player => player === user)
    return player !== undefined
  }

  const addPlayerSocket = (scoket, playerName, playerLobbyId) => {
    //TODO
  }

  const disconectPlayer = (playerName, playerLobbyId) => {
    //TODO
  }

  return {
    addGame,
    findGame,
    addPlayer,
    showGames,
    isAlreadyInGame,
  }
})();

module.exports = lobbys