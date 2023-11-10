import React from 'react';
import Nav from '../Layouts/Nav';
import { Card, Container, Stack, Typography } from '@mui/material';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import { Store } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Footer from '../Layouts/Footer';

const Promoting = () => {
    
    const { t } = useTranslation();
    
    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Promoting_Store")}
                    description={
                        "Learn about Promoting Store when you purchase an item on Linconstore"
                    }
                    content={"Promoting Store | linconstore"}
                >
                    <ContentHeader 
                        title={t("sellershub.promoting.Promoting_Store")}
                        paths={[t("about.ArrowBackTitle"), t("sellershub.Sellers_Hub"), t("sellershub.promoting.Promoting_Store")]}
                        iconComponent={<Store sx={{color: "var(--primary)"}} />}
                        routePath="/seller-hub"
                    />
                        <Container component={"main"} maxWidth={"md"} sx={{py: 5, display: "flex", flexDirection: "column", gap: 2}}>
                            <Typography>
                                {t("sellershub.promoting.content1")}
                            </Typography>
                            <Typography>
                                {t("sellershub.promoting.content2")}
                            </Typography>
                            <Typography>
                                {t("sellershub.promoting.content3")}
                            </Typography>
                            <Typography>
                                {t("sellershub.promoting.content4")}
                            </Typography>
                            <Typography>
                                {t("sellershub.promoting.content5")}
                            </Typography>
                            <Typography>
                                {t("sellershub.promoting.content6")}
                            </Typography>
                        </Container>
                    <Footer />
                </Wrapper>
            </Card>
        </>
    )
}

export default Promoting