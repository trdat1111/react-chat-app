import React from "react";
import io from "socket.io-client";

export const socket = io("ws://localhost:5000", {
  autoConnect: false,
});
export const SocketContext = React.createContext(socket);
