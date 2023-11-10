import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openClosePaypalModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";

import Box from "@mui/material/Box";
import {
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { auto } from "@popperjs/core";
import { useTranslation } from "react-i18next";
import {
  useGetSellerInfo,
  useGetSellerLink,
  useRemoveSellerOnboard,
  useSellerOnboard,
} from "../../../hooks/useDataFetch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useCallback, useState } from "react";
import { Tseller } from "../../../Helpers/Types";
import { useTokenRefetch } from "../../../hooks/useRefresh";
import { RootState } from "../../../Store/Index";

interface modal {
  modal: {
    sellerPayoutModal: boolean;
  };
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
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
  py: 2,
};
const PaypalModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const open: boolean = useSelector(
    (state: RootState) => state.modal.paypalModal
  );
  const handleClose = () => dispatch(openClosePaypalModal(false));
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"md"} component={"main"}>
        <Box sx={style}>
          <Box width={"100%"}>
            <Stack direction={"row"} spacing={2} sx={{ display: "flex", my: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant={"subtitle1"} sx={{ mt: 0.7 }}>
                  {t("seller.payout_method.Paypal")}
                </Typography>
              </Box>
              <Box sx={{ alignSelf: "flex-end" }}>
                <IconButton onClick={handleClose} aria-label="Close">
                    <CloseIcon />
                </IconButton>
              </Box>
            </Stack>

            <Box display={"flex"} flexDirection={"column"} gap={1}>
              <Typography>
                {t("seller.payout_method.Enter_your_paypal_email")}
              </Typography>
              
              <TextField 
                size="small"
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  "& fieldset": {
                    border: "none"
                  }
                }}
              />
            </Box>

            <Box display={"flex"} justifyContent={"space-between"} mt={5}>
              <Button sx={{textTransform: "none", borderRadius: "20px", color: "gray", borderColor: "gray"}} variant="outlined" onClick={handleClose}>{t("seller.payout_method.Cancel")}</Button>
              <Button sx={{textTransform: "none", borderRadius: "20px"}} variant="contained" onClick={() => openClosePaypalModal(false)}>{t("seller.payout_method.Save")}</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}

export default PaypalModal
