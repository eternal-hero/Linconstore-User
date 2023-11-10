import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Card, Typography, useMediaQuery } from "@mui/material";
import {
    ConnectWithoutContact
} from "@mui/icons-material";
import * as yup from "yup";
import Nav from "../Layouts/Nav";
import Wrapper from "../Wappers/Container";
import ContentHeader from "../Utils/contentHeader";
import ForumRoomCard from "./ForumRoomCard";
import {Help} from '@mui/icons-material';
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
    message: yup.string().required().min(4),
    attachment: yup
        .mixed()
        .test("fileSize", "File Size is too large", (value) => {
            if (value) {
                return value.size <= 2000000;
            } else {
                return true;
            }
        })
        .test("fileType", "Unsupported File Format", (value) => {
            if (value) {
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }
            return true;
        }),
});
type Chat = {
    message: string;
    attachment: File | null;
};

type ForumProps = {
    slug: string;
}

const ForumChat: React.FC<ForumProps> = ({ slug }) => {
    const { t } = useTranslation();

    const isMobile = useMediaQuery("(max-width: 600px)");

    const router = useRouter();

    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Forum_chat")}
                    description={"Learn what cookies we use when you visit linconstore"}
                    content={"Forum chat | linconstore"}
                >
                    <ContentHeader
                        title="Community Forum"
                        paths={slug === "sellerForum"
                            ?
                            ["help center", "community forum", "seller's forum"]
                            :
                            ["help center", "community forum", "user's forum"]
                        }
                        iconComponent={<ConnectWithoutContact sx={{ color: "var(--primary)" }} />}
                        routePath="/help-center/forum"
                    />

                    <Container component={"main"} maxWidth={"lg"} sx={{ my: 10 }}>
                        <Box 
                            sx={{ 
                                display: "flex", 
                                flexDirection: "column", 
                                mb: 3, 
                                gap: 2, 
                                // height: isMobile ? "calc(100vh - 85px)" : "calc(100vh - 48px)" ,
                                justifyContent: "center"
                            }}
                        >
                            <ForumRoomCard 
                                title="How do I process an order?"
                                createdBy="John"
                                totalResponses={0}
                            />
                            <ForumRoomCard 
                                title="How do I process an order?"
                                createdBy="John"
                                totalResponses={7}
                            />
                            <Box display={"flex"} justifyContent={"center"} pt={5}>
                                <Box
                                    maxWidth={270}
                                    justifyContent={"center"}
                                    display={"flex"} 
                                    gap={2} 
                                    boxShadow={"0 8px 16px 0 rgba(0, 0, 0, 0.2)"}
                                    px={3}
                                    py={1}
                                    borderRadius={2}
                                    sx={{
                                        cursor: "pointer"
                                    }}
                                    onClick={() => router.push('forum') }
                                >
                                    <Help color="primary" />
                                    <Typography color={"var(--primary)"}>ask your own question</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Wrapper>
            </Card>
        </>
    );
};
export default ForumChat;
