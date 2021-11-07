import React, { useContext } from "react";
import Swal from "sweetalert2";
import { SocketContext } from "../service/socket";
import { signOut } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";

interface Props {
  noti: string[];
  setNoti: React.Dispatch<React.SetStateAction<string[]>>;
  setMsgList: React.Dispatch<React.SetStateAction<DocumentData[] | {}[]>>;
  rooms: any;
  setRooms: any;
}

const TopBar: React.FC<Props> = ({
  noti,
  setNoti,
  setMsgList,
  rooms,
  setRooms,
}) => {
  const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const roomCollection = collection(db, "group_messages");

  async function createRoom() {
    const { value: val } = await Swal.fire({
      title: "Enter a room to create",
      input: "text",
      inputPlaceholder: "Aa",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#10B981",
    });
    if (val && val !== "") {
      const roomRef = await addDoc(roomCollection, {
        room_name: val,
      });

      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        console.log(roomSnapshot.data());
        setRooms([...rooms, roomSnapshot.data()]);
      }
      // initJoin(roomRef);
      await updateDoc(roomRef, {
        joined_users: arrayUnion(user?.uid),
      });
    }
  }

  async function joinRoom() {
    const { value: val } = await Swal.fire({
      title: "Enter a room ID to join in",
      input: "text",
      inputPlaceholder: "Aa",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "#10B981",
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
        // add userid to room doc and setRooms
        await updateDoc(roomRef, {
          joined_users: arrayUnion(user?.uid),
        });
        setRooms([...rooms, roomSnapshot.data()]);
      } else console.error("Room not exist!");
    }
  }

  function SignOut(): JSX.Element {
    function handleSignOut() {
      signOut(auth);
      socket.disconnect();
    }

    return (
      <button
        className="button bg-red-400 hover:bg-red-500 mx-1"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    );
  }

  return (
    <div className="inline-flex flex-row w-9/12 justify-between my-3 h-auto">
      <h3 className="text-xl font-bold pt-1">
        {socket.id && user
          ? `Hello ${user.displayName}`
          : `Server not response`}
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
        <SignOut />
      </div>
    </div>
  );
};

export default TopBar;
