import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import { Timestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, storage } from "../service/firebase";
import {
  useCurrentRoomStore,
  useFormValueStore,
  useMsgListStore,
} from "../store";
import { MessageObj } from "../type";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { RiAttachment2, RiImage2Line } from "react-icons/ri";
import { Tooltip } from "@chakra-ui/react";

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
      // add message to firestore
      const message = {
        id: user.uid,
        user: user.displayName!,
        userData: formValue,
        created_at: Timestamp.now(),
        photoURL: user.photoURL!,
        type: "text",
      };
      // socket.emit("emit-message", socket.id, formValue, roomValue);
      addMsgToList(message);
      addMsgToFireStore(currentRoom, message);
      setFormValue("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (user && e.target.files && currentRoom) {
      // add file to storage
      const file = e.target.files[0];
      const fileName = file.name + Timestamp.now();
      const storageRef = ref(
        storage,
        `users_files/${currentRoom.roomId}/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (fileSnapshot) => {
          // pedding process
        },
        (error) => {
          console.log(error);
        },
        () => {
          // when success, add file url to firestore
          const type = file.name.split(".").at(-1);

          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            const message = {
              id: user.uid,
              user: user.displayName!,
              userData: downloadUrl,
              created_at: Timestamp.now(),
              photoURL: user.photoURL!,
              type: type!,
              fileName: file.name,
            };
            addMsgToList(message);
            addMsgToFireStore(currentRoom, message);
          });
        }
      );
    } else return null;
  }

  return (
    <>
      <form
        className="flex m-2"
        onSubmit={handleSubmit}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSubmit(e);
        }}
      >
        <div className="flex flex-col w-full">
          <div className="flex flex-row">
            <Tooltip label="Send image" placement="top">
              <label
                htmlFor="image-upload"
                className="w-max p-1 mb-1 rounded-md hover:bg-gray-200 cursor-pointer mr-1"
              >
                <input
                  type="file"
                  id="image-upload"
                  onChange={(e) => handleFileChange(e)}
                  className="hidden"
                  accept="image/*"
                />
                <RiImage2Line className="w-7 h-7" />
              </label>
            </Tooltip>
            <Tooltip label="Send attachment" placement="top">
              <label
                htmlFor="file-upload"
                className="w-max p-1 mb-1 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => handleFileChange(e)}
                  className="hidden"
                />
                <RiAttachment2 className="w-7 h-7" />
              </label>
            </Tooltip>
          </div>
          <textarea
            className="w-full h-14 border-t-2 focus:outline-none focus:ring-green-500 transition duration-300 ease-in-out p-2 pr-10"
            placeholder="Aa"
            style={{ resize: "none" }}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
        </div>
        <button type="submit" className="absolute right-3 bottom-3 m-2">
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
