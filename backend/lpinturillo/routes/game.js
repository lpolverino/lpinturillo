const express = require('express');
const router = express.Router();
const lobby = require('../lobbys')

let uid = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  return
});

router.post('/enter', async function(req,res,next) {
  
//  const game = games.find(element => element.lobbyId === req.body.lobbyID )
  const game = lobby.findGame(req.body.lobbyID);
  let status = undefined
  let response = {}

  if(game !== undefined){
    status = game.lobbyId
    if (lobby.isAlreadyInGame(req.body.lobbyID, req.body.name)) {
      status = -1
      response.errormsg = "User Already Used"
    }
  } else{
    status = lobby.addGame(req.body.lobbyID)
  }

  lobby.addPlayer(status, req.body.name)
  
  response.status = status
  return res.json(response)
})

module.exports = router;
