import moment from "moment";
import { auth } from "../service/firebase";
import { MessageObj } from "../type";
import MessagePill from "./MessagePill";

const MessageList: React.FC<{
  messageObj: MessageObj;
}> = ({ messageObj }) => {
  const user = auth.currentUser;

  function fromSelf(authorId: string) {
    return user?.uid === authorId ? true : false;
  }

  if (messageObj.type === "notification") {
    return (
      <div className="flex justify-center w-full text-center">
        <p className="font-montserrat font-medium text-sm text-gray-600">
          {messageObj.userData}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        fromSelf(messageObj.id) ? "flex-row-reverse mr-3" : "flex-row ml-3"
      }`}
    >
      <img
        src={messageObj.photoURL}
        className="align-middle rounded-full w-9 h-9 m-1"
        alt="author"
      />
      <div
        className={`flex items-center group ${
          fromSelf(messageObj.id) ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="truncate opacity-0 ring-1 bg-white h-6 rounded-md font-mono text-xs delay-200 transition-all duration-100 mx-2 px-1 pt-1 group-hover:opacity-90">
          {moment(messageObj.created_at.toDate()).format("HH:mm · MMM D YYYY")}
        </div>
        <MessagePill messageObj={messageObj} fromSelf={fromSelf} />
      </div>
    </div>
  );
};

export default MessageList;
