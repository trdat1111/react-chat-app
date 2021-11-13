import React, { useContext } from "react";
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

interface Props {
  dummy: any;
}
const MessageContainer: React.FC<Props> = ({ dummy }) => {
  const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const { notiList, setNoti } = useNotiStore();
  const msgList = useMsgListStore((state) => state.msgList);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

  React.useEffect(() => {
    socket.on("show-user-joined", (msg: string) => showNoti(msg));
    socket.on("show-disconnect", (msg: string) => showNoti(msg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showNoti(msg: string) {
    setNoti(msg);
    Toast.fire({
      title: <p>{msg}</p>,
      icon: "info",
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
          {messageObj.photoURL && (
            <img
              src={messageObj.photoURL}
              className="align-middle rounded-full w-9 h-9 m-1"
              alt="author"
            />
          )}
          <div
            className={`flex items-center group ${
              fromSelf(messageObj) ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="opacity-0 ring-1 bg-white h-6 rounded-md font-mono text-xs delay-200 transition-all duration-100 mx-2 px-1 pt-1 group-hover:opacity-90">
              {moment(messageObj.created_at.toDate()).format(
                "dddd, MMM D YYYY, HH:mm"
              )}
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

  const NotiList = notiList.map((noti, index) => (
    <div key={index} className="text-green-600">
      {noti}
    </div>
  ));

  return (
    <SimpleBar className="overflow-y-auto h-4/5 border-t-2 border-b-2 overflow-x-hidden bg-gray-100 p-2">
      <div className="mb-3">{NotiList}</div>
      {MessageList}
      {!currentRoom && (
        <div className="flex flex-col justify-center h-96 items-center">
          <img src={zustand} alt="" className="flex max-w-xs max-h-40" />
          <p className="text-gray-500">A Placeholder Totoro!</p>
        </div>
      )}
      <div ref={dummy}></div>
    </SimpleBar>
  );
};

export default MessageContainer;
