import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { CHAT_TYPE, USER_ROLE } from "../Helpers/socket";

export interface IMessage {
    from?: string,
    roomName: string,
    userName?: string,
    senderRole: USER_ROLE,
    type: CHAT_TYPE,
    content: string,
    isRead: boolean,
    createdAt?: Date,
    image?: any
}

interface InitialStateType {
    messages: IMessage[],
    adminMessages: IMessage[]
}

const initialState: InitialStateType = {
    messages: [],
    adminMessages: []
}

const messages = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        insertNewMessage(state: InitialStateType, action: PayloadAction<IMessage>) {
            state.messages.push(action.payload)
        },
        updateMessages(state: InitialStateType, action: PayloadAction<IMessage[]>) {
            state.messages = action.payload
        },
        insertNewAdminMessage(state: InitialStateType, action: PayloadAction<IMessage>) {
            state.adminMessages.push(action.payload)
        },
        updateAdminMessages(state: InitialStateType, action: PayloadAction<IMessage[]>) {
            state.adminMessages = action.payload
        },
    }
})

export const { 
            insertNewMessage,
            updateMessages, 
            insertNewAdminMessage, 
            updateAdminMessages } = messages.actions;

export default messages.reducer;