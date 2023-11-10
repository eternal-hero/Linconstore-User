import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { CHATROOM_STATUS, CHAT_TYPE, USER_ROLE } from "../Helpers/socket"

export type IChatRoom = {
    _id?: string,
    roomName: string,
    userName: string,
    type: CHAT_TYPE,
    isAdminJoined: boolean,
    status: CHATROOM_STATUS,
    sellerId?: string,
    buyerId: TUser,
    buyerDetails?:BuyerDetails,
    productId?: TProduct,
    productDetails?:ProductDetails
}

type TUser = {
    firstName: string;
    lastName: string;
    _id: string;
}

type BuyerDetails = {
    firstName: string,
    lastName: string,
    _id: string
};
type ProductDetails = {
    title: string,
    _id: string
};
type TOwner = {
    name: string;
    logo: string;
    owner: string;
    _id: string;
};
export type TProduct = {
    title: string;
    _id: string;
    description: string;
    price: number;
    owner: TOwner;
    weight: string;
    quantity: number;
    photo: string[];
    shippingDetail: string;
    instruction: string;
    condition: string;
    variants: any[];
};

interface InitialStateType {
    chatRooms: IChatRoom[],
    chatRole: USER_ROLE
}

interface ISetCurrentChatRoomAndProductPayload {
    roomId: string,
}

const initialState: InitialStateType = {
    chatRooms: [],
    chatRole: USER_ROLE.BUYER,
}



const chatRoom = createSlice({
    name: 'chatRoom',
    initialState,
    reducers: {
        insertNewChatRoom(state: InitialStateType, action: PayloadAction<IChatRoom>) {
            state.chatRooms.push(action.payload);
        },
        setChatRole(state: InitialStateType, action: PayloadAction<USER_ROLE>) {
            state.chatRole = action.payload
        },
        updateChatRooms(state:InitialStateType, action: PayloadAction<IChatRoom[]>) {
            state.chatRooms = action.payload;
        },
        removeChatRoom(state: InitialStateType, action: PayloadAction<IChatRoom>) {
            state.chatRooms = state.chatRooms.filter((room) => room.roomName !== action.payload.roomName);
        },
        removeDuplications(state: InitialStateType) {
            // Removing duplicates from allChatRooms
            const rooms = state.chatRooms.map(({ roomName }) => roomName);
            const filteredRooms = state.chatRooms.filter(({ roomName }, index) =>
                !rooms.includes(roomName, index + 1));
            state.chatRooms = filteredRooms
        }
    }
})

export const { insertNewChatRoom, setChatRole, updateChatRooms, removeChatRoom, removeDuplications } = chatRoom.actions;

export default chatRoom.reducer;