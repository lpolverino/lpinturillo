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
  io.emit("users-online", counter)
  socket.on("credentials", usetCredentials => {
    const indexUser = usersConnected.findIndex(element => element.name === usetCredentials.name);
    if (indexUser !== -1) return
    usersConnected.push({
        name:usetCredentials.name,
        lobbyId: usetCredentials.lobby,
        socket
  })
  console.log(usersConnected);
  })
  socket.on("user-disconnected", usetCredentials => {
    console.log(usetCredentials)
  })
  socket.on("chat", newChatMessage => {
    socket.broadcast.emit("chat", newChatMessage)
  })
  socket.on("mouse-drag",(position)=>{
    socket.broadcast.emit("mouse-drag", position)
  })
  socket.on("mouse-down", (position) => {
    socket.broadcast.emit("mouse-down", position)
  })
  socket.on("disconnect", ()=> {
    console.log('a user disconnected ' + --counter);
    io.emit("users-online", counter);
    const indexUser = usersConnected.findIndex(element => element.socket === socket);
    console.log(indexUser);
    usersConnected.splice(indexUser,1);
    console.log(usersConnected);
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
