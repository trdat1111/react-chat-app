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
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";
import {
  useCurrentRoomStore,
  useFileListStore,
  useImageListStore,
  useMemberStore,
  useMsgListStore,
  useRoomDataStore,
} from "../store";
import { FileObj, MessageObj, RoomDataObj } from "../type";

// components
import TopBar from "./TopBar";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import SideBar from "./SideBar";
import RightNav from "./RightNav";
import formatBytes from "../functions/formatBytes";

const App: React.FC = () => {
  // const socket = useContext(SocketContext);
  const user = auth.currentUser;
  const { roomData, addRoomData, updateMsgInRoom, removeRoom } =
    useRoomDataStore();
  const { setMsgList } = useMsgListStore();
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const setMembers = useMemberStore((state) => state.setMembers);
  const setImageList = useImageListStore((state) => state.setImageList);
  const setFileList = useFileListStore((state) => state.setFileList);
  const imageTypes = /(gif|jpe?g|tiff?|png|webp)$/i;

  useEffect(() => {
    // fetch all room where current user is in it and all messages in each room
    const roomQuery = query(
      collection(db, "group_messages"),
      where("joined_users", "array-contains", {
        userId: user?.uid,
        userName: user?.displayName,
        userAvt: user?.photoURL,
      }),
      orderBy("modified_at", "desc")
    );

    const unsubcribe = onSnapshot(roomQuery, (roomSnapshot) => {
      roomSnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // add room on mounted
          const roomDataObj = { ...change.doc.data(), id: change.doc.id };
          addRoomData(roomDataObj);
        }
        if (change.type === "modified") {
          // update room when new message comes
          updateMsgInRoom(change.doc.id, change.doc.data().messages);

          // if users send msg, set hasNewMsg to true for the rest of users in this room
          if (change.doc.data().messages) {
            (async () => {
              const q = query(
                // query for all users doc in notifications subcollection except current user
                collection(change.doc.ref, "notifications"),
                where(documentId(), "!=", change.doc.data().messages?.at(-1).id) // user id who sent last msg
              );
              const snapshot = await getDocs(q);
              snapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                  hasNewMsg: true,
                });
              });
            })();
          }
        }
        if (change.type === "removed") {
          // Removed room
          removeRoom(change.doc.id);
          setCurrentRoom(null);
          setMsgList([]);
        }
      });

      // const source = roomSnapshot.metadata.fromCache ? "local cache" : "server";
      // console.log(`Room data came from ${source}`);
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
        setMembers(currRoom.joined_users);
        if (currRoom.messages) {
          setMsgList(currRoom.messages);
          // update all sent images to imageList
          const imageMsg = currRoom.messages?.filter((msg: MessageObj) =>
            imageTypes.test(msg.type)
          );
          setImageList(imageMsg?.map((msg: MessageObj) => msg.userData));

          // update all sent files to fileList
          const fileMsg = currRoom.messages?.filter(
            (msg: MessageObj) =>
              !imageTypes.test(msg.type) && msg.type !== "text"
          );
          const fileArray: FileObj[] = fileMsg?.map((msg: MessageObj) => {
            return {
              fileName: msg.fileName,
              fileUrl: msg.userData,
              fileSize: formatBytes(msg.fileSize!),
            };
          });
          setFileList(fileArray);
        } else {
          // if room dont have msg
          setImageList([]);
          setFileList([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, roomData]);

  return (
    <>
      <div className="hidden lg:flex">
        <SideBar />
      </div>
      <div className="flex flex-col w-full h-full">
        <TopBar />
        <MessageContainer />
        {currentRoom && <MessageInput />}
      </div>
      {currentRoom && (
        <div className="hidden lg:flex">
          <RightNav />
        </div>
      )}
    </>
  );
};

export default App;
