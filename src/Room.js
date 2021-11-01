import React from "react";
import Swal from "sweetalert2";

const Room = () => {
  const room = Swal.fire({
    title: "Enter a room",
    input: "text",
    inputPlaceholder: "Aa",
  });

  return <div>{room}</div>;
};

export default Room;
