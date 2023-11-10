import { Close } from '@mui/icons-material';
import { Box, Button, Modal, Stack, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from "react-i18next";

const NoClosePage = () => {
    const { t } = useTranslation();
    const isMobile: boolean = useMediaQuery("(max-width : 600px)");
    const isMatches: boolean = useMediaQuery("(max-width : 420px)");

    const router = useRouter();
    
    return (
        <Modal
          open={true}
          sx={{
            bottom: isMobile ? 50 : 0,
          }}
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMatches ? "95vw" : 500,
              bgcolor: "background.paper",
              borderRadius: "20px",
              boxShadow: 24,
              pb: 4,
            }}
          >
            <Box
              borderBottom="1px solid #c3c3c3"
              px={4}
              pt={4}
              pb={3}
              display="flex"
              alignItems="center"
              justifyContent="end"
            >
                <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => router.back()}
                >
                    <Close />
                </Box>
            </Box>
            <Stack gap={3} px={15} py={5} textAlign={"center"}>
                <Typography fontSize={14}>
                    {t("permission.Close1")}
                </Typography>
                <Typography fontSize={14}>
                    {t("permission.Close2")}
                </Typography>
                <Button variant='contained' sx={{borderRadius: "10px"}} onClick={() => router.push('/help-center/submit-request')}>
                    {t("permission.Contact_Support")}
                </Button>
            </Stack>
          </Box>
        </Modal>
    )
}

export default NoClosePage