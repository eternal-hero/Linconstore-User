import Box from "@mui/material/Box";
import Head from "next/head";
import * as React from "react";
import {
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import AdsCard from "../Utils/AdsCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useGetSellerAds,
  useGetSellerInfo,
  usePromoteAd,
} from "../../hooks/useDataFetch";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isMatch } from "date-fns";
import { useRefresh, useTokenRefetch } from "../../hooks/useRefresh";

type TAdsProduct = {
  photo: string[];
  title: string;
  price: number;
  rating: number;
  _id: string;
};
type TPlan = {
  plan: string;
  limit: number;
};
type TUtils = {
  util: {
    sellerRate: number;
  };
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
interface IAdsProduct {
  productId: TAdsProduct;
}
interface IData {
  package: string;
}
const ManageAds: React.FC = () => {
  const isMatches = useMediaQuery("(max-width: 350px)");
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const [ads, setAds] = useState<IAdsProduct[]>([]);
  const [products, setProducts] = useState([]);
  const onSuccess = (data: any) => {
    setAds(data.ads);
    setProducts(data.products);
  };
  const plan: TPlan[] = [
    {
      plan: "free",
      limit: 5,
    },
    {
      plan: "Premium",
      limit: 20,
    },
  ];
  const { isLoading, isError, refetch } = useGetSellerAds(onSuccess);
  useTokenRefetch(refetch);
  const handlePromoteAd = (id: string, title: string) => {
    if (id.length === 0) return;
    const data = {
      productId: id,
      title,
    };

    promoteAd(data);
  };
  const [sellerLimit, setSellerLimit] = useState<number>(0);
  const [packageName, setPackageName] = useState<string>("");
  const rate: number = useSelector((state: TUtils) => state.util.sellerRate);
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const onStoreSuccess = (data: IData) => {
    const planMe: TPlan = plan.find((x) => {
      return x.plan.toLowerCase() === data.package.toLowerCase();
    });
    setSellerLimit(planMe?.limit);
    setPackageName(data?.package);
  };

  const { refetch: adsRefetch } = useGetSellerInfo(onStoreSuccess);
  useTokenRefetch(adsRefetch);

  const onPromoteSuccess = () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  const {
    isLoading: isPromoteLoading,
    mutate: promoteAd,
    isError: isPromoteError,
    error,
  } = usePromoteAd(onPromoteSuccess);
  useEffect(() => {
    if (isPromoteError) {
    }
  }, [isPromoteError]);
  return (
    <>
      <Head>
        <title>{t("pagetitle.ManageAds")}</title>
        <meta name={"Manage ads"} content={"These are Manage ads"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
        <>
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
            <Typography fontSize={14}> {t("seller.ads.title")} </Typography>
          </Box>
          {isPromoteError && (
            <FormHelperText sx={{ color: "red", textAlign: "center" }}>
              {t("seller.ads.error")}
            </FormHelperText>
          )}
          {isPromoteLoading && <CircularProgress />}
          <Stack direction={"row"} spacing={2}>
            <Stack>
              <Box sx={{ my: 0.2 }} />
              <Typography fontSize={14}>
                {ads.length} {t("seller.ads.of")} {sellerLimit}{" "}
                {t("seller.ads.for")} {packageName} {t("seller.ads.package")}
              </Typography>
            </Stack>
          </Stack>
          {isLoading && <CircularProgress />}
          {ads.length === 0 && (
            <Typography variant={"body1"} textAlign={"center"}>
              {t("seller.ads.alert_text")}
            </Typography>
          )}
          {ads.length > 0 && (
            <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
              {ads.map((ad, index) => {
                if (ad.productId) {
                  return (
                    <Grid
                      key={index}
                      item
                      xs={isMatches ? 12 : 6}
                      md={5}
                      lg={4}
                    >
                      {currency &&
                        <AdsCard
                          mode={false}
                          handlePromoteAd={handlePromoteAd}
                          product={ad.productId}
                          currency={currency}
                          rate={rate}
                        />
                      }

                    </Grid>
                  );
                }
              })}
            </Grid>
          )}
          <Typography fontSize={14}>{t("seller.ads.my_product")}</Typography>
          {products.length === 0 && (
            <Typography variant={"subtitle1"}>
              {t("seller.ads.subtitle1")}
            </Typography>
          )}
          {products.length > 0 && (
            <Grid container>
              {products.map((product, index) => (
                <Grid key={index} item xs={isMatches ? 12 : 6} md={5} lg={4}>
                  {currency &&
                    <AdsCard
                      currency={currency}
                      rate={rate}
                      handlePromoteAd={handlePromoteAd}
                      mode={true}
                      product={product}
                    />
                  }

                </Grid>
              ))}
            </Grid>
          )}
        </>
      </Card>
    </>
  );
};
export default ManageAds;