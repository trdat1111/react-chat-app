import React, { useContext } from "react";
import { SocketContext } from "../service/socket";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "animate.css";
import { DocumentData } from "@firebase/firestore";
import { auth } from "../service/firebase";

interface Props {
  msgList: {}[] | DocumentData;
  noti: string[];
  setNoti: React.Dispatch<React.SetStateAction<string[]>>;
  dummy: any;
  currentRoom: any;
}

type MessageObj = {
  id: string;
  user: string;
  text: string;
  created_at: any;
  photoURL: any;
};

const MessageContainer: React.FC<Props> = ({
  msgList,
  noti,
  setNoti,
  dummy,
  currentRoom,
}) => {
  const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const Swal1 = withReactContent(Swal);

  React.useEffect(() => {
    socket.on("show-user-joined", (msg: string) => showNoti(msg));
    socket.on("show-disconnect", (msg: string) => showNoti(msg));
  });

  function showNoti(msg: string) {
    setNoti([...noti, msg]);
    Swal1.fire({
      title: <p>{msg}</p>,
      icon: "info",
      toast: true,
      timer: 3000,
      position: "top-end",
      showConfirmButton: false,
    });
  }

  function fromSelf(messageObj: MessageObj) {
    return user?.uid === messageObj.id ? true : false;
  }

  const MessageList =
    msgList &&
    msgList.map((messageObj: MessageObj, index: number) => {
      return (
        <div
          className={
            "flex " +
            (fromSelf(messageObj) ? "flex-row-reverse mr-3" : "flex-row ml-3")
          }
          key={messageObj.id + index}
        >
          <img
            src={messageObj.photoURL}
            className="align-middle rounded-full w-9 h-9 m-1"
            alt="author"
          />
          <div
            className={`flex items-center group ${
              fromSelf(messageObj) ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="opacity-0 ring-1 bg-white h-7 rounded-md font-mono text-sm transition-all duration-100 mx-2 px-1 pt-1 group-hover:opacity-100">
              {messageObj.created_at.toDate().toLocaleString()}
            </div>
            <div
              className={`inline-block max-w-xl shadow rounded-2xl my-1 p-3 ${
                fromSelf(messageObj) ? "bg-blue-400 text-white" : "bg-gray-200"
              }`}
            >
              {!fromSelf(messageObj) ? <b>{messageObj.user}</b> : null}
              <p className="break-words">{messageObj.text}</p>
            </div>
          </div>
        </div>
      );
    });

  const NotiList = noti.map((noti, index) => (
    <div key={index} className="text-green-600">
      {noti}
    </div>
  ));

  return (
    <SimpleBar className="ring-1 h-4/6 w-9/12 mx-auto overflow-y-auto overflow-x-hidden border-2 bg-gray-100 rounded-md p-2">
      {currentRoom}
      <div className="mb-3">{NotiList}</div>
      {MessageList}
      <div ref={dummy}></div>
    </SimpleBar>
  );
};

export default MessageContainer;
