import React, { useState, useEffect, useRef } from "react";
// import { SocketContext } from "../service/socket";
import {
  query,
  onSnapshot,
  collection,
  DocumentData,
  where,
} from "firebase/firestore";
import { auth, db } from "../service/firebase";

// components
import TopBar from "./TopBar";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";

type roomData = {
  id: string;
  joined_user: [""];
  room_name: "";
  messages: {}[];
};

const ChatForm: React.FC = () => {
  // const socket = useContext(SocketContext);
  const [msgList, setMsgList] = useState<DocumentData[] | {}[]>([]);
  const dummy: any = useRef();
  const [noti, setNoti] = React.useState([""]);
  const [data, setData] = useState<roomData[] | any>();
  const [currentRoom, setCurrentRoom] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    // fetch room based on joined users and all messages in each room
    const roomQuery = query(
      collection(db, "group_messages"),
      where("joined_users", "array-contains", user?.uid)
    );

    const unsubcribe = onSnapshot(
      roomQuery,
      { includeMetadataChanges: true },
      (roomSnapshot) => {
        const arr = roomSnapshot.docs.map((doc) =>
          Object.assign(doc.data(), { id: doc.id })
        );
        !data ? setData(arr) : setData([...data, ...arr]);

        const source = roomSnapshot.metadata.fromCache
          ? "local cache"
          : "server";
        console.log(`Room data came from ${source}`);
        // TODO: message sent by other user doesn't display immediately
      }
    );

    dummy.current.scrollIntoView({
      behavior: "smooth",
    });

    return () => unsubcribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentRoom) {
      const room = data.find((messageObj: roomData) => {
        return messageObj.id === currentRoom;
      });
      setMsgList(room?.messages); // array of message objects
    }

    dummy.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentRoom, data, msgList]);

  const Rooms =
    data &&
    data.map((room: roomData, index: number) => {
      return (
        <div key={index}>
          {/* <div>{room.id}</div> */}
          <div onClick={() => setCurrentRoom(room.id)}>{room.room_name}</div>
        </div>
      );
    });

  return (
    <>
      <TopBar
        noti={noti}
        setNoti={setNoti}
        setMsgList={setMsgList}
        rooms={data}
        setRooms={setData}
      />
      <MessageContainer
        msgList={msgList}
        noti={noti}
        setNoti={setNoti}
        dummy={dummy}
        currentRoom={currentRoom}
      />
      <MessageInput
        msgList={msgList}
        setMsgList={setMsgList}
        currentRoom={currentRoom}
      />
      {Rooms}
    </>
  );
};

export default ChatForm;
