import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import {
  Timestamp,
  DocumentData,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";

interface Props {
  msgList: {}[] | DocumentData[];
  setMsgList: React.Dispatch<React.SetStateAction<DocumentData[] | {}[]>>;
  currentRoom: any;
}

type MessageObj = {
  id: string;
  text: string;
};

const MessageInput: React.FC<Props> = ({
  msgList,
  setMsgList,
  currentRoom,
}) => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const [formValue, setFormValue] = useState("");

  async function addMsgToFireStore(roomId: string, messageObj: MessageObj) {
    const roomRef = doc(db, `group_messages/${roomId}`);
    // await addDoc(collection(ref, "messages"), messageObj);
    await updateDoc(roomRef, {
      messages: arrayUnion(messageObj),
    });
  }

  function handleSubmit(e: React.KeyboardEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      user &&
      currentRoom &&
      formValue &&
      formValue.replace(/\s/g, "").length
    ) {
      const message = {
        id: user.uid,
        user: user.displayName,
        text: formValue,
        created_at: Timestamp.now(),
        photoURL: user.photoURL,
      };
      // socket.emit("emit-message", socket.id, formValue, roomValue);
      msgList ? setMsgList([...msgList, message]) : setMsgList([message]);
      addMsgToFireStore(currentRoom, message);
      setFormValue("");
    }
  }

  return (
    <form
      className="flex justify-center w-full m-3"
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === "Enter") handleSubmit(e);
      }}
    >
      <textarea
        className="border w-4/6 h-full ring-1 focus:outline-none focus:ring-green-500 transition duration-300 ease-in-out rounded-md p-2"
        placeholder="Aa"
        style={{ resize: "none" }}
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
      <button type="submit" className="m-3">
        <AiOutlineSend
          size="30"
          className="text-gray-600 hover:text-green-500 transition duration-300 ease-in-out cursor-pointer"
        />
      </button>
    </form>
  );
};

export default MessageInput;
