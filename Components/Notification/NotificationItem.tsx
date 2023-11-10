import React from 'react';
import { INotification } from '../../Store/Notification';
import { Box, Typography } from '@mui/material'
import { timeDifference } from '../../Helpers/getDate';
import { useDispatch } from 'react-redux';
import { readOne } from '../../Store/Notification';

interface INotificationItemProp {
    notification: INotification
}
const NotificationItem: React.FC<INotificationItemProp> = ({ notification }) => {
    
    const dispatch = useDispatch();
    
    const timePassed = timeDifference(notification.createdAt.toString())
    
    const handleRead = () => {
        dispatch(readOne(notification))
    }
    return (
        <Box 
            sx={{
                p: 2,
                cursor: !notification.isRead ? 'pointer' : '',
                bgcolor: notification.isRead ? '#B2FFD9' : '#bce9c1',
            }}
            onClick={handleRead}
        >
            <Box display='flex' color='black' justifyContent='space-between' >
                <Box className='notification-title-wrap' display='flex' >
                    {/* <>Icon here</> */}
                    <Typography >{notification.title}</Typography>
                </Box>
                <Box>
                    <Typography>{timePassed}</Typography>
                </Box>
            </Box>
            <Box className='notification-message'>
                <Typography color='black'>{notification.content}</Typography>
            </Box>
        </Box>
    )
}

export default NotificationItem