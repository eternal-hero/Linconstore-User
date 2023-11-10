import React from 'react';
import Nav from '../Layouts/Nav';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import Footer from '../Layouts/Footer';
import { Container, Grid } from '@mui/material';
import { Quiz, Toll, ConnectWithoutContact, Laptop } from '@mui/icons-material';
import HelpCenterItem from './HelpCenterItem';
import { useTranslation } from "react-i18next";

const HelpCenterPage: React.FC = () => {
    const { t } = useTranslation();

    type helpCenterItemsType = {
        title: string,
        icon: React.ReactNode,
        link: string,
    }

    const helpCenterItems: helpCenterItemsType[] = [
        {
            title: t("helpcenter.Submit_request"),
            icon: <Toll />,
            link: "/help-center/submit-request"
        },
        {
            title: t("helpcenter.Frequently_asked_questions"),
            icon: <Quiz />,
            link: "/help-center/faq"
        },
        {
            title: t("helpcenter.Knowledge_base"),
            icon: <Laptop />,
            link: "/help-center/knowledgeBase"
        },
        {
            title: t("helpcenter.Community_forum"),
            icon: <ConnectWithoutContact />,
            link: "/help-center/forum"
        }
    ]

    return (
        <>
            <Nav />
            <Wrapper
                title={t("pagetitle.Help_Center")}
                description={
                "Help Center on Linconstore"
                }
                content={"Help Center | linconstore"}
            >
                <ContentHeader 
                    title={t("helpcenter.title")}
                    helpText={t("helpcenter.helptext")}
                    search
                />

                <Container component={"main"} maxWidth={"md"} sx={{my: 10}}>
                    <Grid container spacing={3}>
                        {
                            helpCenterItems.map((item, index) => {
                                return (
                                    <Grid key={index} item sm={6} xs={12}>
                                        <HelpCenterItem title={item.title} icon={item.icon} link={item.link} />
                                    </Grid>
                                )
                            } )
                        }
                    </Grid>
                </Container>

                <Footer />
            </Wrapper>
        </>
    )
}

export default HelpCenterPage