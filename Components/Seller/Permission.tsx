import { Box, Button, Modal, Stack, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from "react-i18next";

const Permission = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const router = useRouter();
    const { t } = useTranslation();
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
                        src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/mkhpt7nwbzvxy31mm93a"}
                        alt={"image of Happy"}
                    />
                    <Stack gap={5}>
                        <Typography fontSize={14}>
                            {t("permission.SellerPermission")}
                        </Typography>
                        <Button sx={{textTransform: "capitalize" }} onClick={() => router.push("/help-center/submit-request")}>
                            {t("permission.Contact_Support")}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
            </Box>
        </Modal>
    )
}

export default Permission