// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let games = {}; // gameID -> { players: {} }

wss.on('connection', ws => {
  let currentGame = null;
  let playerID = null;

  ws.on('message', message => {
    const data = JSON.parse(message);
    const { type, gameID, x, y } = data;

    if(type === 'join'){
      currentGame = gameID;
      playerID = "P" + Math.floor(Math.random()*1000000);
      if(!games[currentGame]) games[currentGame] = { players: {} };
      games[currentGame].players[playerID] = { x, y };
      ws.send(JSON.stringify({ type:'joined', playerID }));
    }

    if(type === 'update' && currentGame){
      games[currentGame].players[playerID] = { x, y };
      // broadcast to all except sender
      wss.clients.forEach(client => {
        if(client!==ws && client.readyState===WebSocket.OPEN)
          client.send(JSON.stringify({ type:'players', players: games[currentGame].players }));
      });
    }
  });

  ws.on('close', ()=>{
    if(currentGame && playerID && games[currentGame]){
      delete games[currentGame].players[playerID];
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
