import React from "react";
import { Card, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Brightness1Outlined } from "@mui/icons-material";
import { useReadFeedback } from "../../../hooks/useDataFetch";

const FeedbackCards: React.FC<any> = ({ feedBack, handleRefetch }) => {

    const checkReadFeedback = () => {
        readFeedback({ id: feedBack._id })
    }

    const onSuccess = () => {
        handleRefetch();
    };
    
    const { isLoading, mutate: readFeedback } = useReadFeedback(onSuccess);

    return (
        <Card elevation={1} className={'pointer'} sx={{ width: '100%', p: 2, bgcolor: '#fff', color: '#000', borderRadius: '7px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography textAlign={'justify'} variant={'subtitle2'} sx={{ mb: 1 }}>
                    {feedBack.message}
                </Typography>
                <Stack direction={'row'} justifyContent={"space-between"} alignItems={"baseline"}>
                    <Stack direction={'row'} spacing={1}>
                        <Avatar variant={'circular'} sx={{ bgcolor: "var(--primary)" }}>{(feedBack.user.firstName ?? feedBack.user.lastName ?? "User").slice(0, 2)}</Avatar>
                        <Stack>
                            <Typography variant={'body1'}>{feedBack.user.firstName + feedBack.user.lastName}</Typography>
                            <Typography variant={'subtitle2'}>{feedBack.user.email}</Typography>
                        </Stack>
                    </Stack>

                    <Brightness1Outlined color="primary" onClick={checkReadFeedback} />
                </Stack>
            </Box>

        </Card>

    )

}
export default FeedbackCards;