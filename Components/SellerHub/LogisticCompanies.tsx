import React from 'react';
import Nav from '../Layouts/Nav';
import { Card, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import { Store } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Footer from '../Layouts/Footer';

const LogisticCompanies = () => {
    
    const { t } = useTranslation();
    
    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Logistic_companies")}
                    description={
                        "Learn about Logistic companies by region when you purchase an item on Linconstore"
                    }
                    content={"Logistic companies by region | linconstore"}
                >
                    <ContentHeader 
                        title="Logistic companies by region"
                        paths={[t("about.ArrowBackTitle"), "Seller's Hub", "Logistic companies by region"]}
                        iconComponent={<Store sx={{color: "var(--primary)"}} />}
                        routePath="/seller-hub"
                    />
                        <Container component={"main"} maxWidth={"md"} sx={{py: 5}}>
                            <Typography>Coming Soon</Typography>
                        </Container>
                    <Footer />
                </Wrapper>
            </Card>
        </>
    )
}

export default LogisticCompanies