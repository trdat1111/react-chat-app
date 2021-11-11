import React, { useEffect, useRef } from "react";
// import { SocketContext } from "../service/socket";
import {
  query,
  onSnapshot,
  collection,
  where,
  addDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";

// components
import TopBar from "./TopBar";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { RoomData } from "../type";
import SideBar from "./SideBar";
import { Modal } from "../service/sweet-alert";
import {
  useCurrentRoomStore,
  useMsgListStore,
  useRoomDataStore,
} from "../store";

const App: React.FC = () => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const dummy: any = useRef();
  const { roomData, setRoomData } = useRoomDataStore();
  const { msgList, setMsgList } = useMsgListStore();
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

  useEffect(() => {
    // fetch room based on joined users and all messages in each room
    const roomQuery = query(
      collection(db, "group_messages"),
      where("joined_users", "array-contains", user?.uid)
    );

    const unsubcribe = onSnapshot(roomQuery, (roomSnapshot) => {
      const arr = roomSnapshot.docs.map((doc) =>
        Object.assign(doc.data(), { id: doc.id })
      );
      setRoomData(arr);

      const source = roomSnapshot.metadata.fromCache ? "local cache" : "server";
      console.log(`Room data came from ${source}`);
    });

    return () => unsubcribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentRoom) {
      // update messages in realtimes in current room
      const room = roomData.find((messageObj: RoomData) => {
        return messageObj.id === currentRoom.roomId;
      });
      if (room) setMsgList(room.messages);
    }

    dummy.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentRoom, roomData, msgList, setMsgList]);

  async function createRoom() {
    const { value: val } = await Modal.fire({
      title: "Enter a room to create",
      input: "text",
      confirmButtonColor: "#10B981",
    });
    if (val && val !== "") {
      const roomRef = await addDoc(collection(db, "group_messages"), {
        room_name: val,
      });

      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        await updateDoc(roomRef, {
          joined_users: arrayUnion(user?.uid),
        });

        // addRoomData(roomSnapshot.data()); dont necessary because onSnapshot will fetch new room in realtimes
      }
    }
  }

  return (
    <>
      <SideBar createRoom={createRoom} />
      <div className="flex flex-col w-full h-full">
        <TopBar createRoom={createRoom} />
        <MessageContainer dummy={dummy} />
        {currentRoom && <MessageInput />}
      </div>
    </>
  );
};

export default App;
