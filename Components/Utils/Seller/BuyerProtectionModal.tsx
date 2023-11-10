import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openCloseBuyerProtectionModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";

import Box from "@mui/material/Box";
import {
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { auto } from "@popperjs/core";
import { RootState } from "../../../Store/Index";
import { useTranslation } from "react-i18next";

const BuyerProtectionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90vw" : "400px",
    // border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    bgcolor: "rgba(255,255,255,1)",
    color: "#363232",
    flexDirection: "column",
    alignItems: "center",
    height: auto,
    overflow: "auto",
    borderRadius: 5,
    px: 3,
    py: 3,
  };

  const open: boolean = useSelector(
    (state: RootState) => state.modal.buyerProtectionModal
  );
  const handleClose = () => dispatch(openCloseBuyerProtectionModal(false));
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Container maxWidth={"md"} component={"main"}>
        <Box sx={style}>
          <Box display={"flex"} flexDirection={"column"} gap={2} my={2} width={"100%"}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
              <Typography variant={"subtitle1"}>
                {t("buyerProtection.title")}
              </Typography>
              <IconButton onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography>
            {t("buyerProtection.description")}
          </Typography>
        </Box>
      </Container>
    </Modal>
  );
}

export default BuyerProtectionModal