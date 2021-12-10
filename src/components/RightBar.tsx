import React from "react";
import {
  useCurrentRoomStore,
  useFileListStore,
  useImageListStore,
  useMemberStore,
} from "../store";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { BsBoxArrowLeft, BsFileEarmarkZip, BsInfoCircle } from "react-icons/bs";
import { MdGroup } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import { IoMdImages } from "react-icons/io";
import { BiFile } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { Members, FileObj } from "../type";
import { arrayRemove, doc, updateDoc } from "@firebase/firestore";
import { auth, db } from "../service/firebase";
import { Modal } from "../service/sweet-alert";
import { AiTwotoneSetting } from "react-icons/ai";
import image_icon from "../assets/image-icon.svg";
import file_icon from "../assets/file-icon.svg";
import { arrayUnion, Timestamp } from "firebase/firestore";

const RightNav = () => {
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const members = useMemberStore((state) => state.members);
  const imageList = useImageListStore((state) => state.imageList);
  const fileList = useFileListStore((state) => state.fileList);
  const user = auth.currentUser;

  function leaveRoom() {
    Modal.fire({
      title: `Leave ${currentRoom?.roomName}?`,
      icon: "question",
      showConfirmButton: true,
      confirmButtonText: "Leave",
      confirmButtonColor: "#F87171",
      showCancelButton: true,
      timer: undefined,
      width: "400",
    }).then(async (result) => {
      if (result.isDismissed) return;
      else if (result.isConfirmed) {
        const roomRef = doc(db, "group_messages", currentRoom!.roomId);
        await updateDoc(roomRef, {
          joined_users: arrayRemove({
            userId: user?.uid,
            userName: user?.displayName,
            userAvt: user?.photoURL,
          }),
          // add leave notification message
          messages: arrayUnion({
            id: user?.uid,
            user: user?.displayName!,
            userData: `${user?.displayName} has left`,
            created_at: Timestamp.now(),
            photoURL: user?.photoURL!,
            type: "notification",
          }),
        });
        setCurrentRoom(null);
      }
    });
  }

  function changeAvatar() {}

  return (
    <div className="border-l-2">
      <div className="flex justify-center items-center border-b-2 p-4">
        <BsInfoCircle className="w-5 h-5 mr-1" />
        <p className="text-xl font-bold">Room Info</p>
      </div>
      <div className="flex flex-col justify-center items-center my-3">
        <img
          src={`https://avatars.dicebear.com/api/initials/${
            currentRoom && currentRoom.roomName + currentRoom.roomId
          }.svg`}
          alt=""
          className="w-12 h-12 rounded-2xl m-2"
        />
        <p className="font-bold">{currentRoom?.roomName}</p>
        <p className="text-sm">ID: {currentRoom?.roomId}</p>
      </div>
      <Tabs variant="enclosed" isFitted className="h-1/2">
        <TabList>
          <Tab>
            <MdGroup />
            <p className="text-sm ml-1">Members</p>
          </Tab>
          <Tab>
            <IoMdImages />
            <p className="text-sm ml-1">Images</p>
          </Tab>
          <Tab>
            <BiFile />
            <p className="text-sm ml-1">Files</p>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{members && <MembersTab members={members} />}</TabPanel>
          <TabPanel>
            {imageList.length !== 0 ? (
              <ImagesTab imageList={imageList} />
            ) : (
              <div className="flex flex-col justify-center items-center text-center w-full h-40">
                <img src={image_icon} className="w-10 h-10 mb-1" alt="" />
                <p className="text-sm w-60">
                  No image have been shared in this conversation yet
                </p>
              </div>
            )}
          </TabPanel>
          <TabPanel p={fileList.length ? `0` : `4`}>
            {fileList.length !== 0 ? (
              <FilesTab fileList={fileList} />
            ) : (
              <div className="flex flex-col justify-center items-center text-center w-full h-40">
                <img src={file_icon} className="w-10 h-10 mb-1" alt="" />
                <p className="text-sm w-60">
                  No files have been shared in this conversation yet
                </p>
              </div>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <div className="fixed bottom-2 w-80 border-t-2">
        <p className="flex flex-row items-center font-bold m-3">
          <AiTwotoneSetting className="w-5 h-5 mr-1" />
          Options
        </p>
        <div
          onClick={changeAvatar}
          className="flex flex-row items-center w-full text-gray-900 hover:bg-gray-100 cursor-pointer p-2"
        >
          <BsBoxArrowLeft className="w-7 h-7 mr-3" />
          Change room avatar
        </div>
        <div
          onClick={leaveRoom}
          className="flex flex-row items-center w-full text-red-500 hover:bg-red-100 cursor-pointer p-2"
        >
          <BsBoxArrowLeft className="w-7 h-7 mr-3" />
          Leave Room
        </div>
      </div>
    </div>
  );
};

const MembersTab: React.FC<{ members: Members[] }> = ({ members }) => {
  return (
    <div>
      <SimpleBar className="overflow-y-auto h-4/6">
        {members.map((member: Members) => (
          <div className="flex flex-row items-center mb-2" key={member.userId}>
            <img
              src={member.userAvt}
              className="w-10 h-10 rounded-full mr-2"
              alt=""
            />
            <div className="text-sm font-semibold">{member.userName}</div>
          </div>
        ))}
      </SimpleBar>
    </div>
  );
};

const ImagesTab: React.FC<{ imageList: string[] }> = ({ imageList }) => {
  return (
    <SimpleBar className="overflow-y-auto h-4/6">
      <div className="grid grid-cols-3 gap-1">
        {imageList.map((image: string) => (
          <img
            key={uuidv4()}
            src={image}
            className="min-h-full min-w-full rounded-md border-2 border-black"
            alt=""
          />
        ))}
      </div>
    </SimpleBar>
  );
};

const FilesTab: React.FC<{ fileList: FileObj[] }> = ({ fileList }) => {
  return (
    <div>
      <SimpleBar
        className="overflow-y-auto h-4/6"
        autoHide={false}
        forceVisible="y"
      >
        {fileList.map((file: FileObj) => (
          <div className="flex flex-row items-center h-16" key={uuidv4()}>
            <BsFileEarmarkZip className="w-8 h-8 ml-3 text-blue-̃600" />
            <div className="flex flex-col p-3 w-56">
              <div className="text-sm font-semibold truncate">
                {file.fileName}
              </div>
              <div className="text-sm">{file.fileSize}</div>
            </div>
            <a href={file.fileUrl}>
              <HiDownload className="w-6 h-6 border-2 rounded hover:bg-gray-100" />
            </a>
          </div>
        ))}
      </SimpleBar>
    </div>
  );
};

export default RightNav;
