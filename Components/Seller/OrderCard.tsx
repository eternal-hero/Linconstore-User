import React from "react";
import Box from "@mui/material/Box";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { decrementStepper } from "../../Store/Stepper";
import { useDispatch } from "react-redux";

const OrderCard: React.FC = () => {
    const dispatch = useDispatch()
    return (
        <>
            <ArrowBack sx={{ alignSelf: 'flex-start' }} onClick={() => dispatch(decrementStepper(1))} className={'pointer'} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant={'body1'}>Order debit card to spend directly from your store account</Typography>
                <Box sx={{ border: '2px solid black', p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                                <Typography variant={'h6'}>
                                    YOUR DEBIT CARD WILL BE SENT TO THE ADDRESS YOU HAVE ON FILE.
                                </Typography>
                                <Typography variant={'h6'}>
                                    COST : 20$
                                </Typography>
                                <Typography variant={'body2'}>
                                    No Monthly fee
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                                <Typography variant={'h6'}>JOHN NAPEL</Typography>
                                <Typography variant={'h6'}>    123 ROSALIE ST SAN MATEO, LOS ANGELES, UNITED STATES.
                                </Typography>

                                <Button variant={'contained'} className={'color'} sx={{ borderRadius: '8px' }}> ORDER NOW </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>

    )

}
export default OrderCard;