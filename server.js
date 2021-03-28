const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set sttaic folder
app.use(express.static(path.join(__dirname, "public")));
const botName = 'Chatcord Bot';

//run when a client connnects
io.on("connection", (socket) => {
  //emit to a single client
  socket.emit("message", formatMessage(botName,"Welcome to Chatcord!"));

  //broadcast to everyone except who's not connecting
  socket.broadcast.emit("message", formatMessage(botName,"A user has joined the chat"));

  //braodcast to everyone in general, use io.emit();
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName,"A user has left the chat"));
  });

  //listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage('USER', msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
