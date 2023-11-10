import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

interface IHelpCenterItem {
    title: string;
    icon: React.ReactNode;
    link: string;
}

const HelpCenterItem: React.FC<IHelpCenterItem> = ({title, icon, link}) => {
    const router = useRouter();
    return (
        <Box display={"flex"} gap={2} p={3} border={"2px solid gray"} sx={{cursor: "pointer"}} onClick={() => router.push(link)}>
            {icon}
            <Typography>{title}</Typography>
        </Box>
    )
}

export default HelpCenterItem