import React, { useContext } from "react";
import { SocketContext } from "./service/socket";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "animate.css";

interface Props {
  msgList: {
    id: string;
    text: string;
  }[];
  noti: string[];
  setNoti: React.Dispatch<React.SetStateAction<string[]>>;
  dummy: any;
}

const MessageText: React.FC<Props> = ({ msgList, noti, setNoti, dummy }) => {
  const socket = useContext(SocketContext);
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

  function fromSelf(messageObj: { id: string; text: string }) {
    return socket.id === messageObj.id ? true : false;
  }

  const MessageList = msgList.map((messageObj, index) => {
    return (
      <div
        className={
          "flex " +
          (fromSelf(messageObj) ? "flex-row-reverse mr-3" : "flex-row ml-3")
        }
        key={messageObj.id + index}
      >
        <div
          className={
            "inline-block max-w-xl shadow rounded-2xl mb-1 p-3 " +
            (fromSelf(messageObj) ? "bg-blue-400 text-white" : "bg-gray-200")
          }
        >
          {!fromSelf(messageObj) ? <b>{messageObj.id}</b> : null}
          <p className="break-words">{messageObj.text}</p>
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
    <SimpleBar className="h-4/6 w-9/12 mx-auto overflow-y-auto overflow-x-hidden border-2 bg-gray-100 rounded-md p-2">
      <div className="mb-3">{NotiList}</div>
      {MessageList}
      <div ref={dummy}></div>
    </SimpleBar>
  );
};

export default MessageText;
