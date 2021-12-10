const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(5000, {
  cors: { origin: ["http://localhost:3000", "https://admin.socket.io"] },
  credentials: true,
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("emit-message", (id, text, room) => {
    if (!room) {
      socket.broadcast.emit("received-message", { id, text });
      console.log("Used broadcast");
    } else {
      socket.to(room).emit("received-message", { id, text });
      console.log(`Room used: ${room}`);
    }
  });

  socket.on("join-room", (room, cb) => {
    try {
      // const rooms = [...socket.rooms];
      // io.in(socket.id).socketsLeave(rooms);
      socket.join(room);
      cb(`Joined ${room}`);
      // const sids = io.of("/").adapter.sids;
      // console.log(sids);
      const allRooms = io.of("/").adapter.rooms;
      console.log(allRooms);
    } catch (error) {
      console.log("error");
    }
  });

  io.emit("show-user-joined", `User ${socket.id} joined`);

  socket.on("disconnect", () => {
    io.emit("show-disconnect", `User ${socket.id} disconnected`);
  });
});
