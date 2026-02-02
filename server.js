const WebSocket = require('ws');
const wss = new WebSocket.Server({ port:8080 });
let games={}; // gameID -> { players:{}, chat:[] }

wss.on('connection', ws=>{
  let currentGame=null;
  let playerID=null;

  ws.on('message', msg=>{
    const data = JSON.parse(msg);
    const { type, gameID, x, y, text } = data;

    if(type==='join'){
      currentGame=gameID;
      playerID="P"+Math.floor(Math.random()*1000000);
      if(!games[currentGame]) games[currentGame]={players:{}, chat:[]};
      games[currentGame].players[playerID]={x,y};
      ws.send(JSON.stringify({type:'joined',playerID}));
    }

    if(type==='update' && currentGame){
      games[currentGame].players[playerID]={x,y};
      wss.clients.forEach(c=>{
        if(c!==ws && c.readyState===WebSocket.OPEN)
          c.send(JSON.stringify({type:'players',players:games[currentGame].players}));
      });
    }

    if(type==='chat' && currentGame){
      const msgObj={playerID,text};
      games[currentGame].chat.push(msgObj);
      wss.clients.forEach(c=>{
        if(c.readyState===WebSocket.OPEN)
          c.send(JSON.stringify({type:'chat',chat:msgObj}));
      });
    }
  });

  ws.on('close',()=>{
    if(currentGame && playerID && games[currentGame]){
      delete games[currentGame].players[playerID];
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
