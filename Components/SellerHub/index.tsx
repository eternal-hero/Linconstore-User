import React from 'react';
import Nav from '../Layouts/Nav';
import { Box, Card, Container, Link as MUILink, Typography } from '@mui/material';
import Link from "next/link";
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import { useTranslation } from 'react-i18next';
import { Store, PlayArrow } from '@mui/icons-material';
import Footer from '../Layouts/Footer';

const SellerHub = () => {

    const { t } = useTranslation();

    const sellerHubs = [
        {
            title: t("sellershub.Selling_Guides"),
            link: "/seller-hub/guide",
        },
        {
            title: t("sellershub.Promoting_Store"),
            link: "/seller-hub/promoting",
        },
        {
            title: t("sellershub.Logistic_companies_by_region"),
            link: "/seller-hub/logistic-companies-by-region",
        }
    ]

    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Seller_Hub")}
                    description={
                        "Learn about Seller's Hub when you purchase an item on Linconstore"
                    }
                    content={"Seller's Hub | linconstore"}
                >
                    <ContentHeader 
                        title={t("sellershub.Sellers_Hub")}
                        paths={[t("about.ArrowBackTitle"), t("sellershub.Sellers_Hub")]}
                        iconComponent={<Store sx={{color: "var(--primary)"}} />}
                        routePath="/"
                    />
                        <Container component={"main"} maxWidth={"md"} sx={{py: 5}}>
                            {
                                sellerHubs.map((hub, index) => {
                                    return (
                                        <Link href={hub.link}>
                                            <MUILink 
                                                key={index} 
                                                px={3} 
                                                py={2} 
                                                my={2} 
                                                display={"flex"} 
                                                justifyContent={"space-between"}
                                                boxShadow={"0 2px 12px 0 rgba(0,0,0,0.4)"}
                                                sx={{textDecoration: "none", color: "black"}}
                                                href={hub.link}
                                            >
                                                <Typography fontSize={14}>{hub.title}</Typography>
                                                <PlayArrow sx={{color: "var(--primary)"}} />
                                            </MUILink>
                                        </Link>
                                    )
                                })
                            }
                        </Container>

                    <Footer />
                </Wrapper>
            </Card>
        </>
    )
}

export default SellerHub