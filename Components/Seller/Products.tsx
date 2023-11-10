import { AddBoxOutlined } from "@mui/icons-material";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import ProductCards from "../Utils/ProductCards";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { TRating, TStoreId } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";

type TProducts = {
  discount: number;
  title: string;
  photo: string[];
  owner: TStoreId;
  price: number;
  ratingId: TRating;
  _id: string;
  orders: number;
  quantity: number;
};
interface IProducts {
  top: boolean;
  data: TProducts[];
  title: string;
  mode: boolean;
  seller: boolean;
  hot: boolean;
  calculateRate?: boolean;
}
export const product_items: number[] = [1, 2, 3, 4, 5, 6];
const Products: React.JSXElementConstructor<IProducts> = ({
  top,
  data,
  title,
  mode,
  seller,
  hot,
  calculateRate,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isTop = (title: string): boolean => title.toLowerCase().includes("top");

  const userString = Cookies.get("userInfo");
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  useEffect(() => {
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol)
      setCountryRate(rateRes.rate)
    }

    init()
  }, []);

  const isMobile: boolean = useMediaQuery("(max-width : 350px)");
  const viewAllStr = t("home.viewAll");

  return (
    <>
      {data?.length > 0 && <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography mr={2} noWrap fontSize={15}>
            {title}
          </Typography>

          {hot && (
            <Button
              variant={"outlined"}
              sx={{ border: "0px !important", fontSize: 15, fontWeight: 500, textTransform : 'none' }}
              onClick={() => router.push("/deals")}
              size={"small"}
              color={"success"}
            >
              {" "}
              {viewAllStr[0].toUpperCase() + viewAllStr.slice(1).toLowerCase() }{" "}
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
          {mode && (
            <span>
              {" "}
              <AddBoxOutlined sx={{ color: "#00a859", mt: 0.5 }} />
            </span>
          )}
        </Box>
        <Grid container spacing={{ xs: 0, md: 6, lg: seller ? 2 : 1 }}>
          {data?.map((value, index) => {
            if (value.quantity > 0) {
              if (top && value.orders !== 0) {
                return (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    sm={4}
                    md={seller ? 2.3 : 2}
                    lg={seller ? 3 : 2}
                  >
                    <ProductCards
                      calculateRate={calculateRate}
                      percent={hot}
                      owner={value.owner}
                      image={value.photo}
                      price={value.price}
                      name={value.title}
                      rating={value.ratingId}
                      id={value._id}
                      discount={value.discount}
                      countryRate={countryRate}
                      currencySymbol={currencySymbol}
                    />
                  </Grid>
                );
              }
              if (!top) {
                return (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    sm={4}
                    md={seller ? 2.3 : 3}
                    lg={seller ? 3 : 2}
                  >
                    <ProductCards
                      calculateRate={calculateRate}
                      percent={hot}
                      owner={value.owner}
                      image={value.photo}
                      price={value.price}
                      name={value.title}
                      rating={value.ratingId}
                      id={value._id}
                      discount={value.discount}
                      countryRate={countryRate}
                      currencySymbol={currencySymbol}
                    />
                  </Grid>
                );
              }
            }
          })}
        </Grid>
      </>}
    </>
  );
};
export default Products;
