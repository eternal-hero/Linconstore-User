import {stepperStore} from './Stepper';
import {configureStore} from '@reduxjs/toolkit'
import store from './Modal';
import util from "./Utils";
import  auth from  "./Auth"
import currency from "./Currency";
import payout from "./Payout";
import notification from './Notification'
import ChatRoom from './ChatRoom';
import Message from './Message';
import Order from './Order';
import Filter from './filter';
const Store = configureStore({
    reducer: {
        stepper: stepperStore,
        modal:store,
        util,
        auth,
        currency,
        payout,
        notification,
        ChatRoom,
        Message,
        Order,
        Filter,
    }
})
export  default Store;

export type RootState = ReturnType<typeof Store.getState>