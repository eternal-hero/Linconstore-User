import {NextPage} from "next";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {useRouter} from "next/router";
import {useEffect} from "react";

const PaymentFailure :  NextPage = () => {
    const  router = useRouter();
    useEffect(() => {
        router.push('/')
    },[router])
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Typography variant={'h6'}>
                You will be redirected shortly
            </Typography>
        </Box>
    )
}

export default PaymentFailure;