const express = require('express');
const logger = require('morgan');
const {Server} = require("socket.io")

const gameRouter = require("./routes/game")

const app = express();

const server = require("node:http").Server(app)
const io = new Server(server, {
  cors:{
    origin: "http://localhost:5173"
  }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next)=>  {
  res.io = io;
  next()
})
let counter = 0

io.on('connection', (socket) => {
  console.log('a user connected ' + counter++);
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
