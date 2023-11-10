import { Box, Button, Modal, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from "react-i18next";

const Permission = () => {

    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const router = useRouter();
    return (
        <Modal
            open={true}
        >
            <Box
                sx={{
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    top: "100",
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
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isMobile ? '95vw' : 600,
                    bgcolor: "background.paper",
                    borderRadius: "20px",
                    boxShadow: 24,
                    textAlign: "center",
                    p: 3,
                }}
            >
                <Stack direction={"row"} justifyContent={"center"} gap={5} alignItems={'center'}>
                    <Image
                        width={350}
                        height={350}
                        style={{ marginTop: 30, width: "100%", height: "100%" }}
                        placeholder="blur"
                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                        src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/xrxov4oxwotmjn9bn0wd"}
                        alt={"image of Happy"}
                    />
                    <Stack gap={5}>
                        <Typography fontSize={14}>
                            {t("permission.NotFound")}
                        </Typography>
                        <Button onClick={() => router.push('/')}>
                            {t("permission.Go_Back")}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
            </Box>
        </Modal>
    )
}

export default Permission