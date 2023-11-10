import io from 'socket.io-client';
import { baseUrl } from './baseUrl';

const socket = io(baseUrl, {
    autoConnect: false
});

export enum SOCKET_CHANNELS {
    JOIN = 'JOIN',
    JOIN_CHAT = 'JOIN_CHAT',
    SEND_MESSAGE = 'SEND_MESSAGE',
    RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
    SEND_NOTIFICATION = 'SEND_NOTIFICATION',
    RECEIVE_NOTIFICATION = 'RECEIVE_NOTIFICATION',
}

export enum CHAT_TYPE {
    NORMAL_CHAT = 'NORMAL_CHAT',
    REFUND_CHAT = 'REFUND_CHAT',
    ADMIN_CHAT = 'ADMIN_CHAT',
}

export enum CHATROOM_STATUS {
    CLOSED = 'CLOSED',
    OPENED = 'OPENED',
}

// export enum NOTIFICATION_TYPE {
//     ORDER_SUCCESS= 'order_success',
//     ORDER_SHIPPED= 'order_shipped',
//     ORDER_CANCELLED= 'order_shipped',
//     NEW_MESSAGE_FROM_STORE= 'new_message_from_store',
//     PASSWORD_CHANGED= 'password_changed',
//     BROADCAST_MESSAGE= 'broadcast_message',
//     SELLER_NEW_ORDER_RECEIVED = 'seller_new_order_received',
//     SELLER_PLAN_UPGRADED_TO_PREMIUM = 'seller_plan_upgraded_to_premium',
//     SELLER_NEW_MESSAGE = 'seller_new_message',
//     SELLER_NEW_DISPUTE_OPENED = 'seller_new_dispute_opened',
// }

export enum NOTIFICATION_TARGET {
    All = 'ALL',
    BUYER = 'BUYER',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
}

export enum USER_ROLE {
    ADMIN = 'ADMIN',
    SELLER = 'SELLER',
    BUYER = 'BUYER',
}

export default socket