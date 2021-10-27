const io = require("socket.io")(5000, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  let messages = [];

  socket.on("emit-message", (id, text, room) => {
    if (!room) {
      socket.broadcast.emit("received-message", { id, text });
    } else {
      socket.to(room).emit("received-message", { id, text, room });
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });

  io.emit("show-user-joined", `User ${socket.id} joined`);

  socket.on("disconnect", () => {
    io.emit("show-disconnect", `User ${socket.id} disconnected`);
  });
});
