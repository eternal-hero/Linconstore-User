import React, { useCallback, useContext, useEffect, useState } from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CartCards from "../Utils/CartCards";
import Typography from "@mui/material/Typography";
import {
  CircularProgress,
  Grid,
  Paper,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Nav from "../Layouts/Nav";
import { useGetCart } from "../../hooks/useDataFetch";
import { TCart } from "../../Helpers/Types";
import ContextApi from "../../Store/context/ContextApi";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import { useCurrency } from "../../hooks/useCurrency";
import Image from 'next/image';

let isFirst = false;
const Cart: React.FC = () => {
  const currency = useCurrency();
  const router = useRouter();
  const isMatches: boolean = useMediaQuery("(max-width: 402px)");
  const [cart, setCart] = useState<any>();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const { t } = useTranslation();
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  const onHandleDelete = useCallback(
    (id: string) => {
      const placeHolder = cart;
      const newCart = placeHolder.products.filter((x) => x.productId !== id);
      setCart(newCart);
    },
    [cart]
  );

  const onSuccess = (data: TCart | string) => {
    if (data === "Empty cart") return setIsEmpty(true);
    setCart(data);
  };

  const { isLoading, isFetching, isFetched, refetch, isError, error } =
    useGetCart(onSuccess);

  const handleCartChange = useContext(ContextApi).handleCartChange;

  const isUpdating = useContext(ContextApi).isUpdating;

  const handleRefetch = useCallback(() => {
    handleCartChange();
    refetch();
  }, [refetch]);

  useEffect(() => {
    const userString = Cookies.get("userInfo");
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol);
      setCountryRate(rateRes.rate);
    }

    init();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      isFirst = true;
      refetch();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  useEffect(() => {
    if (!isFirst) return;
    refetch();
  }, [isUpdating]);

  const calculateTotal = () => {
    let total = 0;
    cart.products.forEach((product) => {
      total = total + product.quantity * (product.price * currency(product.productId.owner.currency) / countryRate);
    });

    return total;
  };

  return (
    <>
      <Head>
        <title>{t("pagetitle.My_Cart")}</title>
        <meta name={"This are all the items in your carts"} content={"Carts"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Nav />
      <Box component="main" m={3}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            marginBottom: 3,
            flexDirection: "column",
            // alignItems: 'center',
            // height: 600,
            justifyContent: "center",
          }}
        >
          {
            !isEmpty && (
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography gutterBottom fontSize={15} component="div">
                  {t("cart.title")}
                </Typography>
              </Stack>
            )
          }
          {isEmpty && (
            <>
              <Grid container spacing={2} height={isMobile ? "calc(100vh - 164px)" : "calc(100vh - 82px)"}>
                <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                  <Image
                    width={isMobile ? 250 : 350}
                    height={isMobile ? 250 : 350}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/b35z6hhhronjvdjdqg1q"}
                    alt={"image of Happy"}
                  />
                </Grid>
                <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                  <Stack textAlign={"center"} gap={3}>
                    <Typography gutterBottom fontSize={15} component="div">
                      {t("cart.title")}
                    </Typography>
                    <Typography
                      gutterBottom
                      textAlign={"center"}
                      variant="body1"
                      component="div"
                      fontSize={14}
                    >
                      {t("cart.empty_content")}
                    </Typography>
                    <Button variant="contained" sx={{ textTransform: "capitalize" }} onClick={() => router.push('/')}>
                      Add Products
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </>
          )}
          {isLoading && <CircularProgress />}
          {isFetched && cart?.products?.length === 0 && (
            <Typography textAlign={"center"} fontSize={14}>
              {t("cart.cart_empty")}
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
              {isFetched && cart?.products?.length > 0 && (
                <Box
                  className={"empty-cart"}
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 8,
                  }}
                >
                  <Paper elevation={0} sx={{ width: "100%" }}>
                    {cart?.products.map((product, index) => (
                      <CartCards
                        deleteHandler={onHandleDelete}
                        handleRefetch={handleRefetch}
                        key={index}
                        cart={product}
                        countryRate={countryRate}
                        currencySymbol={currencySymbol}
                      />
                    ))}
                  </Paper>
                </Box>
              )}
            </Grid>
            <Grid item sm={4} xs={12}>
              {isFetched && cart?.products?.length > 0 && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: isMobile && 70,
                    top: !isMobile && 100,
                    bgcolor: "white",
                    width: !isMobile ? "30vw" : "90vw",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                    <Stack
                      sx={{
                        mb: 2,
                        mx: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontSize={14}>
                        {t("cart.total_price")}:
                      </Typography>
                      <Typography color="primary">
                        {isFetching && <CircularProgress />}
                        {currencySymbol}&nbsp;&nbsp;
                        {Number(calculateTotal()).toFixed(2)}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mt: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={() => router.push("/checkout")}
                      variant={"contained"}
                      sx={{ height: 45, width: "100%" }}
                      className={"buttonClass"}
                    >
                      {t("cart.btn_checkout")}
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default Cart;
