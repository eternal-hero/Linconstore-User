import React from "react";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { decrementStepper } from "../../Store/Stepper";
import { useDispatch } from "react-redux";

const CardSupport: React.FC = () => {
    const dispatch = useDispatch();
    return (
        <>
            <ArrowBack sx={{ alignSelf: 'flex-start' }} onClick={() => dispatch(decrementStepper(3))} className={'pointer'} />

            <Box sx={{ p: 2, border: '2px solid black' }}>
                <Stack sx={{ borderBottom: '2px solid black' }}>
                    <Typography variant={'h6'}>Card Support</Typography>
                </Stack>
                <Stack spacing={4}>
                    <Typography variant={'body1'}>Send a message</Typography>
                    <Typography variant={'body1'}>Call now: +44 7785611300</Typography>
                    <Typography variant={'body1'}>Email : card@linconstore.com</Typography>
                </Stack>
            </Box>
        </>

    )
}
export default CardSupport