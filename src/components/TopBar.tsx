import React from "react";
import { Toast } from "../service/sweet-alert";
import { useCurrentRoomStore } from "../store";
import { FiShare2 } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BsInfoCircle, BsListUl } from "react-icons/bs";

// component
import SideBar from "./LeftBar";
import RightNav from "./RightBar";

const TopBar: React.FC = () => {
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const pluralize = (count: number, noun: string, suffix = "s") =>
    `${count} ${noun}${count !== 1 ? suffix : ""}`;

  function shareRoom() {
    Toast.fire({
      icon: "info",
      title: `Room ID copied!`,
      position: "top",
      showCloseButton: true,
    });
    navigator.clipboard.writeText(currentRoom!.roomId);
  }

  function SideBarDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <div className="lg:hidden">
        <Button onClick={onOpen}>
          <BsListUl className="w-5 h-5" />
        </Button>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <SideBar />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  function RightNavDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <div className="lg:hidden">
        <Button onClick={onOpen}>
          <BsInfoCircle className="w-5 h-5" />
        </Button>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <RightNav />
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-row items-center justify-between h-16 px-3">
      <SideBarDrawer />
      <h3 className="text-xl font-bold mr-auto mx-2 pt-1">
        {currentRoom && (
          <>
            <ul>
              <li>{currentRoom?.roomName}</li>
            </ul>
            <div className="flex flex-row items-center text-base font-normal">
              <HiUserGroup className="mr-1" />
              <p>{pluralize(currentRoom?.totalMember, "member")}</p>
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
            <FiShare2 className="mr-1" />
            Share
          </button>
        )}
      </div>
      <RightNavDrawer />
    </div>
  );
};

export default TopBar;
