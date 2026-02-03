const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Chat
  socket.on("chat", (data) => {
    io.emit("chat", {
      user: data.user,
      message: data.message
    });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
