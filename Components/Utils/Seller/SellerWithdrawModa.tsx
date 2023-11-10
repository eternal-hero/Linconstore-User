import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { openCloseSellerWithdrawModal } from "../../../Store/Modal";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import Router, { useRouter } from "next/router";
import Box from "@mui/material/Box";
import {
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Label } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { auto } from "@popperjs/core";
import { useTranslation } from "react-i18next";
import {
  useBillingPayment,
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
import { countryCurrency } from "../../../Helpers/Exchange";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  minWidth: "320px",
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
  py: 1,
};
type TLink = {
  url: string;
};

type SellerWithdrawModalPropsType = {
  totalBill: any;
  currency: string;
  sellerAccId: string;
  paypal: string;
  sellerId: string;
  storeId: string;
}

const SellerWithdrawModal: React.FC<SellerWithdrawModalPropsType> = ({ totalBill, currency, sellerAccId, paypal, sellerId, storeId }) => {
  const dispatch = useDispatch();

  const [value, setValue] = React.useState("stripe");
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [payPalEmail, setPayPalEmail] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState<string>("£");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    if (currency === "£") {
      setCurrentCurrency("gbp");
    } else {
      const currentCurrency1 = countryCurrency.find((c) => {
        return c.symbol.toLowerCase() === currency.toLowerCase();
      });
      setCurrentCurrency(currentCurrency1?.currency);
    }
  }, [currency, countryCurrency]);
  
  const open: boolean = useSelector(
    (state: RootState) => state.modal.sellerWithdrawModal
  );
  const handleClose = () => {
    dispatch(openCloseSellerWithdrawModal(false));
    setInputValue("");

  }
  const { t } = useTranslation();

  const onSellerLinkSuccess = (data: TLink) => {
    window.open(data.url, "_blank", "noopener,noreferrer");
    handleClose();
  };
  const { refetch: refetchSellerLink, isLoading: isGetting } =
    useGetSellerLink(onSellerLinkSuccess);

  const onSellerSuccess = (data: Tseller) => {
    if (data.paypal) {
      setPayPalEmail(data.paypal)
      setIsConnect(true);
      return
    }
    if (data?.accId) {
      setIsConnect(true);
    } else {
      setIsConnect(false);
    }
  };

  const router = useRouter();

  const { refetch: sellerRefetch, isError } = useGetSellerInfo(onSellerSuccess);
  useTokenRefetch(sellerRefetch);

  const onRemoveSuccess = () => {
    // sellerRefetch();
  };
  const { mutate, isLoading: isRemoving } =
    useRemoveSellerOnboard(onRemoveSuccess);

  const handleSellerLink = () => {

    refetchSellerLink();
  };
  const onSuccess = (data: TLink) => {
    window.open(data.url, "_blank");
    handleClose();
  };
  const { refetch, isLoading } = useSellerOnboard(onSuccess);

  const handleDelete = () => {
    mutate();
  };
  const handleRefetch = () => {
    refetch();
  };
  const [inputValue, setInputValue] = useState("");
  const onChange = (e) => {
    const inputValue1 = e.target.value.replace(/\D/g, ""); // Define inputValue here

    setInputValue(inputValue1);
    if (Number(inputValue1) < parseFloat(totalBill.replace(",", ""))) {
      setIsBillingErrMsg(false);
    } else {
      setBillingErrMsg("You should charge less than " + currency + " " + parseFloat(totalBill.replace(",", "")));
      setIsBillingErrMsg(true);
    }
  }

  const [billingErrorMsg, setBillingErrMsg] = useState<string>("");
  const [isBillingErrMsg, setIsBillingErrMsg] = useState<boolean>(false);

  const handleAvailablePayout = (amount) => {
    const totalBillingAmount: number = parseFloat(totalBill.replace(",", ""));
    if (amount > totalBillingAmount ) {
      setBillingErrMsg("You should charge less than " + currency + " " + totalBillingAmount);
      setIsBillingErrMsg(true);
      return
    }

    const billingData = {
      amount: amount,
      currency: currentCurrency,
      destination: sellerAccId,
      paypal: paypal,
      sellerId: sellerId,
      storeId: storeId
    }

    billingPayment(billingData);
  }
  const billingPaymentSuccess = (data: any) => {
    handleClose();
    router.reload();
  };
  const { isLoading: isPaying, mutate: billingPayment } = useBillingPayment(billingPaymentSuccess);

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
                {t("seller.available_payout.Available_Payout")}
              </Typography>
              <IconButton onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography color={"primary"} textAlign={"start"}>
              {currency} {totalBill}
            </Typography>

            {payPalEmail ?
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography>{t("seller.available_payout.Paypal_Account")}</Typography>
                <Typography fontSize={12} sx={{ textDecoration: "underline" }}>{payPalEmail}</Typography>
              </Box>
              : isConnect &&
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography>{t("seller.available_payout.Bank_Account")}</Typography>
                <Typography fontSize={12} onClick={handleSellerLink} sx={{ textDecoration: "underline" }}>{t("seller.available_payout.view_connected_account")}</Typography>
              </Box>
            }

            <Box display={"flex"} gap={1} alignItems={"center"}>
              <Typography fontSize={12}>{t("seller.available_payout.Enter_amount_between")}</Typography>
              <Typography fontSize={12} color={"primary"}>{currency} 4 - {currency} {totalBill}</Typography>
            </Box>

            <TextField
              size="small"
              type="text"
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ "& p": { color: "var(--primary)" } }}>{currency}</InputAdornment>,
                inputProps: { min: 4, max: Number(totalBill), pattern: "d*" },

              }}
              sx={{
                width: "50%",
                borderRadius: 1,
              }}
              value={inputValue}
              onChange={onChange}
            />
            {isBillingErrMsg && <Typography style={{ fontSize: "12px", color: "red" }}>
              {billingErrorMsg}
            </Typography>
            }

            <Box display={"flex"} justifyContent={"space-between"}>
              <Button sx={{ textTransform: "none", borderRadius: "20px", color: "gray", borderColor: "gray" }} variant="outlined" onClick={handleClose}>{t("seller.available_payout.Cancel")}</Button>
              <Button sx={{ textTransform: "none", borderRadius: "20px" }} variant="contained" onClick={() => handleAvailablePayout(inputValue)} >{t("seller.available_payout.Withdraw")}</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}

export default SellerWithdrawModal
