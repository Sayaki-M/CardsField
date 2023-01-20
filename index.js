const express = require("express");
const app = express();
const http = require("http");
const { dirname } = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.on("hostjoin", async () => {
    rooms = await getAllRoomNames();
    remrooms = [...Array(10000)].map((_, i) => i).filter((i) => !rooms.has(i));
    room = remrooms[Math.floor(Math.random() * remrooms.length)];
    socket.join(room);
    io.emit("hostroom", { room });
  });

  socket.on("memjoin", async (msg) => {
    rooms = await getAllRoomNames();
    if (rooms.has(msg.room)) {
      socket.join(msg.room);
      io.emit("memroom", { room: true });
    } else {
      io.emit("memroom", { room: false });
    }
  });

  socket.on("quit", (msg) => {
    socket.leave(msg.room);
  });

  socket.on("card", (msg) => {
    socket.broadcast.to(msg.room).emit("my_card", msg);
  });

  socket.on("answermyid", () => {
    io.emit("myId", { myId: socket.id });
  });

  socket.on("reqcard", (msg) => {
    socket.broadcast.to(msg.room).emit("reqcard");
  });

  socket.on("initcard", (msg) => {
    io.to(msg.room).emit("initcard", {
      cards: msg.cards,
    });
  });

  socket.on("disconnect", () => {
    //io.emit("chat message", { name: "bot", message: DisconnectMessage });
  });
});

getAllRoomNames = async () => {
  const sockets = await io.fetchSockets();
  let allRoomNames = new Set();
  for (let socket of sockets) {
    let rooms = new Set(socket.rooms);
    rooms.delete(socket.id);
    allRoomNames = new Set([...rooms, ...allRoomNames]);
  }
  return allRoomNames;
};

server.listen(port, () => {
  console.log("listening on *:3000");
});
