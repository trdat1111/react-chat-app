import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import {
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../service/firebase";
import {
  useCurrentRoomStore,
  useFormValueStore,
  useMsgListStore,
} from "../store";
import { MessageObj } from "../type";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { RiAttachment2, RiImage2Line } from "react-icons/ri";
import { Progress, Tooltip } from "@chakra-ui/react";
import { Toast } from "../service/sweet-alert";
import updateNotiCollection from "../functions/updateNotiCollection";

const MessageInput: React.FC = () => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const { formValue, setFormValue } = useFormValueStore();
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const addMsgToList = useMsgListStore((state) => state.addMsgToList);
  const [isSending, setIsSending] = React.useState(false);

  async function addDataToFirestore(
    room: typeof currentRoom,
    messageObj: MessageObj
  ) {
    const roomRef = doc(db, `group_messages/${room?.roomId}`);
    await updateDoc(roomRef, {
      messages: arrayUnion(messageObj),
      modified_at: serverTimestamp(),
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
      addDataToFirestore(currentRoom, message);
      setFormValue("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateNotiCollection(currentRoom!.roomId);
    if (user && e.target.files && currentRoom) {
      if (e.target.files[0].size > 26214400) {
        Toast.fire({
          icon: "error",
          title: "File size is too big! Limit is 25MB",
        });
        e.target.value = "";
        return;
      }
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
          setIsSending(true);
        },
        (error) => {
          Toast.fire({
            icon: "error",
            title: error,
          });
          e.target.value = "";
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
              fileSize: file.size,
            };
            addMsgToList(message);
            addDataToFirestore(currentRoom, message);
            e.target.value = "";
            setIsSending(false);
          });
        }
      );
    } else return;
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
          {isSending && <Progress size="xs" isIndeterminate />}
          <div className="flex flex-row items-center">
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
            onClick={() => updateNotiCollection(currentRoom!.roomId)}
          />
        </div>
        <button type="submit" className="mt-12 m-2">
          <AiOutlineSend className="w-7 h-7 text-gray-600 hover:text-green-500 transition duration-300 ease-in-out cursor-pointer" />
        </button>
      </form>
    </>
  );
};

export default MessageInput;
