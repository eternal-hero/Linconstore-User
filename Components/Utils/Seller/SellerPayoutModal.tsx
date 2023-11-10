import React, { useEffect, useState, useContext } from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeSellerPayoutModal, closeTermModal, openClosePaypalModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
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
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { auto } from "@popperjs/core";
import { useTranslation } from "react-i18next";
import {
  useCheckSellerPayout,
  useGetSellerLink,
  useRemoveSellerOnboard,
  useSellerOnboard,
  useGetSellerInfo,
  useSavePaypalAccount,
  useRemovePaypalAccount,
} from "../../../hooks/useDataFetch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Tseller } from "../../../Helpers/Types";
import { useTokenRefetch } from "../../../hooks/useRefresh";

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
  width: "auto",
  minWidth: "300px",
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
  p: 1,
};
type TLink = {
  url: string;
};
export default function SellerPayoutModal() {
  const dispatch = useDispatch();

  const [value, setValue] = useState("bank");
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [isCountry, setIsCountry] = useState<boolean>(false);
  const [viewPaypal, setViewPaypal] = useState<boolean>(false);
  const [isPaypal, setIsPaypal] = useState<boolean>(false);
  const [payPalEmail, setPayPalEmail] = useState("");
  const router = useRouter();
  const [openPaypalModal, setOpenPaypalModal] = useState<boolean>(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const { t } = useTranslation();
  const countryList: string[] = [
    "australia",
    "canada",
    "mexico",
    "newZealand",
    "unitedStates",
  ];

  const onGetSellerSuccess = (data: any) => {
    if(data != null) {
      if (data.isVerified) {
        if(data.paypal || data.accId) {
          if (data.paypal) {
            setPayPalEmail(data.paypal)
            setValue("paypal")
            setIsCountry(true)
            setIsConnect(true);
            setViewPaypal(false)
            setIsPaypal(false)
            return
          }
          if (data.accId) {
            setValue("bank")
            setIsCountry(false)
            setViewPaypal(true)
            setIsPaypal(true)
            refetchSellerCheck()
            return
          }
        } else {
          if (data.location && countryList.includes(data.location)) {
            setValue("paypal")
            setIsCountry(true)
            return
          } else {
            setValue("bank")
            setIsCountry(false)
          }
        }
        
        
      }
    }
    
  };
  const { refetch: refresh } = useGetSellerInfo(onGetSellerSuccess);
  useTokenRefetch(refresh);

  const open: boolean = useSelector(
    (state: modal) => state.modal.sellerPayoutModal
  );
  const handleClose = () => {
    dispatch(closeSellerPayoutModal(false));
    setOpenPaypalModal(false)
    setViewPaypal(false)
  };

  const onSellerLinkSuccess = (data: TLink) => {
    window.open(data.url, "_blank", "noopener,noreferrer");
    handleClose();
  };

  const onSellerCheckSuccess = (data: any) => {
    if (data.checked) {
      setIsConnect(true);
    } else {
      setIsConnect(false);
    }
  };

  const { refetch: refetchSellerLink, isLoading: isGetting } = useGetSellerLink(onSellerLinkSuccess);
  const { refetch: refetchSellerCheck, isLoading: isChecking } = useCheckSellerPayout(onSellerCheckSuccess);

  const onSellerSuccess = (data: Tseller) => {
    if (data?.accId) {
      setIsConnect(true);
    } else {
      setIsConnect(false);
    }
  };

  const onRemoveSuccess = () => {
    // sellerRefetch();
  };
  const { mutate, isLoading: isRemoving } = useRemoveSellerOnboard(onRemoveSuccess);

  const handleSellerLink = () => {
    if (value === "paypal") {
      setOpenPaypalModal(true)
      setViewPaypal(true)
    } else {
      refetchSellerLink();
    }
  };
  const onSuccess = (data: TLink) => {
    window.open(data.url, "_blank");
    handleClose();
  };
  const { refetch, isLoading } = useSellerOnboard(onSuccess);


  const handleRefetch = () => {
    if (value === "paypal") {
      setOpenPaypalModal(true)
      // dispatch(openClosePaypalModal(true))
      // dispatch(closeSellerPayoutModal(false))
      return
    }
    refetch();
  };

  const handelAddPaypal = () => {
    if (payPalEmail) {
      mutateAddPaypal({ paypal: payPalEmail })
    }
  };

  const onSavePaypalSuccess = () => {
    handleClose()
  };

  const onRemovePaypalSuccess = () => {
    handleClose()
  };

  const { mutate: mutateAddPaypal, isLoading: isPaypalAdding } = useSavePaypalAccount(onSavePaypalSuccess);
  const { mutate: mutateRemovePaypal, isLoading: isPaypalRemoving } = useRemovePaypalAccount(onRemovePaypalSuccess);

  const handleDelete = () => {
    if (value === "paypal") {
      mutateRemovePaypal()
    } else {
      mutate();
    }
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"md"} component={"main"} sx={{ width: "90%" }}>
        <Box sx={style}>
          {
            !openPaypalModal ? (
              <Box>
                <Stack direction={"row"} spacing={2} sx={{ display: "flex", mt: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box />
                    <Typography variant={"subtitle1"} sx={{ mt: 0.7 }}>
                      {isConnect ? t("seller.payout_method.Edit") : t("seller.payout_method.Add")} {t("seller.payout_method.Payout_Method")}
                    </Typography>
                  </Box>
                  <Box />
                  <Box sx={{ alignSelf: "flex-end" }}>
                    <IconButton onClick={handleClose} aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
                <FormControl>
                  {/*<FormLabel id="demo-controlled-radio-buttons-group">Select</FormLabel>*/}
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      disabled={true}
                      value="stripe"
                      control={<Radio />}
                      label={t("seller.payout_method.Store_Prepaid_Card")}
                    />
                    <FormControlLabel
                      disabled={isCountry}
                      value="bank"
                      control={<Radio />}
                      label={t("seller.payout_method.Bank_account")}
                    />
                    <FormControlLabel
                      disabled={isPaypal}
                      value="paypal"
                      control={<Radio />}
                      label={t("seller.payout_method.Paypal")}
                    />
                  </RadioGroup>
                </FormControl>
                <Box
                  sx={{
                    my: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: "25px", textTransform: "unset" }}
                    disabled={!isConnect || isRemoving || isChecking}
                    color="error"
                    onClick={() => handleDelete()}
                  >
                    {isRemoving && <CircularProgress />} {t("seller.payout_method.Remove")}
                  </Button>
                  <Box sx={{ mx: 4 }} />

                  {!isConnect && (
                    <Button
                      variant="contained"
                      sx={{ borderRadius: "25px", textTransform: "unset" }}
                      disabled={isLoading || isChecking}
                      color="success"
                      onClick={() => handleRefetch()}
                    >
                      {isLoading && <CircularProgress />} {t("seller.payout_method.Connect")}
                    </Button>
                  )}
                  {isConnect && (
                    <Button
                      variant="contained"
                      sx={{ borderRadius: "25px" }}
                      disabled={isGetting || isChecking}
                      color="success"
                      onClick={() => handleSellerLink()}
                    >
                      {isGetting && <CircularProgress />} {t("seller.payout_method.View")}
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <Box>
                <Stack direction={"row"} spacing={2} sx={{ display: "flex", mt: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box />
                    <Typography variant={"subtitle1"} sx={{ mt: 0.7 }}>
                      {t("seller.payout_method.Paypal")}
                    </Typography>
                  </Box>
                  <Box />
                  <Box sx={{ alignSelf: "flex-end" }}>
                    <IconButton onClick={() => handleClose()} aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
                {viewPaypal ?
                  <Box sx={{ mt: "16px" }} display={"flex"} flexDirection={"column"} gap={1}>
                    <Typography>
                      {payPalEmail}
                    </Typography>
                  </Box>
                  :
                  <Box sx={{ mt: "16px" }} display={"flex"} flexDirection={"column"} gap={1}>
                    <Typography>
                      {t("seller.payout_method.Enter_your_paypal_email")}
                    </Typography>

                    <TextField
                      size="small"
                      type={"email"}
                      sx={{
                        borderRadius: 1
                      }}
                      onChange={(e) => setPayPalEmail(e.target.value)}
                      value={payPalEmail}
                    />
                  </Box>
                }
                <Box display={"flex"} justifyContent={"space-between"} mt={5}>
                  <Button sx={{ textTransform: "none", borderRadius: "20px", color: "gray", borderColor: "gray" }} variant="outlined" onClick={handleClose}>{t("seller.payout_method.Cancel")}</Button>
                  {!viewPaypal && <Button sx={{ textTransform: "none", borderRadius: "20px" }} variant="contained" onClick={() => handelAddPaypal()}>{t("seller.payout_method.Save")}</Button>}
                </Box>
              </Box>
            )
          }
        </Box>
      </Container>
    </Modal>
  );
}
