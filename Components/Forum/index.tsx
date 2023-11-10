import React, { useEffect, useState } from 'react';
import Nav from '../Layouts/Nav';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';

import { ConnectWithoutContact } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import ForumCard from './ForumCard';
import Footer from '../Layouts/Footer';
import ForumChat from './ForumChat';
import { useTranslation } from "react-i18next";

const Forum: React.FC = () => {
    const { t } = useTranslation();

    enum ForumChatType {
        sellerForum = `sellerForum`,
        userForum = `userForum`,
    }

    return (
        <>
            <Nav />
            <Wrapper
                title={t("pagetitle.forum")}
                description={
                "forum on Linconstore"
                }
                content={"forum | linconstore"}
            >
                <ContentHeader 
                    title={t("helpcenter.Community_forum")}
                    paths={[t("helpcenter.title"), t("helpcenter.Community_forum")]}
                    iconComponent={<ConnectWithoutContact sx={{color: "var(--primary)"}} />}
                    routePath='/help-center'
                />

                <Container component={"main"} maxWidth={"lg"} sx={{my: 10}}>
                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        <ForumCard 
                            type={ForumChatType.sellerForum}
                            users='21+ users'
                            chatAmount='10k'
                        />
                        <ForumCard 
                            type={ForumChatType.userForum}
                            users='+211 users'
                            chatAmount='10k'
                        />
                    </Box>
                </Container>

                <Footer />
            </Wrapper>
        </>
    )
}

export default Forum