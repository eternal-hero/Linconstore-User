import React from 'react';
import Nav from '../Layouts/Nav';
import { Card, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import { Store } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Footer from '../Layouts/Footer';

const Guide = () => {
    
    const { t } = useTranslation();
    const isMobile = useMediaQuery("(max-width: 600px)");
    
    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Selling_Guide")}
                    description={
                        "Learn about Selling Guide when you purchase an item on Linconstore"
                    }
                    content={"Selling Guide | linconstore"}
                >
                    <ContentHeader 
                        title={t("sellershub.guide.Selling_Guide")}
                        paths={[t("about.ArrowBackTitle"), t("sellershub.Sellers_Hub"), t("sellershub.guide.Selling_Guide")]}
                        iconComponent={<Store sx={{color: "var(--primary)"}} />}
                        routePath="/seller-hub"
                    />
                        <Container component={"main"} maxWidth={"md"} sx={{py: 5}}>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Typography fontSize={15} variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                                    {t("sellershub.guide.Understanding_Linconstore_Marketplace")}
                                </Typography>

                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content1-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content1-2")}
                                </Typography>
                            </Stack>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Typography fontSize={15} variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                                    {t("sellershub.guide.Step_by_Step_Guide_to_Listing_Your_Products_on_Linconstore")}
                                </Typography>

                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-0")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-2")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-3")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-3-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-4")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-5")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content2-5-1")}
                                </Typography>
                            </Stack>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Typography fontSize={15} variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                                    {t("sellershub.guide.Effective_Selling_Strategies_for_Linconstore")}
                                </Typography>

                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-0-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-0-2")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-2")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-3")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-4")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content3-5")}
                                </Typography>
                            </Stack>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Typography fontSize={15} variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                                    {t("sellershub.guide.Linconstore_Shipping_Guide")}
                                </Typography>

                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content4-0")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content4-1")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content4-2")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content4-3")}
                                </Typography>
                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content4-4")}
                                </Typography>
                            </Stack>

                            <Stack spacing={2} sx={{ my: 2 }}>
                                <Typography fontSize={15} variant={isMobile ? "h6" : "h6"} color={"var(--primary)"}>
                                    {t("sellershub.guide.Maximizing_Profit_Guide")}
                                </Typography>

                                <Typography variant={"body1"} fontSize={14}>
                                    {t("sellershub.guide.content5")}
                                </Typography>
                            </Stack>
                            
                        </Container>
                    <Footer />
                </Wrapper>
            </Card>
        </>
    )
}

export default Guide