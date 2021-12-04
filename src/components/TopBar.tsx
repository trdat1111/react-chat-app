import React from "react";
import { Toast } from "../service/sweet-alert";
import { useCurrentRoomStore } from "../store";
import { FiShare2 } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";

const TopBar: React.FC = () => {
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

  function shareRoom() {
    Toast.fire({
      icon: "info",
      title: `Room ID copied!`,
      position: "top",
      showCloseButton: true,
    });
    navigator.clipboard.writeText(currentRoom!.roomId);
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
              <HiUserGroup className="mr-1" />
              <p>{currentRoom?.totalMember} members</p>
            </div>
          </>
        )}
      </h3>
      <div>
        {currentRoom && (
          <button
            className="flex flex-row items-center button bg-blue-500 hover:bg-blue-600 mx-1"
            onClick={shareRoom}
          >
            <FiShare2 className="mr-1" />
            Share
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
