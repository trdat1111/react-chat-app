import React, { useContext } from "react";
import { RoomDataObj } from "../type";
import { auth } from "../service/firebase";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { signOut } from "firebase/auth";
import { SocketContext } from "../service/socket";
import { useRoomDataStore } from "../store";
import { Tooltip } from "@chakra-ui/react";
import createRoom from "../functions/createRoom";
import RoomList from "./RoomList";

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

  const listOfRoom =
    roomData &&
    roomData.map((room: RoomDataObj) => <RoomList room={room} key={room.id} />);

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
        {listOfRoom}
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
