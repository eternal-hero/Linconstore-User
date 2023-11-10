import {
  Box,
  Button,
  ButtonProps,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Rating
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Index";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import { deepOrange } from "@mui/material/colors";
import { addRatingModalOpen } from "../../Store/Modal";
import ContextApi from "../../Store/context/ContextApi";
import { ArrowBack, ContentCopy, Storefront } from "@mui/icons-material";
import { useRouter } from "next/router";
import { getLocaleDate } from "../../Helpers/getDate";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../hooks/useCurrency";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import { setSelectedOrder } from "../../Store/Order";

const OrderDetail = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { order, user } = useSelector((state: RootState) => state.Order);
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  const [refundable, setRefundable] = useState(true);
  const [rating, setRating] = useState(null);
  const handleRating = useContext(ContextApi).handleRatingId;
  const dispatch = useDispatch();
  const currency = useCurrency();
  const sellerRate = currency(order.productId.owner.currency)
  const buttonColor =
    order.status === "placed"
      ? "#ffc522"
      : order.status === "processed"
        ? "#0ba659"
        : order.status === "cancelled"
          ? "brown"
          : "#0ba659";

  useEffect(() => {
    const userString = Cookies.get("userInfo");
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol);
      setCountryRate(rateRes.rate);
    }
    const orderData = localStorage.getItem('orderData');
    const order = JSON.parse(orderData);
    const user = localStorage.getItem('userData');
    dispatch(setSelectedOrder({ order, user }));
    init();
  }, []);

  useEffect(() => {
    if (order) {
      const currentDate = new Date();
      const targetDate = new Date(order.createdAt);
      const timeDifference = Number(currentDate) - Number(targetDate);
      const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
      if (daysDifference >= 30) {
        setRefundable(false)
      } else {
        setRefundable(true)
      }
      if (order.productId.ratingId && order.productId.ratingId.ratings.length > 0) {
        const userInfo = JSON.parse(Cookies.get('userInfo'))
        const ratings = order.productId.ratingId.ratings
        const rate = ratings.filter(rating => rating.userId == userInfo._id)
        setRating(rate[0])
      }
    }
  }, [order]);

  const handleRate = () => {
    handleRating(order.productId._id);
    dispatch(addRatingModalOpen());
  };

  const handleClick = async (data: string) => {
    await navigator.clipboard.writeText(data);
    dispatch(
      snackBarOpen({
        message: "Copied to clipboard",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const handleRedirect = (id: string) => {
    router.push(`refund?q=${id}`);
  };

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Box mx={5} mt={5}>
        <Stack direction={"row"} alignItems={"center"}>
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <ArrowBack
              onClick={() => router.back()}
              className={"pointer"}
              sx={{ color: "#0ba659" }}
            />
          </Stack>
        </Stack>

        <Grid container spacing={1}>
          <Grid item md={8} xs={12}>
            <Box
              sx={{
                my: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  p: 2,
                  gap: 2,
                  border: "1px solid #c3c3c3",
                  borderRadius: "10px",
                  bgcolor: "wheat",
                }}
              >
                <Image
                  width={100}
                  height={100}
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                  src={order.productId.photo[0]}
                  alt={"image of product"}
                />
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  mt={"auto"}
                  mb={"auto"}
                  alignItems={"center"}
                >
                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      fontWeight={700}
                      mb={1}
                      sx={{
                        width: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {order.productId.title}
                    </Typography>
                    {order?.variants?.map((variant) => (
                      <Box
                        key={variant._id}
                        display={"flex"}
                        flexDirection={"row"}
                      >
                        <Typography>{variant.variant}:</Typography>
                        <Typography>{variant.option}</Typography>
                      </Box>
                    ))}
                    <Typography sx={{ color: "#0ba659", mt: 1 }}>
                      {currencySymbol}&nbsp;&nbsp;{" "}
                      {(
                        (order.productId.price * sellerRate) / countryRate
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {order.status === "delivered" && (
                <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
                  {rating ?
                    <Rating value={rating.rating} readOnly sx={{ mr: "10px", alignItems: "center" }} /> :
                    <Button variant="outlined" sx={{ mr: "10px" }} onClick={handleRate}>
                      {t("OrderDetail.Write_a_review")}
                    </Button>
                  }
                  <Button
                    variant="contained"
                    disabled={order.refund || !refundable}
                    onClick={() => handleRedirect(order.productId._id)}
                  >
                    {t("OrderDetail.Refund")}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid
            item
            md={4}
            xs={12}
            display={"flex"}
            flexDirection={"column"}
            gap={2}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              bgcolor={"wheat"}
              borderRadius={"10px"}
              p={1}
              mt={2}
            >
              <Box mb={1}>
                <Typography mb={1} fontSize={14}>
                  {t("OrderDetail.Order_Id")} - {order._id}
                </Typography>
                <Typography fontSize={12}>
                  {t("OrderDetail.Order_confirmed")}
                </Typography>
                <Typography fontSize={12}>
                  {getLocaleDate(order.createdAt.toString())}
                </Typography>
              </Box>

              {order.status !== "cancelled" ? (
                <Box mb={1}>
                  <Typography fontSize={14} mb={1}>
                    {t("OrderDetail.Order_Processing")}
                  </Typography>
                  <Typography fontSize={12}>
                    {t("OrderDetail.Expected_delivery_date")}:{" "}
                    {getLocaleDate(order.updatedAt.toString())}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography fontSize={12}>
                    {t("OrderDetail.Cancelled")}
                  </Typography>
                  <Typography fontSize={12}>
                    {t("OrderDetail.Expected_delivery_date")}:{" "}
                    {getLocaleDate(order.createdAt.toString())}
                  </Typography>
                </Box>
              )}
              {(order.status === "processed" ||
                order.status === "delivered") && (
                  <Box>
                    <Typography fontSize={14}>
                      {t("OrderDetail.Order_Shipped")}
                    </Typography>
                    <Typography
                      display={"flex"}
                      onClick={() => handleClick(order.trackingId)}
                      sx={{ cursor: "pointer" }}
                    >
                      <ContentCopy
                        sx={{
                          color: "#0ba659",
                          width: "15px",
                        }}
                      />
                      <Typography sx={{ color: "#0ba659" }}>
                        {order.trackingId}
                      </Typography>
                    </Typography>
                    <Typography pl={2} sx={{ color: "#0ba659" }}>
                      {order.shippingProvider}
                    </Typography>
                  </Box>
                )}
              {order.status === "delivered" && (
                <Box>
                  <Typography
                    fontSize={14}
                    mb={1}
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {t("OrderDetail.Order_Delivered")}
                  </Typography>
                  <Typography fontSize={12}>
                    {getLocaleDate(order.createdAt.toString())}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box bgcolor={"wheat"} borderRadius={"10px"} p={1}>
              <Typography fontSize={14} mb={1}>
                {t("OrderDetail.Shipping_address")}
              </Typography>
              <Box>
                {/* <Typography fontSize={12} fontWeight={900}>Kiran</Typography> */}
                {order.address && (
                  <Typography fontSize={12}>
                    {order.address.address}, {order.address.country},{" "}
                    {order.address.zipCode}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box bgcolor={"wheat"} borderRadius={"10px"} p={1}>
              <Typography fontSize={14} mb={1}>
                {t("OrderDetail.Pricing_details")}
              </Typography>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={12}>
                  {t("OrderDetail.Subtotal")}
                </Typography>
                <Typography fontSize={12}>
                  {currencySymbol}&nbsp;&nbsp;
                  {((order.productId.price * sellerRate) / countryRate).toFixed(2)}
                </Typography>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={12}>
                  {t(`order.${order.shipping}`)} {t("OrderDetail.shipping")}
                </Typography>
                <Typography fontSize={12}>
                  {currencySymbol}&nbsp;&nbsp;
                  {((order.shippingCost * sellerRate) / countryRate).toFixed(2)}
                </Typography>
              </Box>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontSize={12}>{t("OrderDetail.Total")}</Typography>
                <Typography fontSize={12} sx={{ color: "#0ba659" }}>
                  {currencySymbol}&nbsp;&nbsp;
                  {
                    ((order.productId.price + ((order.shippingCost * sellerRate) / countryRate))).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default OrderDetail;
