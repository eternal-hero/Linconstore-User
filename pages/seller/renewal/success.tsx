import {NextPage} from "next";
import Box from "@mui/material/Box";
import {CircularProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import Container from "@mui/material/Container";
import {useVerifyPayment} from "../../../hooks/useDataFetch";
const RenewalSuccess :  NextPage = () => {
        const router = useRouter()
        const onSuccess = (data : any) =>{
           router.push('/seller/business')
         }
         const {isLoading, mutate: verifySeller} = useVerifyPayment(onSuccess);
        const [isVerified, setIsVerified] = useState(false)
     useEffect(() => {
         const data  = {
             type: 'renew'
         }
         const timeout = setTimeout(() => {
             verifySeller(data)

         },500)

         return () => clearTimeout(timeout)
        }, [router, verifySeller])
    return (
    <Container component={'main'} maxWidth={'lg'}  >
        <>
            <CssBaseline />
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {!isVerified && <Typography variant={'h6'}>
                You will be redirected shortly
            </Typography>}
            {isLoading && <CircularProgress/>}
        </Box>
        </>
    </Container>
    )
}

export default RenewalSuccess;