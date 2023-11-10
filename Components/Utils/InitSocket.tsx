import React, { useContext, useEffect } from 'react';
import socket, { SOCKET_CHANNELS, USER_ROLE } from '../../Helpers/socket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Index';
import ContextApi from '../../Store/context/ContextApi';
import { insertNewNotifications, INotification } from '../../Store/Notification';
import axios from 'axios';
import { baseUrl } from '../../Helpers/baseUrl';
import { updateChatRooms } from '../../Store/ChatRoom';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


const InitSocket = () => {
    const isLoggedIn = useContext(ContextApi).isLoggedIn;
    const isAdminLoggedIn = useContext(ContextApi).isAdminLoggedIn
    const dispatch = useDispatch();
    const router = useRouter()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getChatRooms = async ({ url = '', buyerId = null, sellerId = null, isAdminLoggedIn = false }) => {
        // const response = await axios.get(`${baseUrl}/chatRoom/?buyerId=${buyerId}&sellerId=${sellerId}&isAdminLoggedIn=${isAdminLoggedIn}`);
        const response = await axios.get(`${baseUrl}/${url}`);
        if (response.status === 200) {
            dispatch(updateChatRooms(response.data))
        }
    }
    const getUserInfoFromCookies = () => {
        const userInfoData = Cookies.get('userInfo');
        if (userInfoData) {
            return JSON.parse(userInfoData);
        }
        return null;
    };
    React.useEffect(() => {
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const userInfo = getUserInfoFromCookies();

        socket.connect()
        if (isAdminLoggedIn) {
            // socket.emit(SOCKET_CHANNELS.JOIN, {userInfo: null, role: USER_ROLE.ADMIN})
            // getChatRooms({isAdminLoggedIn})
        } else {
            if (userInfo !== null && isLoggedIn && userInfo._id) {
                if (userInfo.sellerId) {
                    const chatRoomName = localStorage.getItem('currentChatRoomName');
                    const userIdFromRoom = chatRoomName?.split(':')[1];
                    if (userIdFromRoom === userInfo?._id && router?.asPath !== '/seller/messages') {
                        socket.emit(SOCKET_CHANNELS.JOIN, { userInfo, role: USER_ROLE.BUYER })
                        getChatRooms({ url: `buyerChatRoom?buyerId=${userInfo?._id}` })
                    } else {
                        socket.emit(SOCKET_CHANNELS.JOIN, { userInfo, role: USER_ROLE.SELLER })
                        // getChatRooms({buyerId: userInfo._id, sellerId: userInfo.sellerId})
                        getChatRooms({ url: `sellerChatRoom?sellerId=${userInfo.sellerId}` })

                    }
                } else {
                    // getChatRooms({buyerId: userInfo._id})
                    socket.emit(SOCKET_CHANNELS.JOIN, { userInfo, role: USER_ROLE.BUYER })
                    getChatRooms({ url: `buyerChatRoom?buyerId=${userInfo?._id}` })
                }
            }
        }

        const handleReceiveNotification = (notification: INotification) => {
            dispatch(insertNewNotifications(notification))
        }

        socket.on(SOCKET_CHANNELS.RECEIVE_NOTIFICATION, handleReceiveNotification)

        return () => {
            socket.disconnect()
            socket.off(SOCKET_CHANNELS.RECEIVE_NOTIFICATION, handleReceiveNotification)
        }
    }, [isLoggedIn, isAdminLoggedIn, dispatch, router])

    return null;
}

export default InitSocket
