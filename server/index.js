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

  io.emit("show-user-joined", `User ${socket.id} joined`);

  socket.on("disconnect", () => {
    io.emit("show-disconnect", `User ${socket.id} disconnected`);
  });
});
