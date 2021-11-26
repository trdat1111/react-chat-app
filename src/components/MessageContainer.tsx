import React, { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../service/socket";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "animate.css";
import { auth } from "../service/firebase";
import { Toast } from "../service/sweet-alert";
import moment from "moment";
import zustand from "../assets/zustand.png";
import { useCurrentRoomStore, useMsgListStore, useNotiStore } from "../store";
import { MessageObj } from "../type";
import { v4 as uuidv4 } from "uuid";
import isValidUrl from "../functions/isValidUrl";

const MessagePill: React.FC<{
  messageObj: MessageObj;
  fromSelf: (authorId: string) => boolean;
}> = ({ messageObj, fromSelf }) => {
  const imageTypes = /(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  // const otherTypes = [/pptx/, /doc/, /docx/];

  if (imageTypes.test(messageObj.type)) {
    // if userData is an image
    return (
      <div className="inline-block max-w-xl my-1">
        {!fromSelf(messageObj.id) && (
          <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
        )}
        <img
          src={messageObj.userData}
          alt="users resource"
          className="object-cover max-h-48 rounded-xl max-w-md"
        />
      </div>
    );
  } else if (isValidUrl(messageObj.userData)) {
    // if userData is a file
    return (
      <div
        className={`inline-block max-w-xl shadow rounded-2xl my-1 p-3 ${
          fromSelf(messageObj.id) ? "bg-blue-400 text-white" : "bg-white"
        }`}
      >
        {!fromSelf(messageObj.id) && (
          <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
        )}
        <a
          href={messageObj.userData}
          className="inline-flex font-montserrat underline font-medium text-sm break-words"
        >
          {messageObj.fileName}
        </a>
      </div>
    );
  }
  return (
    <div
      className={`inline-block max-w-xl shadow rounded-2xl my-1 p-3 ${
        fromSelf(messageObj.id) ? "bg-blue-400 text-white" : "bg-white"
      }`}
    >
      {!fromSelf(messageObj.id) && (
        <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
      )}
      <p className="font-montserrat font-medium text-sm break-words">
        {messageObj.userData}
      </p>
    </div>
  );
};

const MessageList: React.FC<{
  messageObj: MessageObj;
}> = ({ messageObj }) => {
  const user = auth.currentUser;

  function fromSelf(authorId: string) {
    return user?.uid === authorId ? true : false;
  }

  return (
    <div
      className={`flex ${
        fromSelf(messageObj.id) ? "flex-row-reverse mr-3" : "flex-row ml-3"
      }`}
    >
      {messageObj.photoURL && (
        <img
          src={messageObj.photoURL}
          className="align-middle rounded-full w-9 h-9 m-1"
          alt="author"
        />
      )}
      <div
        className={`flex items-center group ${
          fromSelf(messageObj.id) ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="opacity-0 ring-1 bg-white h-6 rounded-md font-mono text-xs delay-200 transition-all duration-100 mx-2 px-1 pt-1 group-hover:opacity-90">
          {moment(messageObj.created_at.toDate()).format("HH:mm · MMM D YYYY")}
        </div>
        <MessagePill messageObj={messageObj} fromSelf={fromSelf} />
      </div>
    </div>
  );
};

const MessageContainer: React.FC = () => {
  const socket = useContext(SocketContext);
  const { notiList, setNoti } = useNotiStore();
  const msgList = useMsgListStore((state) => state.msgList);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const dummy: any = useRef();

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    socket.on("show-user-joined", (msg: string) => showNoti(msg));
    socket.on("show-disconnect", (msg: string) => showNoti(msg));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentRoom, msgList]);

  function showNoti(msg: string) {
    setNoti(msg);
    Toast.fire({
      title: <p>{msg}</p>,
      icon: "info",
    });
  }

  const NotiList = notiList.map((noti, index) => (
    <div key={index} className="text-green-600">
      {noti}
    </div>
  ));

  return (
    <SimpleBar className="overflow-y-auto h-4/5 border-t-2 border-b-2 overflow-x-hidden bg-gray-100 p-2">
      <div className="mb-3">{NotiList}</div>
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
