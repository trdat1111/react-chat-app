import React, { useContext } from "react";
import { MessageObj, RoomDataObj } from "../type";
import { auth, db } from "../service/firebase";
import moment from "moment";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { signOut } from "firebase/auth";
import { SocketContext } from "../service/socket";
import { useCurrentRoomStore, useRoomDataStore } from "../store";
import { Tooltip } from "@chakra-ui/react";
import isValidUrl from "../functions/isValidUrl";
import updateNotiCollection from "../functions/updateNotiCollection";
import { doc, onSnapshot } from "firebase/firestore";
import createRoom from "../functions/createRoom";

const Room: React.FC<{ room: RoomDataObj }> = ({ room }) => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const user = auth.currentUser;
  const [isNewMsg, setIsNewMsg] = React.useState(false);

  React.useEffect(() => {
    const roomRef = doc(db, `group_messages/${room.id}`);
    const notiRef = doc(roomRef, `notifications/${user?.uid}`);

    // listening to noti subcollection. If user hasNewMsg, display it.
    const unsubscribe = onSnapshot(notiRef, (doc) => {
      setIsNewMsg(doc.data()?.hasNewMsg);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayLastMsg(room: RoomDataObj) {
    if (room.messages) {
      const lastMsg: MessageObj = room.messages?.at(-1);
      let showLastMsg = "";
      const lastMsgUser =
        lastMsg.id === user?.uid ? "You" : lastMsg.user.split(" ")[0];

      if (!isValidUrl(lastMsg.userData) && lastMsg.userData.length > 15) {
        showLastMsg = lastMsg.userData.substring(0, 15).concat("...");
      } else showLastMsg = lastMsg.userData;

      if (isValidUrl(lastMsg.userData)) {
        showLastMsg = "sent an attachment";
      }

      const timeStamp = moment(lastMsg.created_at.toDate()).fromNow(true);

      return (
        <div
          className={`inline-flex text-sm text-gray-500 ${
            isNewMsg && "font-semibold text-blue-500"
          }`}
        >
          {lastMsgUser}: {showLastMsg} · {timeStamp}
        </div>
      );
    }
  }

  function handleRoomOnClick() {
    setCurrentRoom({
      roomId: room.id,
      roomName: room.room_name,
      totalMember: room.joined_users.length,
    });
    updateNotiCollection(room.id);
  }

  return (
    <div
      className={`flex flex-row items-center group
      hover:bg-gray-100 transition-all ease-in-out h-19 mb-1 p-2 cursor-pointer ${
        currentRoom?.roomId === room.id
          ? "bg-blue-100 border-r-4 border-blue-400"
          : "bg-white"
      }`}
      onClick={handleRoomOnClick}
    >
      <img
        src={`https://avatars.dicebear.com/api/initials/${
          room.room_name + room.id
        }.svg`}
        alt=""
        className="flex w-12 h-12 rounded-2xl m-2 justify-center items-center"
      />
      {/* <div className="flex w-12 h-12 rounded-full group-hover:rounded-xl bg-gray-200 m-2 justify-center items-center">
        <GrGroup className="w-6 h-6" />
      </div> */}
      <div className="flex flex-col font-sans overflow-ellipsis overflow-hidden">
        <p className="truncate">{room.room_name}</p>
        {displayLastMsg(room)}
      </div>
    </div>
  );
};

const SideBar: React.FC = () => {
  const user = auth.currentUser;
  const socket = useContext(SocketContext);
  const roomData = useRoomDataStore((state) => state.roomData);

  function SignOut(): JSX.Element {
    function handleSignOut() {
      signOut(auth);
      socket.disconnect();
    }

    return (
      <button
        className="button bg-red-400 hover:bg-red-500"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    );
  }

  const RoomList =
    roomData &&
    roomData.map((room: RoomDataObj) => <Room room={room} key={room.id} />);

  return (
    <div className="flex flex-col justify-between bg-white max-h-screen border-r-2 max-w-md w-4/12">
      <div className="overflow-y-auto">
        <div className="flex flex-row items-center justify-between p-2">
          <p className="text-lg font-bold uppercase">Room</p>
          <div className="flex flex-row">
            <Tooltip label="Create a room">
              <div
                onClick={createRoom}
                className="flex w-9 h-9 rounded-full group-hover:rounded-xl transition-all duration-200 bg-gray-200 m-2 justify-center items-center hover:bg-gray-300 cursor-pointer"
              >
                <AiOutlineUsergroupAdd className="w-7 h-7" />
              </div>
            </Tooltip>
          </div>
        </div>
        {RoomList}
      </div>
      <div className="flex flex-row items-center bg-gray-200 p-2">
        <img
          src={user?.photoURL?.toString()}
          className="w-12 h-12 rounded-full mr-1"
          alt="CurrentUserAvt"
        />
        <div className="flex flex-col w-48">
          <p className="font-bold text-sm truncate">{user?.displayName}</p>
          <p className="text-sm truncate">{user?.email}</p>
        </div>
        <SignOut />
      </div>
    </div>
  );
};

export default SideBar;
