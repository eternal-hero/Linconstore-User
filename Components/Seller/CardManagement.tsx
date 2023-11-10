import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {Card, Grid, ListItemIcon, Stack, Switch, Typography, useMediaQuery} from "@mui/material";
import {
    ArrowBack,
    BusinessCenterOutlined, FiberPinOutlined, KeyboardArrowRightOutlined,
    LockOutlined,
    SettingsOutlined,
    VisibilityOffOutlined
} from "@mui/icons-material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import {decrement, incrementStepper} from "../../Store/Stepper";
import {useDispatch, useSelector} from "react-redux";
import OrderCard from "./OrderCard";
import ChangePin from "./ChangePin";
import CardSupport from "./CardSupport";


type stepper = {
    stepper : {
        stepper: number
    }
}
const CardManagement : React.FC= () => {
    const stepper = useSelector((state: stepper)=> state.stepper.stepper);
    const isMobile : boolean = useMediaQuery('(max-width: 350px)');
    const isMatches : boolean = useMediaQuery('(max-width: 550px)');
    const dispatch = useDispatch();
    return      (
        <Card elevation={0} sx={{ background:'#f3f2f2', mt:1, p:2}}>
        <CssBaseline />
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            {stepper === 1 &&   <ArrowBack onClick={() => dispatch(decrement(1))} className={'pointer'}/> }
        </Box>
            <Box sx={{marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                // height: 600,
                justifyContent: 'center',
            }}>
                <Typography variant={'h6'} sx={{my:1}}>Card Management</Typography>
                {stepper === 1 &&
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{
                                minWidth: {xs: isMobile ? 200 : 300, sm: 'auto'},
                                background: 'transparent',
                                p: 2,
                                borderRadius: '8px',
                                color: 'black',
                                height: '200px'
                            }}>
                                <Box sx={{
                                    marginTop: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    // height: 600,
                                    justifyContent: 'space-between',
                                }}>
                                    <Stack mb={1} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'right'}}>
                                        <VisibilityOffOutlined className={'pointer'}/>
                                    </Stack>
                                    <Typography textAlign={'center'} variant={'h6'}>0000 0000 0000 0000</Typography>

                                    <Stack>
                                        <Typography variant={'h6'}>Jack smith</Typography>
                                        <Stack sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Stack direction={'row'} spacing={1}>
                                                <Typography variant={isMobile ? 'body1' : 'h6'}>CCV 000</Typography>
                                                <Typography variant={isMobile ? 'body1' : 'h6'}>EXP 00/00</Typography>
                                            </Stack>
                                            <Typography variant={isMobile ? 'body1' : 'h6'}>VISA</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <List
                                sx={{width: '100%', height: '200px', bgcolor: 'background.paper'}}
                            >
                                <ListItemButton >
                                    <ListItemIcon>
                                        <LockOutlined/>
                                    </ListItemIcon>
                                    <ListItemText id="" primary={<Typography variant={isMatches ? 'subtitle2' : 'body1'}> Lock Card</Typography>} sx={{color: 'black'}}/>
                                    <Switch/>
                                </ListItemButton>
                                <ListItemButton onClick={() => dispatch(incrementStepper(1))}>
                                    <ListItemIcon>
                                        <BusinessCenterOutlined/>
                                    </ListItemIcon>
                                    <ListItemText id="" primary={<Typography variant={isMatches ? 'subtitle2' : 'body1'}>Order new Card</Typography>} sx={{color: 'black'}}/>
                                    <KeyboardArrowRightOutlined/>
                                </ListItemButton>
                                <ListItemButton onClick={() => dispatch(incrementStepper(2))}>
                                    <ListItemIcon>
                                        <FiberPinOutlined/>
                                    </ListItemIcon>
                                    <ListItemText id="" primary={<Typography variant={isMatches ? 'subtitle2' : 'body1'}>Change Pin</Typography>} sx={{color: 'black'}}/>
                                    <KeyboardArrowRightOutlined/>
                                </ListItemButton>
                                <ListItemButton onClick={() => dispatch(incrementStepper(3))}>
                                    <ListItemIcon>
                                        <SettingsOutlined/>
                                    </ListItemIcon>
                                    <ListItemText id="" primary={<Typography variant={isMatches ? 'subtitle2' : 'body1'}>Lincon Card Support</Typography>} sx={{color: 'black'}}/>
                                    <KeyboardArrowRightOutlined/>
                                </ListItemButton>
                            </List>
                        </Grid>
                    </Grid>
                }
                {stepper === 2 && <OrderCard/>}
                {stepper === 3 && <ChangePin/>}
                {stepper === 4 && <CardSupport/>}
            </Box>
        </Card>
    )
}
export default CardManagement;