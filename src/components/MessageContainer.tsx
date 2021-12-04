import React, { useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "animate.css";
import zustand from "../assets/zustand.png";
import { useCurrentRoomStore, useMsgListStore } from "../store";
import { v4 as uuidv4 } from "uuid";
import MessageList from "./MessageList";

const MessageContainer: React.FC = () => {
  // const socket = useContext(SocketContext);
  const msgList = useMsgListStore((state) => state.msgList);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const dummy: any = useRef();

  const scrollToBottom = () => {
    dummy.current.scrollIntoView();
  };

  // function showNoti(msg: string) {
  //   setNoti(msg);
  //   Toast.fire({
  //     title: <p>{msg}</p>,
  //     icon: "info",
  //   });
  // }

  useEffect(() => {
    // socket.on("show-user-joined", (msg: string) => showNoti(msg));
    // socket.on("show-disconnect", (msg: string) => showNoti(msg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // setTimeout to wait for img preload
      scrollToBottom();
    }, 400);
  }, [currentRoom, msgList]);

  return (
    <SimpleBar className="overflow-y-auto h-4/5 border-t-2 border-b-2 overflow-x-hidden bg-gray-100 p-2">
      {msgList?.map((messageObj) => (
        <MessageList key={uuidv4()} messageObj={messageObj} />
      ))}
      {!currentRoom && (
        <div className="flex flex-col justify-center h-96 items-center">
          <img src={zustand} alt="" className="flex max-w-xs max-h-40" />
          <p className="text-gray-500">Zustand!</p>
        </div>
      )}
      <div ref={dummy}></div>
    </SimpleBar>
  );
};

export default MessageContainer;
