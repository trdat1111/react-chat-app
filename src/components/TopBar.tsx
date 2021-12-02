import React from "react";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../service/firebase";
import { Toast, Modal } from "../service/sweet-alert";
import { useCurrentRoomStore } from "../store";
import { BsPerson } from "react-icons/bs";
import createRoom from "../functions/createRoom";

const TopBar: React.FC = () => {
  const user = auth.currentUser;
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

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
            joined_users: arrayUnion({
              userId: user?.uid,
              userName: user?.displayName,
              userAvt: user?.photoURL,
            }),
          });
          const notiRef = doc(roomRef, `notifications/${user?.uid}`);
          await setDoc(notiRef, {
            hasNewMsg: false,
          });
          // addRoomData(roomSnapshot.data());
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Room not exist!",
        });
      }
    }
  }

  function shareRoom() {
    Toast.fire({
      icon: "info",
      title: "Share this room ID to your friend:",
      width: 450,
      text: currentRoom?.roomId,
      position: "top",
      showCloseButton: true,
      timer: undefined,
    });
  }

  return (
    <div className="inline-flex flex-row items-center justify-between h-16 px-3">
      <h3 className="text-xl font-bold pt-1">
        {/* {socket.id && user
          ? `Hello ${user.displayName}`
          : `Server not response`} */}
        {currentRoom && (
          <>
            <ul>
              <li>{currentRoom?.roomName}</li>
            </ul>
            <div className="flex flex-row items-center text-base font-normal">
              <BsPerson className="mr-1" />
              <p>{currentRoom?.totalMember} members</p>
            </div>
          </>
        )}
      </h3>
      <div>
        {currentRoom && (
          <button
            className="button bg-blue-500 hover:bg-blue-600 mx-1"
            onClick={shareRoom}
          >
            Share room ID
          </button>
        )}
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
