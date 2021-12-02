import create from "zustand";
import { FileObj, Members, RoomDataObj } from "./type";
import { MessageObj } from "./type";
import { devtools } from "zustand/middleware";
import produce from "immer";

// formValue
export const useFormValueStore = create(
  devtools((set: any) => ({
    formValue: "",
    setFormValue: (value: string) => set({ formValue: value }),
  }))
);

// roomData
interface roomDataState {
  roomData: RoomDataObj[] | null;
  setRoomData: (dataArr: RoomDataObj[]) => void;
  addRoomData: (roomObj: RoomDataObj) => void;
  updateMsgInRoom: (roomId: string, msgList: []) => void;
  removeRoom: (roomId: string) => void;
}

export const useRoomDataStore = create<roomDataState>(
  devtools(
    (set, get): roomDataState => ({
      roomData: [],
      setRoomData: (dataArr) => set({ roomData: dataArr }), // not in use
      addRoomData: (roomObj) =>
        set(
          (state) =>
            state.roomData
              ? { roomData: [...get().roomData!, roomObj] }
              : { roomData: [roomObj] } // if new users have some joined room, then add new created room to arr, else new created room will take the first place
        ),
      updateMsgInRoom: (roomId, msgList) =>
        set(
          produce((draft) => {
            const changedRoom = draft.roomData.find(
              (roomObj: RoomDataObj) => roomObj.id === roomId
            );
            changedRoom.messages = msgList;
          })
        ),
      removeRoom: (roomId) =>
        set(
          produce((draft) => {
            const removedRoomIndex = draft.roomData.findIndex(
              (roomObj: RoomDataObj) => roomObj.id === roomId
            );
            draft.roomData.splice(removedRoomIndex, 1);
          })
        ),
    })
  )
);

// msgList
interface msgListState {
  msgList: MessageObj[];
  setMsgList: (msgArr: MessageObj[]) => void;
  addMsgToList: (msgObj: MessageObj) => void;
}

export const useMsgListStore = create<msgListState>(
  devtools(
    (set, get): msgListState => ({
      msgList: [],
      setMsgList: (msgArr) => set({ msgList: msgArr }),
      addMsgToList: (msgObj) =>
        set(
          (state) =>
            state.msgList
              ? { msgList: [...get().msgList, msgObj] }
              : { msgList: [msgObj] } // if room have messages, then add new message to list, else new message will take the first place
        ),
    })
  )
);

// currentRoom
type currentRoom = {
  roomId: string;
  roomName: string;
  totalMember: number;
  members: [];
};

interface currentRoomState {
  currentRoom: currentRoom | null;
  setCurrentRoom: (roomObj: currentRoom | null) => void;
}

export const useCurrentRoomStore = create<currentRoomState>(
  devtools(
    (set): currentRoomState => ({
      currentRoom: null,
      setCurrentRoom: (roomObj) => set({ currentRoom: roomObj }),
    })
  )
);

// members
interface memberState {
  members: Members[];
  setMembers: (members: Members[]) => void;
  addMember: (member: Members) => void;
}

export const useMemberStore = create<memberState>(
  devtools(
    (set, get): memberState => ({
      members: [],
      setMembers: (members) => set({ members: members }),
      addMember: (member) =>
        set((state) =>
          state.members
            ? { members: [...get().members, member] }
            : { members: [member] }
        ),
    })
  )
);

// image list
interface imageListState {
  imageList: string[];
  setImageList: (imageArr: string[]) => void;
  addImage: (image: string) => void;
}

export const useImageListStore = create<imageListState>(
  devtools(
    (set, get): imageListState => ({
      imageList: [],
      setImageList: (imageArr) => set({ imageList: imageArr }),
      addImage: (image) =>
        set((state) =>
          state.imageList
            ? { imageList: [...get().imageList, image] }
            : { imageList: [image] }
        ),
    })
  )
);

// file list
interface FileListState {
  fileList: FileObj[];
  setFileList: (fileList: FileObj[]) => void;
  addFile: (file: FileObj) => void;
}

export const useFileListStore = create<FileListState>(
  devtools(
    (set, get): FileListState => ({
      fileList: [],
      setFileList: (fileList) => set({ fileList: fileList }),
      addFile: (file) =>
        set((state) =>
          state.fileList
            ? { fileList: [...get().fileList, file] }
            : { fileList: [file] }
        ),
    })
  )
);
