import React, { useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "animate.css";
import zustand from "../assets/zustand.png";
import { useCurrentRoomStore, useMsgListStore } from "../store";
import { v4 as uuidv4 } from "uuid";
import createRoom from "../functions/createRoom";
import joinRoom from "../functions/joinRoom";
import { MdGroup, MdGroupAdd } from "react-icons/md";

// components
import Message from "./Message";

const MessageContainer: React.FC = () => {
  const msgList = useMsgListStore((state) => state.msgList);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const dummy: any = useRef();
  const container: any = useRef();

  const scrollToBottom = () => {
    dummy.current.scrollIntoView();
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, msgList]);

  return (
    <SimpleBar
      ref={container}
      className="overflow-y-auto h-4/5 border-t-2 border-b-2 overflow-x-hidden bg-gray-100 p-2"
    >
      {currentRoom ? (
        msgList?.map((messageObj) => (
          <Message key={uuidv4()} messageObj={messageObj} />
        ))
      ) : (
        <div className="flex flex-col justify-center h-96 items-center">
          <img src={zustand} alt="" className="flex max-w-xs max-h-40" />
          <p className="text-gray-500 text-center">
            You can start using app by join a room or create a new room!
          </p>
          <div className="flex flex-row">
            <button
              onClick={createRoom}
              className="button bg-green-400 hover:bg-green-500 m-1"
            >
              <MdGroup className="w-5 h-5 mr-1" />
              Create Room
            </button>
            <button
              onClick={joinRoom}
              className="button bg-blue-400 hover:bg-blue-500 m-1"
            >
              <MdGroupAdd className="w-5 h-5 mr-1" />
              Join Room
            </button>
          </div>
        </div>
      )}
      <div ref={dummy}></div>
    </SimpleBar>
  );
};

export default MessageContainer;
