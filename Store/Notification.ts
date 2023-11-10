import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { NOTIFICATION_TARGET, USER_ROLE } from "../Helpers/socket";

export interface INotification {
    from: string,
    to: string,
    senderRole: USER_ROLE,
    region?: string,
    language?: string,
    title: string,
    content: string,
    isRead: boolean,
    createdAt?: Date,
}

interface InitialStateType {
    notifications: INotification[],
}

const initialState: InitialStateType = {
    notifications: [],
}

const notification = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        getAllNotifications(state: InitialStateType, action: PayloadAction<INotification[]>){
            state.notifications = action.payload
        },
        insertNewNotifications(state: InitialStateType, action: PayloadAction<INotification>){
            state.notifications = [action.payload, ...state.notifications]
        },
        readAll(state: InitialStateType, action: PayloadAction<null>) {
            state.notifications = state.notifications.map((n) => {
                return {...n, ["isRead"]: true}
            })
        },
        readOne(state: InitialStateType, action: PayloadAction<INotification>) {
            state.notifications = state.notifications.map((n) => {
                if(n.createdAt.toString() === action.payload.createdAt.toString()) {
                    return {...n, ["isRead"]: true}
                } else {
                    return n
                }
            })
        }
    }
})

export const {getAllNotifications, insertNewNotifications, readAll, readOne} = notification.actions;

export default notification.reducer