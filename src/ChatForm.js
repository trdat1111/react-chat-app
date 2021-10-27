import React, { useState, useEffect, useRef } from "react";
import { socket } from "./service/socket";
import MessageText from "./MessageText";
import { AiOutlineSend } from "react-icons/ai";

function ChatForm() {
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [msgList, setMsgList] = useState([]);
  const dummy = useRef();

  useEffect(() => {
    socket.on("connect", () => {
      setId(socket.id);
    });

    socket.on("received-message", (messageObj) => {
      setMsgList([...msgList, messageObj]);
    });
  }, [msgList]);

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("emit-message", socket.id, text, null);
    setMsgList([...msgList, { id: socket.id, text: text }]);
    setText("");
    dummy.current.scrollIntoView(false, {
      behavior: "smooth",
      block: "end",
      inline: "nearest",
      // TODO: scroll to bottom fully, add code to github
    });
  }

  return (
    <>
      <h3 className="text-lg text-center m-3 font-bold">{`Your id: ${id}`}</h3>
      <MessageText msgList={msgList} dummy={dummy} />
      <form className="flex justify-center w-full" onSubmit={handleSubmit}>
        <input
          className="border w-4/6 focus:ring-2 focus:outline-none focus:ring-green-400 transition duration-300 ease-in-out rounded-md p-2 m-3"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">
          <AiOutlineSend
            size="30"
            className="text-gray-600 hover:text-green-400 transition duration-300 ease-in-out cursor-pointer"
          />
        </button>
      </form>
    </>
  );
}

export default ChatForm;
