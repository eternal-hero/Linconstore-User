import {NextPage} from "next";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {useRouter} from "next/router";
import {useEffect} from "react";

const RenewalFailure :  NextPage = () => {
    const  router = useRouter();
    useEffect(() => {
        router.push('/')
    },[router])
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant={'h6'}>
                Seems there was a problem with your payment, pls try again
            </Typography>
        </Box>
    )
}

export default RenewalFailure;