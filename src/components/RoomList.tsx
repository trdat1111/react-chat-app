import { doc } from "@firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import moment from "moment";
import React from "react";
import isValidUrl from "../functions/isValidUrl";
import updateNotiCollection from "../functions/updateNotiCollection";
import { auth, db } from "../service/firebase";
import { useCurrentRoomStore } from "../store";
import { MessageObj, RoomDataObj } from "../type";

const RoomList: React.FC<{ room: RoomDataObj }> = ({ room }) => {
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
    if (room.messages.length > 0) {
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
      members: room.joined_users,
    });
    updateNotiCollection(room.id);
  }

  return (
    <div
      className={`flex flex-row items-center group
      hover:bg-gray-100 transition-all ease-in-out h-19 mb-1 p-2 cursor-pointer ${
        currentRoom?.roomId === room.id
          ? "bg-blue-100 border-l-4 border-blue-600"
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

export default RoomList;
