import React, { useEffect, useState } from 'react';
import NotificationItem from './NotificationItem';
import { INotification } from '../../Store/Notification';
import { Box, Typography } from '@mui/material'
import { useDispatch } from 'react-redux';
import { readAll } from '../../Store/Notification';
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { baseUrl } from "../../Helpers/baseUrl";
import axios from "axios";

interface INotificationProp {
    newNotifications: INotification[],
    olderNotifications: INotification[]
}

const Notification: React.FC<INotificationProp> = ({ newNotifications, olderNotifications }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const handleReadAll = async () => {
        const userInfoData = Cookies.get('userInfo');
        if(userInfoData){
            const adminToken = Cookies.get('adminToken')
            const token = Cookies.get('token')
            const config = {
                headers: {
                    Authorization: token ?? adminToken
                }
            }
            try {
                const resp = await axios.get(`${baseUrl}/api/notification/markRead/all`, config)
                if (resp.data) {
                    dispatch(readAll());
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Box sx={{
            width: "300px",
            overflowY: "scroll",
            maxHeight: "50vh",
        }}>
            <Box className='new-notification-wrap'>
                <Box className='new-notification-header' sx={{
                    display: 'flex',
                    bgcolor: '#B2FFD9',
                    p: 2,
                    justifyContent: 'space-between'
                }}>
                    <Typography color={'black'} fontWeight={500} fontSize={15}>{t("notification.new")}</Typography>
                    <Typography color={'green'} fontWeight={500} fontSize={15} onClick={handleReadAll} sx={{ cursor: 'pointer' }} >{t("notification.mark_as_read")}</Typography>
                </Box>
                <Box className='new-notifications' display='flex' flexDirection='column'>
                    {
                        newNotifications?.map((item) => {
                            return <NotificationItem key={item.createdAt.toString()} notification={item} />
                        })
                    }
                </Box>
            </Box>
            <Box className='older-notification-wrap'>
                <Box className='older-notification-header' bgcolor='#B2FFD9' p={2}>
                    <Typography color={'black'} fontWeight={500} fontSize={15}>{t("notification.older_notifications")}</Typography>
                </Box>
                <Box className='older-notifications' display='flex' flexDirection='column'>
                    {
                        olderNotifications?.map((item) => {
                            return <NotificationItem key={item.createdAt.toString()} notification={item} />
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Notification