import { Box, Button, Typography, Modal, Stack, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { useRouter } from "next/router";

type ForumCardType = {
    type: string,
    users: string,
    chatAmount: string,
}

const ForumCard: React.FC<ForumCardType> = ({type, users, chatAmount}) => {

    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery("(max-width: 600px)");
    const forumName = {
        sellerForum: "Seller's Forum",
        userForum: "Users Forum",
    }
    return (
        <Box sx={{
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            px: 3,
            py: 2,
        }}>
            <Box display={"flex"} flexDirection={"column"} gap={3}>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                    <Box display={"flex"} flexDirection={"column"} >
                        <Typography fontWeight={700} fontSize={18}>
                            {forumName[type]}
                        </Typography>
                        <Typography>
                            {users}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography>Chat monitored</Typography>
                    </Box>
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box display={'flex'} gap={5}>
                        <Typography>{chatAmount} chat</Typography>
                        <Typography>Helpful information</Typography>
                    </Box>
                    <Box>
                        <Button variant='outlined' onClick={() => setOpen(true)}>
                            Join chat
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                bottom: 0,
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        display: "flex",
                        justifyContent: "center",
                        top: isMobile && "100px",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        zIndex: "1000",
                        overflowY: "auto",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute" as "absolute",
                            top: !isMobile && "50%",
                            left: "50%",
                            transform: !isMobile ? "translate(-50%, -50%)" : "translate(-50%, 0%)",
                            width: !isMobile ? 850 : "100%",
                            bgcolor: "background.paper",
                            borderRadius: "10px",
                            boxShadow: 24,
                            p:  3,
                            pb: isMobile && "180px"
                        }}
                    >
                        <Stack spacing={1} sx={{ my: 1, }}>
                            <Typography variant={"h6"}>
                                Forum Guideline
                            </Typography>

                            <Typography variant={"body1"}>
                                By using our platform, you agree to abide by these principles and guidelines 
                                set forth to foster a positive and secure online community atmosphere.
                            </Typography>

                            <Typography variant={"body1"}>
                                1. Respect the opinions and experiences of others in the community by 
                                engaging in constructive and empathetic conversations.
                            </Typography>

                            <Typography variant={"body1"}>
                                2. Contribute to a safe and respectful environment by refraining from 
                                engaging in any form of harassment, discrimination, or hate speech.
                            </Typography>

                            <Typography variant={"body1"}>
                                3. Avoid engaging in fraudulent activities or deceptive practices 
                                that may harm other community members.
                            </Typography>

                            <Typography variant={"body1"}>
                                4. Do not engage in any illegal activities or promote the sale of illegal goods.
                            </Typography>

                            <Typography variant={"body1"}>
                                5. Do not share personal information or engage in any activities 
                                that compromise the privacy and security of other community members.
                            </Typography>

                            <Typography variant={"body1"}>
                                6. Ensure that all transactions and interactions are conducted transparently 
                                and honestly, with accurate descriptions and representations of products or services.
                            </Typography>

                            <Typography variant={"body1"}>
                                7. Ensure that all interactions with other community members, whether 
                                buyers or sellers are conducted professionally and courteously.
                            </Typography>

                            <Typography variant={"body1"}>
                                8. Be mindful of the intellectual property rights of others and refrain 
                                from plagiarizing or infringing upon copyrighted material.
                            </Typography>

                            <Box display={"flex"} gap={2} justifyContent={"end"}>
                                <Button sx={{textTransform: "capitalize"}} color='error' onClick={() => setOpen(false)} >Cancel</Button>
                                <Button variant='contained' sx={{textTransform: "capitalize"}} onClick={() => router.push(`/help-center/forum/${type}`)}>Agree</Button>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default ForumCard