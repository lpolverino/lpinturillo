const express = require('express');
const logger = require('morgan');
const {Server} = require("socket.io")
const cors = require("cors")
const lobbys = require("./lobbys")

const usersConnected = []

const gameRouter = require("./routes/game")

const app = express();

const server = require("node:http").Server(app)
const io = new Server(server, {
  cors:{
    origin: "http://localhost:5173"
  }
})

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next)=>  {
  res.io = io;
  next()
})
let counter = 0

io.on('connection', (socket) => { 
  console.log('a user connected ' + ++counter);

  const isLobbyStarted = () => {
    console.log({
      usersConnected,
      user:socket.id
    });
    const user = usersConnected.find(user => user.socket.id === socket.id)
    return lobbys.lobbyStarted(user.lobbyId)
  }

  io.emit("users-online", counter)
  socket.on("credentials", userCredentials => {
    const indexUser = usersConnected.findIndex(element => element.name === userCredentials.name);
    if (indexUser !== -1) return
    lobbys.addPlayerSocket(socket, userCredentials.name, userCredentials.lobby);
    socket.join(userCredentials.lobby)
    usersConnected.push({
        name:userCredentials.name,
        lobbyId: userCredentials.lobby,
        socket
    })
  })
  socket.on("user-disconnected", usetCredentials => {
    console.log(usetCredentials)
  })
  socket.on("chat", newChatMessage => {
    socket.broadcast.emit("chat", newChatMessage)
    const user = usersConnected.find(element => element.socket.id === socket.id)
    const {name, lobbyId} = user;
    
    if(lobbys.lobbyStarted(lobbyId) && lobbys.isTheCorrectAwnser(lobbyId, newChatMessage.message)){
      io.sockets.to(lobbyId).emit("awnser", name);
      lobbys.changeOwner(lobbyId, name);
    }
  })
  socket.on("mouse-drag",(position)=>{
    if (isLobbyStarted())
      socket.to(position.lobby).emit("mouse-drag", {x:position.x, y:position.y})
    else
      socket.emit("error",{message:"game not started"})
  })
  socket.on("mouse-down", (position) => {
    if(isLobbyStarted())
      socket.to(position.lobby).emit("mouse-down", {x:position.x, y:position.y})
    else 
      socket.emit("error",{message:"game not started"})
  })
  socket.on("start-game", () => {
    
    const user = usersConnected.find(element => element.socket.id === socket.id);
    
    const {name, lobbyId} = user
    if(lobbys.cantStartTheLobby(name, lobbyId)){
      console.log({
        rooms: socket.rooms,
        lobbyId
      });
      const startingWord = lobbys.startLobby(lobbyId)
      io.sockets.in(lobbyId).emit("start");
      socket.emit("get-word", {word:startingWord})
    } else {
      socket.to(lobbyId).emit("error", {messgae:"you arent allowed to start the server"})
    }
  })
  socket.on("disconnect", ()=> {
    console.log('a user disconnected ' + --counter);
    io.emit("users-online", counter);
    const indexUser = usersConnected.findIndex(element => element.socket.id === socket.id);
    lobbys.disconectPlayer(usersConnected[indexUser].name, usersConnected[indexUser].lobbyId)
    usersConnected.splice(indexUser,1);
  })
});

app.use("/game", gameRouter)

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = {app, server};
