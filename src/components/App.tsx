import React, { useEffect } from "react";
// import { SocketContext } from "../service/socket";
import {
  query,
  onSnapshot,
  collection,
  where,
  updateDoc,
  getDocs,
  documentId,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";
import {
  useCurrentRoomStore,
  useMsgListStore,
  useRoomDataStore,
} from "../store";
import { RoomDataObj } from "../type";

// components
import TopBar from "./TopBar";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import SideBar from "./SideBar";

const App: React.FC = () => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const { roomData, addRoomData, updateMsgInRoom, removeRoom } =
    useRoomDataStore();
  const { msgList, setMsgList } = useMsgListStore();
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();

  useEffect(() => {
    // fetch room based on joined users and all messages in each room
    const roomQuery = query(
      collection(db, "group_messages"),
      where("joined_users", "array-contains", user?.uid)
    );

    const unsubcribe = onSnapshot(roomQuery, (roomSnapshot) => {
      roomSnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          if (roomData?.length === 0) {
            // add room on mounted
            const roomDataObj = { ...change.doc.data(), id: change.doc.id };
            addRoomData(roomDataObj);
          }
        }
        if (change.type === "modified") {
          // update room when new message comes
          updateMsgInRoom(change.doc.id, change.doc.data().messages);

          // set hasNewMsg to true for the rest of users in this room
          (async () => {
            const q = query(
              // query for all users doc in notifications subcollection except current user
              collection(change.doc.ref, "notifications"),
              where(documentId(), "!=", change.doc.data().messages?.at(-1).id) // user who sent last msg
            );

            const snapshot = await getDocs(q);
            snapshot.forEach(async (doc) => {
              await updateDoc(doc.ref, {
                hasNewMsg: true,
              });
            });
          })();
        }
        if (change.type === "removed") {
          // Removed room
          removeRoom(change.doc.id);
          setCurrentRoom(null);
          setMsgList([]);
        }
      });

      const source = roomSnapshot.metadata.fromCache ? "local cache" : "server";
      console.log(`Room data came from ${source}`);
    });

    return () => unsubcribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentRoom && roomData) {
      // update messages in realtimes in current room
      const currRoom = roomData.find((roomObj: RoomDataObj) => {
        return roomObj.id === currentRoom.roomId;
      });
      if (currRoom) {
        setMsgList(currRoom.messages);
        // setnewMsgNoti(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, roomData, msgList]);

  return (
    <>
      <SideBar />
      <div className="flex flex-col w-full h-full">
        <TopBar />
        <MessageContainer />
        {currentRoom && <MessageInput />}
      </div>
    </>
  );
};

export default App;
