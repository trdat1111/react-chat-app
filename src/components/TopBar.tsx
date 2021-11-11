import React from "react";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { Toast, Modal } from "../service/sweet-alert";
import { useCurrentRoomStore, useRoomDataStore } from "../store";

interface Props {
  createRoom: any;
}

const TopBar: React.FC<Props> = ({ createRoom }) => {
  const user = auth.currentUser;
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const addRoomData = useRoomDataStore((state) => state.addRoomData);

  async function joinRoom() {
    const { value: val } = await Modal.fire({
      title: "Enter a room ID to join in",
      input: "text",
      confirmButtonColor: "#8B5CF6",
    });
    if (val && val !== "") {
      // socket.emit("join-room", val, (msg: string) => {
      //   setRoomValue(val);
      //   setNoti([...noti, msg]);
      //   setMsgList([]);
      // });
      const roomRef = doc(db, `group_messages/${val}`);
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        if (roomSnapshot.data().joined_users.includes(user?.uid)) {
          Toast.fire({
            icon: "error",
            title: "You're already joined this room!",
          });
        } else {
          // add userid to room doc and setRooms
          await updateDoc(roomRef, {
            joined_users: arrayUnion(user?.uid),
          });
          addRoomData(roomSnapshot.data());
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Room not exist!",
        });
      }
    }
  }

  return (
    <div className="inline-flex flex-row items-center justify-between h-16 px-3">
      <h3 className="text-xl font-bold pt-1">
        {/* {socket.id && user
          ? `Hello ${user.displayName}`
          : `Server not response`} */}
        <ul>
          <li>{currentRoom?.roomName}</li>
        </ul>
      </h3>
      <div>
        <button
          className="button bg-purple-500 hover:bg-purple-600 mx-1"
          onClick={joinRoom}
        >
          Join a room
        </button>
        <button
          className="button bg-green-500 hover:bg-green-600 mx-1"
          onClick={createRoom}
        >
          Create room
        </button>
      </div>
    </div>
  );
};

export default TopBar;
