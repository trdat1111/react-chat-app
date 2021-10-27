import React from "react";
import { socket } from "./service/socket";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function MessageText(props) {
  const [noti, setNoti] = React.useState([]);
  const Swal1 = withReactContent(Swal);

  React.useEffect(() => {
    socket.on("show-user-joined", (msg) => showNoti(msg));
    socket.on("show-disconnect", (msg) => showNoti(msg));
  });

  function showNoti(msg) {
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

  const MessageList = props.msgList.map((messageObj, index) => {
    return (
      <div
        className="inline shadow bg-white rounded-lg m-2 p-2"
        key={messageObj.id + index}
      >
        <b className="inline mr-1">{messageObj.id}:</b>
        <p className="inline">{messageObj.text}</p>
      </div>
    );
  });

  const NotiList = noti.map((noti, index) => (
    <div key={index} className="text-green-600">
      {noti}
    </div>
  ));

  return (
    <>
      <div className="flex flex-col min-h-500 h-4/6 w-5/6 mx-auto overflow-y-scroll border-2 border-black bg-gray-100 rounded-md p-2">
        {NotiList}
        {MessageList}
        <div ref={props.dummy}></div>
      </div>
    </>
  );
}

export default MessageText;
