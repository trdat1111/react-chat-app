import create from "zustand";
import { RoomDataObj } from "./type";
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

// notiList
interface notiState {
  notiList: string[];
  setNoti: (singleNoti: string) => void;
}

export const useNotiStore = create<notiState>(
  devtools(
    (set, get): notiState => ({
      notiList: [],
      setNoti: (singleNoti) =>
        set((state) =>
          state.notiList
            ? { notiList: [...get().notiList, singleNoti] }
            : { notiList: [singleNoti] }
        ),
    })
  )
);

// currentRoom
type currentRoom = { roomId: string; roomName: string; totalMember: number };

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
