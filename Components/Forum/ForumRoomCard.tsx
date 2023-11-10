import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Share } from '@mui/icons-material';
import { useRouter } from "next/router";

type ForumRoomProps = {
    createdBy: string;
    title: string;
    totalResponses: number;

}

const ForumRoomCard: React.FC<ForumRoomProps> = ({
    createdBy,
    title,
    totalResponses
}) => {

    const router = useRouter()
    return (
        <Box boxShadow={"0 8px 16px 0 rgba(0, 0, 0, 0.2)"} p={3}>
            <Stack gap={2}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack gap={1}>
                        <Typography fontSize={14}>{createdBy}</Typography>
                        <Typography fontSize={14} color={"var(--primary)"}>{title}</Typography>
                    </Stack>
                    <Avatar sx={{ bgcolor: 'blue' }}>O</Avatar>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Box display={"flex"} gap={4}>
                        {
                            totalResponses === 0 
                            ? 
                            <Typography color={"red"}>{totalResponses} response</Typography>
                            :
                            <Typography color={"blue"}>{totalResponses} responded</Typography>
                        }
                        <Typography onClick={() => router.push("forum")} sx={{cursor: "pointer"}}>reply</Typography>
                    </Box>
                    <Box display={"flex"} gap={4}>
                        <Typography>share</Typography>
                        <Share color="primary" />
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}

export default ForumRoomCard