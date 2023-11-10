import React, { useEffect, useState } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress, Grid, Paper, Stack, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import WishlistCard from "../Utils/WishlistCard";
import { ArrowBack } from "@mui/icons-material";
import Nav from "../Layouts/Nav";
import { useGetUserWishlist } from "../../hooks/useDataFetch";
import { TProducts } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import Image from 'next/image';

type Tvariants = {
  option: string;
  variant: string;
};
interface IWish {
  productId: TProducts;
  price: number;
  created_at: Date;
  _id: string;
  variants: Tvariants[];

  check: boolean;
}
interface Initial {
  productId: TProducts;
  price: number;
  variants: Tvariants[];
  created_at: Date;
}
const Wishlist: React.FC = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<IWish[]>([]);
  const onSuccess = (data: Initial[]) => {
    const initial: IWish[] = [];
    data.forEach((myData) => {
      initial.push({ ...myData, check: false } as IWish);
    });
    setWishlist(initial);
  };
  const { isLoading, data, isFetched, refetch } = useGetUserWishlist(onSuccess);

  useTokenRefetch(refetch)
  const handleRefetch = () => refetch();
  const { t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  useEffect(() => {
    const userString = Cookies.get("userInfo");
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol)
      setCountryRate(rateRes.rate)
    }

    init()

  }, []);

  return (
    <>
      <Head>
        <title>{t("pagetitle.Your_Wishlist")}</title>
        <meta name={"Wishlist"} content={"These are your wish list"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>

      <Nav />
      <Container component="main" maxWidth={"xl"}>
        <CssBaseline />
        {
          wishlist.length > 0 && (
            <Box
              sx={{
                marginTop: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5
              }}
            >

              <Typography textAlign={"center"} component="div" width={"100%"} fontSize={15}>
                {t("wish_list.title")} {isLoading && <CircularProgress />}
              </Typography>
            </Box>
          )
        }
        <Box
          sx={{
            marginBottom: 3,
            display: "flex",
            marginTop: 2,
            flexDirection: "column",
            // alignItems: 'center',
            // height: 600,
            justifyContent: "center",
          }}
        >
          {wishlist.length > 0 && (
            <WishlistCard handleRefetch={handleRefetch} wishlists={wishlist} countryRate={countryRate} currencySymbol={currencySymbol}/>
          )}
          {wishlist.length === 0 && (        
            <>
              <Grid container spacing={2} height={ isMobile ? "calc(100vh - 164px)" : "calc(100vh - 82px)"}>
                <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                  <Image
                    width={ isMobile ? 250 : 350}
                    height={isMobile ? 250 : 350}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/pxy0lqlhu5gwqvvck4jb"}
                    alt={"image of Happy"}
                />
                </Grid>
                <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                  <Stack textAlign={"center"} gap={3}>
                  <Typography textAlign={"center"} component="div" width={"100%"} fontSize={15}>
                    {t("wish_list.title")} {isLoading && <CircularProgress />}
                  </Typography>
                  <Typography variant={"body1"} textAlign={"center"} fontSize={14} fontWeight={500}>
                    {t("wish_list.content")}
                  </Typography>
                  <Button variant="contained" sx={{textTransform: "capitalize"}} onClick={() => router.push('/')}>
                    Add Products
                  </Button>
                  </Stack>
                </Grid>

              </Grid>
            </>
          )}
          {/*<WishlistCard/>*/}
          {/*<WishlistCard/>*/}
        </Box>
      </Container>
    </>
  );
};
export default Wishlist;
