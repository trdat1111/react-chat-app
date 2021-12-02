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
import { BsBoxArrowLeft, BsFileEarmarkZip } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { Members, FileObj } from "../type";

const RightNav = () => {
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const members = useMemberStore((state) => state.members);
  const imageList = useImageListStore((state) => state.imageList);
  const fileList = useFileListStore((state) => state.fileList);

  return (
    <div className="w-5/12 border-l-2">
      <div className="flex justify-center items-center border-b-2 p-4">
        <p className="text-xl font-bold">Room info</p>
      </div>
      <div className="flex flex-col justify-center items-center my-3">
        <img
          src={`https://avatars.dicebear.com/api/initials/${
            currentRoom!.roomName + currentRoom!.roomId
          }.svg`}
          alt=""
          className="w-12 h-12 rounded-2xl m-2"
        />
        <p>{currentRoom!.roomName}</p>
      </div>
      <Tabs variant="enclosed" isFitted className="h-1/2">
        <TabList>
          <Tab>Members</Tab>
          <Tab>Images</Tab>
          <Tab>Files</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{members && <MembersTab members={members} />}</TabPanel>
          <TabPanel>
            {imageList.length !== 0 ? (
              <ImagesTab imageList={imageList} />
            ) : (
              <div>No image</div>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {fileList.length !== 0 ? (
              <FilesTab fileList={fileList} />
            ) : (
              <div>No file</div>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <div className="fixed bottom-2 w-80 border-t-2">
        <p className="font-bold m-3">Options</p>
        <div className="flex flex-row items-center w-full text-red-500 hover:bg-red-100 cursor-pointer p-2">
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
          <div className="flex flex-row items-center mb-2" key={uuidv4()}>
            <a
              href={file.fileUrl}
              className="flex flex-row w-80 hover:bg-gray-200 items-center"
            >
              <BsFileEarmarkZip className="w-8 h-8 ml-3 text-blue-̃600" />
              <div className="flex flex-col p-3">
                <div className="text-sm font-semibold">{file.fileName}</div>
                <div className="text-sm">{file.fileSize}</div>
              </div>
            </a>
          </div>
        ))}
      </SimpleBar>
    </div>
  );
};

export default RightNav;
