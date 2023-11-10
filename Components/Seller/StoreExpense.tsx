/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useContext, useEffect, useState } from "react";
import Head from "next/head";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Card,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import Container from "@mui/material/Container";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { AccountBalanceWallet, ArrowBack, Payments } from "@mui/icons-material";
import ContextApi from "../../Store/context/ContextApi";
import { numberWithCommas } from "../../Helpers/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import CardManagement from "./CardManagement";
import { useDispatch, useSelector } from "react-redux";
import Transfer from "./Transfer";
import Billing from "./Billing";
import Button from "@mui/material/Button";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  useStoreExpenseOrders,
  useGetSellerDeliveredOrders,
  useGetSellerFunds,
  useGetSellerInfo,
  useGetSellerRequestMessage,
  useGetStore,
  useGetStoreActivity,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import {
  IAdminProducts,
  ISellerRequestMes,
  addAddress,
} from "../../Helpers/Types";
import {
  openCloseSellerWithdrawModal,
  openSellerPayoutModal,
} from "../../Store/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { reCreateDate } from "../../Helpers/getDate";
import SellerWithdrawModal from "../Utils/Seller/SellerWithdrawModa";
import PaypalModal from "../Utils/Seller/PaypalModal";
import { useGetSellerLink, useRemoveSellerOnboard, useRemovePaypalAccount } from "../../hooks/useDataFetch";
//
interface modal {
  modal: {
    sellerPayoutModal: boolean;
  };
}
type TSeller = {
  isActive: boolean;
  isVerified: boolean;
  isPausedPayout: boolean;
  accId: string;
  paypal: string;
  _id: string;
  storeId: string;
  owner: string;
};
type TProduct = {
  photo: string[];
  title: string;
};
type IStore = {
  bill: number;
  type: string;
  name: string;
  createdAt: Date;
  productId: TProduct;
};
interface IActivity {
  totalBill: number;
  activity: IStore[];
}
export interface Idata {
  icon: any;
  title: string;
}
type TStore = {
  currency: string;
};
type TLink = {
  url: string;
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type stepper = {
  stepper: {
    step: number;
  };
};
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
  height: "auto",
  overflow: "auto",
  borderRadius: 5,
  p: 1,
};
interface IOrders {
  productId: IAdminProducts;
  _id: string;
  status: string;
  active: boolean;
  address: string;
  type: string;
  shipping: string;
  shippingProvider: string;
  trackingId: string;
  quantity: number;
  createdAt: Date;
}
interface INewOrders {
  order: IOrders;
  address: addAddress;
}
const StoreExpense: React.FC = () => {
  const config = useContext(ContextApi);
  const stepper = useSelector((state: stepper) => state.stepper.step);
  const { t } = useTranslation();
  const [seller, setSeller] = useState<TSeller>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sellerFunds, setFunds] = useState(null);
  const onSuccess = (data: TSeller) => {
    if (data.isVerified) {
      setSeller(data);
    } else {
      router.push("/seller/permission");
    }
  };

  const data: Idata[] = [
    {
      icon: <FontAwesomeIcon fontSize={"large"} icon={faMoneyBillTransfer} />,
      title: "Transfer",
    },
  ];

  useEffect(() => {
    setIsPaypal(isPaypal1);
    setIsBank(isBank1);
    if (!seller?.isActive) {
      refreshRequest();
    }
  }, [seller]);

  const [message, setMessage] = useState<string>("");
  const onSellerRequestSuccess = (data: ISellerRequestMes) => {
    setMessage(data.message);
  };
  const { isSuccess, refetch: refreshRequest } = useGetSellerRequestMessage(
    onSellerRequestSuccess
  );
  const {
    isLoading,
    isFetched,
    refetch: refresh,
    isError,
  } = useGetSellerInfo(onSuccess);

  useEffect(() => {
    if (isError) {
      return;
    }
  }, [isError]);
  useTokenRefetch(refresh);
  // const [currency, setCurrency] = useState<string>('');
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const [isShow, setIsShow] = useState<boolean>(false);
  const onStoreSuccess = (data: TStore) => {
    // setCurrency(data.currency)
  };
  const dispatch = useDispatch();
  const router = useRouter();
  useGetStore(onStoreSuccess);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [activities, setActivities] = useState<IStore[]>([]);
  const onActivitySuccess = (data: IActivity) => {
    setTotalBill(data.totalBill);
    setActivities(data.activity);
  };
  const { isLoading: isFetching, refetch: activityRefetch } =
    useGetStoreActivity(onActivitySuccess);

  useTokenRefetch(activityRefetch);

  const onOrderDeliveredSuccess = (data: any) => {
    setIsShow(data.isShow);
  };

  const { refetch: refetchOrders } = useGetSellerDeliveredOrders(
    onOrderDeliveredSuccess
  );

  useTokenRefetch(refetchOrders);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const onOrderLoadSuccess = (orderData: any[] | string) => {
    if (orderData !== "No Orders") {
      // @ts-ignore
      setTransactions(orderData);
    }
  };
  const {
    data: orderData,
    isLoading: orderIsLoading,
    isFetched: orderLoadIsFetch,
    refetch: orderRetch,
  } = useStoreExpenseOrders(onOrderLoadSuccess);

  const onSellerFundsSuccess = (data) => {
    setFunds(data);
  };

  const {
    data: sellerFund,
    isLoading: sellerFundsLoading,
    refetch: sellerFundsRefetch,
  } = useGetSellerFunds(onSellerFundsSuccess);

  useTokenRefetch(orderRetch);
  useTokenRefetch(sellerFundsRefetch);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [viewPaypal, setViewPaypal] = useState<boolean>(false);
  const [openPaypalModal, setOpenPaypalModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpenPaypalModal(false)
    setViewPaypal(false);
    setOpen(false);
  };



  const onSellerLinkSuccess = (data: TLink) => {
    window.open(data.url, "_blank", "noopener,noreferrer");
  };
  const { refetch: refetchSellerLink, isLoading: isGetting } = useGetSellerLink(onSellerLinkSuccess);

  const handleSellerLink = (value) => {
    if (value == "paypal") {
      setViewPaypal(true);
      setOpenPaypalModal(true);
      setOpen(true);
    } else {
      refetchSellerLink();
    }
  };

  const onRemoveSuccess = () => {
    // sellerRefetch();
  };
  const { mutate, isLoading: isRemoving } = useRemoveSellerOnboard(onRemoveSuccess);

  const onRemovePaypalSuccess = () => {
    console.log("success");
  };
  const isPaypal1: boolean = seller?.paypal ? true : false;
  const isBank1: boolean = seller?.accId ? true : false;

  const [isPaypal, setIsPaypal] = useState<boolean>(isPaypal1);
  const [isBank, setIsBank] = useState<boolean>(isBank1);

  const { mutate: mutateRemovePaypal, isLoading: isPaypalRemoving } = useRemovePaypalAccount(onRemovePaypalSuccess);
  const handleDelete = (value) => {
    if (value === "paypal") {
      setIsPaypal(false);
      mutateRemovePaypal()

    } else {
      setIsBank(false);
      mutate();
    }
  };

  return (
    <>
      <Head>
        <title>{t("pagetitle.StoreExpense")}</title>
        <meta
          name={"Store Expenses"}
          content={"Here you can find details about the expenses of your store"}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      {currency && <div>
        {stepper === 1 && (
          // <CssBaseline/>
          <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isMobile && (
                <ArrowBack onClick={() => router.back()} className={"pointer"} />
              )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {isLoading ||
                sellerFundsLoading ||
                (orderIsLoading && (
                  <Typography textAlign={"center"}>
                    <CircularProgress />
                  </Typography>
                ))}
              {isFetched && !seller?.isActive && isSuccess && (
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  sx={{
                    background: "#a6a3a3",
                    p: 1,
                    display: "flex",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    flexGrow={1}
                    gutterBottom
                    variant="body1"
                    component="div"
                  >
                    {message}
                  </Typography>
                  <Button
                    variant={"contained"}
                    onClick={() => router.push("/seller/additional_verification")}
                    sx={{ minWidth: 180, maxHeight: 50 }}
                    color={"success"}
                  >
                    {t("seller.store_expense.btn_upload")}
                  </Button>
                </Stack>
              )}

              <Box my={2}>
                {!isMobile && <>
                  <Swiper
                    effect={"fade"}
                    pagination={{
                      clickable: true,
                    }}
                    breakpoints={{
                      900: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                      },
                    }}
                    className="mySwiper"
                  >
                    <SwiperSlide>
                      <Card
                        sx={{
                          boxShadow: "none",
                          borderRadius: "10px",
                          minHeight: "100px",
                          p: 1.5,
                          width: "100%",
                          mb: isMobile ? 5 : 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            justifyContent: "center",

                          }}
                        >
                          <Typography gutterBottom variant={"body2"}>
                            {t("seller.store_expense.pending_payout")}
                          </Typography>
                          <Typography color={"primary"} style={{ fontSize: "25px" }}>
                            {currency} {sellerFunds?.pendingPayout?.toFixed(2)}
                          </Typography>
                        </Box>
                      </Card>
                    </SwiperSlide>

                    <SwiperSlide>
                      <Card
                        sx={{
                          boxShadow: "none",
                          borderRadius: "10px",
                          minHeight: "100px",
                          p: 1.5,
                          width: "100%",
                          mb: isMobile ? 5 : 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            justifyContent: "center",
                            position: "relative",

                          }}
                        >
                          <Typography gutterBottom variant={"body2"}>
                            {t("seller.store_expense.available_payout")}
                          </Typography>
                          <Button
                            sx={{
                              position: "absolute",
                              right: 0,
                              bottom: 0,
                              textTransform: "capitalize",
                              gap: 1,
                              p: 0,
                            }}
                            disabled={seller?.isPausedPayout || !seller?.isActive}
                            onClick={() =>
                              dispatch(openCloseSellerWithdrawModal(true))
                            }
                          >
                            <Payments />
                            <Typography fontSize={14}>{t("seller.store_expense.Withdraw")}</Typography>
                          </Button>
                          <Typography color={"primary"} style={{ fontSize: "25px" }}>
                            {currency} {numberWithCommas(sellerFunds?.availablePayout)}
                          </Typography>
                        </Box>
                      </Card>
                    </SwiperSlide>

                    <SwiperSlide>
                      <Card
                        sx={{
                          boxShadow: "none",
                          borderRadius: "10px",
                          p: 1.5,
                          pb: 0,
                          minHeight: "100px",
                          width: "100%",
                          mb: isMobile ? 5 : 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            justifyContent: "center",
                            position: "relative",

                          }}
                        >
                          <Typography gutterBottom variant={"body2"}>
                            {t("seller.store_expense.payout_method")}
                          </Typography>
                          {(!isPaypal && !isBank) &&
                            <Button
                              sx={{ p: 0, textTransform: "unset" }}
                              onClick={() => {
                                if (seller?.accId) {
                                  localStorage.setItem("seller_accId", seller?.accId)
                                }
                                dispatch(openSellerPayoutModal(true))
                              }}
                              startIcon={<AccountBalanceWallet />}
                            >
                              {t("seller.store_expense.Add_payment_method")}
                            </Button>
                          }
                          {(isPaypal && !isBank) && <>
                            <Typography color={"primary"} sx={{ textAlign: "center" }}><AccountBalanceWallet sx={{ width: "0.6em", height: "0.6em" }} />&nbsp;&nbsp;{t("seller.store_expense.Paypal_Account")}</Typography>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <Button color={"error"} onClick={() => handleDelete("paypal")}>{t("seller.payout_method.Remove")}</Button>
                              <Button onClick={() => handleSellerLink("paypal")}>View</Button>
                            </div>

                          </>

                          }
                          {(isBank && !isPaypal) && <>
                            <Typography color={"primary"} sx={{ textAlign: "center" }}><AccountBalanceWallet sx={{ width: "0.6em", height: "0.6em" }} />&nbsp;&nbsp;{t("seller.store_expense.Bank_Account")}</Typography>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <Button color={"error"} onClick={() => handleDelete("bank")}>{t("seller.payout_method.Remove")}</Button>
                              <Button onClick={() => handleSellerLink("bank")}>{t("seller.payout_method.View")}</Button>
                            </div>
                          </>
                          }

                        </Box>
                      </Card>
                    </SwiperSlide>
                  </Swiper>
                </>}
                {isMobile && <>
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1.5,
                      minHeight: "100px",
                      width: "100%",
                      mb: isMobile ? 3 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",

                      }}
                    >
                      <Typography gutterBottom variant={"body2"}>
                        {t("seller.store_expense.pending_payout")}
                      </Typography>
                      <Typography color={"primary"} style={{ fontSize: "25px" }}>
                        {currency} {sellerFunds?.pendingPayout?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Card>

                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1.5,
                      width: "100%",
                      mb: isMobile ? 3 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",

                      }}
                    >
                      <Typography gutterBottom variant={"body2"}>
                        {t("seller.store_expense.available_payout")}
                      </Typography>
                      <Button
                        sx={{ p: 0, textTransform: "unset" }}
                        disabled={seller?.isPausedPayout || !seller?.isActive}
                        onClick={() =>
                          dispatch(openCloseSellerWithdrawModal(true))
                        }
                      >
                        <Payments />
                        <Typography fontSize={14}>&nbsp;&nbsp;{t("seller.store_expense.Withdraw")}</Typography>
                      </Button>
                      <Typography color={"primary"} style={{ fontSize: "25px" }}>
                        {currency} {numberWithCommas(sellerFunds?.availablePayout)}
                      </Typography>
                    </Box>
                  </Card>
                  <Card
                    sx={{
                      boxShadow: "none",
                      borderRadius: "10px",
                      p: 1.5,
                      pb: 0,
                      minHeight: "100px",
                      width: "100%",
                      mb: isMobile ? 3 : 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        // alignItems: "center",
                        justifyContent: "center",
                        position: "relative",

                      }}
                    >

                      <Typography gutterBottom variant={"body2"} sx={{ textAlign: "center" }}>
                        {t("seller.store_expense.payout_method")}
                      </Typography>
                      {(!isPaypal && !isBank) &&
                        <Button
                          sx={{ p: 0, textTransform: "unset" }}
                          onClick={() => {
                            if (seller?.accId) {
                              localStorage.setItem("seller_accId", seller?.accId)
                            }
                            dispatch(openSellerPayoutModal(true))
                          }}
                          startIcon={<AccountBalanceWallet />}
                        >
                          {t("seller.store_expense.Add_payment_method")}
                        </Button>
                      }
                      {(isPaypal && !isBank) && <>
                        <Typography color={"primary"} sx={{ textAlign: "center" }}><AccountBalanceWallet sx={{ width: "0.6em", height: "0.6em" }} />&nbsp;&nbsp;{t("seller.store_expense.Paypal_Account")}</Typography>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <Button color={"error"} onClick={() => handleDelete("paypal")}>{t("seller.payout_method.Remove")}</Button>
                          <Button onClick={() => handleSellerLink("paypal")}>{t("seller.payout_method.View")}</Button>
                        </div>

                      </>

                      }
                      {(isBank && !isPaypal) && <>
                        <Typography color={"primary"} sx={{ textAlign: "center" }}><AccountBalanceWallet sx={{ width: "0.6em", height: "0.6em" }} />&nbsp;&nbsp;{t("seller.store_expense.Bank_Account")}</Typography>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <Button color={"error"} onClick={() => handleDelete("bank")}>{t("seller.payout_method.Remove")}</Button>
                          <Button onClick={() => handleSellerLink("bank")}>{t("seller.payout_method.View")}</Button>
                        </div>
                      </>
                      }
                    </Box>
                  </Card>
                </>}
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ maxHeight: "calc(100% - 200px)" }}
            >
              <Table stickyHeader size={"small"}>
                <TableHead>
                  <TableRow>
                    {!isMobile && <>
                      <TableCell>{t("seller.store_expense.transaction")}</TableCell>
                      <TableCell>{t("seller.store_expense.date")}</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>{t("seller.store_expense.amount")}</TableCell>
                    </>}
                    {isMobile && <>
                      <TableCell>{t("seller.store_expense.transaction")}</TableCell>
                      <TableCell>{t("seller.store_expense.date")} {t("seller.store_expense.amount")}</TableCell>
                    </>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length > 0 &&
                    transactions
                      .slice()
                      .reverse()
                      .map((item, index) => {
                        return (
                          <TableRow key={index}>
                            {isMobile && <>
                              <TableCell
                                sx={{
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                {item.orderId && <Avatar
                                  variant={"circular"}
                                  src={item.orderId?.productId.photo[0]}
                                />}
                                {!item.orderId && <AccountBalanceIcon />}
                                <Typography
                                  fontSize={12}
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    pl: 0.3,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.orderId ? (
                                    item.orderId.productId ? (
                                      item.orderId.productId.title
                                    ) : (
                                      item.orderId.productId.name
                                    )
                                  ) : (
                                    "Withdraw"
                                  )}
                                  {item.status == "PROCESSED" && <p style={{ color: "#0ba659", fontSize: "12px", lineHeight: 0.1 }}>Processed</p>}
                                  {item.status == "PENDING" && <p style={{ color: "#f7d40a", fontSize: "12px", lineHeight: 0.1 }}>Pending</p>}
                                  {item.status == "CANCELLED" && <p style={{ color: "#f73d0a", fontSize: "12px", lineHeight: 0.1 }}>Cancelled</p>}
                                  {item.status == "Approve" && <p style={{ color: "green", fontSize: "12px", lineHeight: 0.1 }}>Approve</p>}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography fontSize={12}>
                                  {reCreateDate(item?.createdAt)}
                                </Typography>
                                <Typography color={"primary"} fontSize={12}>
                                  {currency + " "}
                                  {(item.amountDue).toFixed(2)}
                                </Typography>
                              </TableCell>

                            </>}
                            {!isMobile && <>
                              <TableCell
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {item.orderId && <Avatar
                                  variant={"circular"}
                                  src={item.orderId?.productId.photo[0]}
                                  sx={{ width: 37, height: 34 }}
                                />}
                                {!item.orderId && <AccountBalanceIcon sx={{ width: 37, height: 34 }}
                                />}
                                <Typography
                                  fontSize={12}
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: "250px",
                                    minWidth: "250px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.orderId ? (
                                    item.orderId.productId ? (
                                      item.orderId.productId.title
                                    ) : (
                                      item.orderId.productId.name
                                    )
                                  ) : (
                                    "Withdraw"
                                  )}
                                  {item.status == "PROCESSED" && <p style={{ color: "#0ba659", fontSize: "12px", lineHeight: 0.1 }}>Processed</p>}
                                  {item.status == "PENDING" && <p style={{ color: "#f7d40a", fontSize: "12px", lineHeight: 0.1 }}>Pending</p>}
                                  {item.status == "CANCELLED" && <p style={{ color: "#f73d0a", fontSize: "12px", lineHeight: 0.1 }}>Cancelled</p>}
                                  {item.status == "Approve" && <p style={{ color: "green", fontSize: "12px", lineHeight: 0.1 }}>Approve</p>}
                                </Typography>

                              </TableCell>
                              <TableCell>
                                <Typography fontSize={12}>
                                  {reCreateDate(item?.createdAt)}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "right" }}>
                                <Typography color={"primary"} fontSize={12}>
                                  {currency + " "}
                                  {(item.amountDue).toFixed(2)}
                                </Typography>
                              </TableCell>
                            </>}
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </div>}

      {stepper === 2 && <CardManagement />}
      {stepper === 3 && <Transfer />}
      {stepper === 4 && <Billing />}
      {isShow && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            minWidth: "100%",
            my: 2,
            mb: 8,
            display: "flex",
            px: 2,
            py: 2,
            flexDirection: "row",
            justifyContent: "space-evenly",
            bgcolor: "#25D366",
          }}
        >
          <Stack spacing={2} sx={{ color: "#fff" }}>
            <Typography variant={"body2"}>{t("seller.store_expense.Available_Payout")}</Typography>
            <Typography variant={"body2"}>
              {currency} {numberWithCommas(totalBill)}
            </Typography>
          </Stack>
          <Button
            onClick={() => dispatch(openSellerPayoutModal(true))}
            variant={"contained"}
            className={"buttonClass"}
            sx={{ color: "green", bgcolor: "#fff", borderRadius: "10px" }}
          >
            {t("seller.store_expense.Add_Payout_Method")}
          </Button>
        </Box>
      )}
      <SellerWithdrawModal totalBill={numberWithCommas(sellerFunds?.availablePayout)} currency={currency} sellerAccId={seller?.accId} paypal={seller?.paypal} sellerId={seller?.owner} storeId={seller?.storeId} />
      <PaypalModal />

      {openPaypalModal && <>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Container maxWidth={"md"} component={"main"} sx={{ width: "90%" }}>
            <Box sx={style}>
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
                    <IconButton aria-label="Close" onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
                <Box sx={{ mt: "16px" }} display={"flex"} flexDirection={"column"} gap={1}>
                  <Typography>
                    {seller.paypal}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }} mt={5}>
                  <Button sx={{ textTransform: "none", borderRadius: "20px", color: "primary", borderColor: "primary" }} variant="outlined" onClick={handleClose}>{t("seller.payout_method.Cancel")}</Button>

                </Box>
              </Box>
            </Box>
          </Container>
        </Modal >
      </>

      }
    </>
  );
};
export default StoreExpense;
