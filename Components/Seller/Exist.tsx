import { Box, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import {Store} from '@mui/icons-material';
import React from 'react';
import Footer from '../Layouts/Footer';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useTranslation } from "react-i18next";
import Holder from '../Wappers/Holder';

const Exist = () => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const router = useRouter()
    
    return (
        <>

            <Holder title={t("pagetitle.Already_Exist")}>
                <Grid container height={ isMobile ? "calc(100vh - 106px)" : "calc(100vh - 50px)"}>
                    <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={5}>
                        <Stack gap={5}>
                            <Typography color="primary" variant='h6' fontSize={15} fontWeight={500}>{t("store.You_already_have_store")}</Typography>
                            <Button variant='outlined' sx={{textTransform: "capitalize"}} onClick={() => router.push('/seller')}>
                                <Store />
                                {t("store.My_Store")}
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid 
                        item 
                        xs={0} 
                        sx={{ display: { xs: "none", sm: "flex" } }} 
                        sm={5}
                        bgcolor={'white'}
                        display={"flex"}
                        justifyContent={"end"}
                    >
                        <Box width={"100%"} height={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Image
                                width={400}
                                height={400}
                                style={{ marginTop: 30, width: "100%", height: "100%" }}
                                placeholder="blur"
                                blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                                src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/jxzwtvuhywv7eegz0hif"}
                                alt={"image of Happy"}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Holder>

            <Footer />
        </>
    )
}

export default Exist