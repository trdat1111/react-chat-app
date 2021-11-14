import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../service/firebase";
import {
  useCurrentRoomStore,
  useFormValueStore,
  useMsgListStore,
} from "../store";
import { MessageObj } from "../type";

interface Props {}

const MessageInput: React.FC<Props> = () => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const { formValue, setFormValue } = useFormValueStore();
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const addMsgToList = useMsgListStore((state) => state.addMsgToList);

  async function addMsgToFireStore(
    room: typeof currentRoom,
    messageObj: MessageObj
  ) {
    const roomRef = doc(db, `group_messages/${room?.roomId}`);
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
      addMsgToList(message);
      addMsgToFireStore(currentRoom, message);
      setFormValue("");
    }
  }

  return (
    <>
      <input type="file" id="" onChange={(e) => setFormValue(e.target.value)} />
      <form
        className="flex justify-center m-2"
        onSubmit={handleSubmit}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSubmit(e);
        }}
      >
        <textarea
          className="border w-full h-full ring-1 focus:outline-none focus:ring-green-500 transition duration-300 ease-in-out rounded-md p-2"
          placeholder="Aa"
          style={{ resize: "none" }}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />
        <button type="submit" className="m-2">
          <AiOutlineSend
            size="30"
            className="text-gray-600 hover:text-green-500 transition duration-300 ease-in-out cursor-pointer"
          />
        </button>
      </form>
    </>
  );
};

export default MessageInput;
