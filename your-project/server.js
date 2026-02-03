const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("chat", (data) => {
    console.log("CHAT:", data.user, data.message);
    io.emit("chat", data);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
