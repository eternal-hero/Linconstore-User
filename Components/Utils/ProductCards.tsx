import {
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Badge from "@mui/material/Badge";
import { useRouter } from "next/router";
import slug from "slug";
import Truncate from "../../Helpers/Truncate";
import { useSelector } from "react-redux";
import { TRating, TStoreId } from "../../Helpers/Types";
import StarIcon from "@mui/icons-material/Star";
import { formatNumber } from "../../Helpers/utils";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../hooks/useCurrency";

type TCurrency = {
  currency: {
    currency: string;
  };
};

type Iutil = {
  util: {
    sellerRate: number;
  };
};
interface IProductCards {
  discount: number;
  percent: boolean;
  name: string;
  image: string[];
  owner: TStoreId;
  price: number;
  rating: TRating;
  id: string;
  calculateRate: boolean;
  countryRate: any;
  currencySymbol: any;
}
const ProductCards: React.JSXElementConstructor<IProductCards> = ({
  discount,
  percent,
  name,
  image,
  owner,
  price,
  rating,
  id,
  calculateRate,
  countryRate,
  currencySymbol,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:1200px)");
  const initialCurrency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const [rate, setRate] = useState<number>(1);
  const currency = useCurrency();
  const [exchangeRate, setExchangeRate] =
    useState<Record<string, number>>(null);
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );

  const [isSeller, setIsSeller] = useState<boolean>(false);
  function camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
  const countryCode = "seller.verify.countryList." + camelCase(t(`${owner?.owner?.location.toLowerCase()}`));
  
  useEffect(() => {
     
    let interval;
    if (exchangeRate == null) {
      setInterval(() => {
        const exchangeRateString = localStorage.getItem("exchange");
        if (exchangeRateString) {
          const exchangeRate = JSON.parse(exchangeRateString);
          const rateLocl = exchangeRate[`${owner?.currency}`];
          if (rateLocl) {
            setRate(rateLocl);
          }
          setExchangeRate(JSON.parse(exchangeRateString));
        } else {
        }
      }, 60);
    } else {
      // Cleanup function to clear the interval
      clearInterval(interval);
    }
  }, [exchangeRate]);

  return (
    <Card
      className={"category"}
      variant={"outlined"}
      onClick={() =>
        router.push("/product/[slug]", `/product/${slug(name)}-${id}`)
      }
      sx={{
        border: "none",
        minWidth: "100px",
        position: "relative",
        bgcolor: "transparent",
      }}
    >
      {percent && discount && (
        <Badge
          className={"ribbon"}
          sx={{ p: 3, mt: 1, mx: isMobile ? 0 : 2, minWidth: "70px" }}
          badgeContent={"-" + discount + "% off"}
          color={"error"}
        />
      )}
      <Box
        sx={{
          display: "row",
          mx: isMobile ? 0 : 2,
          flexDirection: "row",
          p: 1,
        }}
      >
        <Image
          className={"products_image"}
          height={120}
          width={150}
          placeholder={"blur"}
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={image[0]}
          alt={"picture of product"}
        />
        <Grid container direction={"column"} spacing={0}>
          <Grid item xs={4}>
            <Typography
              className="innerHeight"
              sx={{ width: 150, fontSize: 14 }}
              gutterBottom
              variant="body1"
              component="span"
            >
              {Truncate(name, 30)}
            </Typography>
          </Grid>
          {rating && (
            <Grid item xs={4}>
              <Stack direction={"row"}>
                <StarIcon fontSize={"small"} sx={{ color: "#FFD700" }} />{" "}
                <Typography style={{fontSize: "13px"}}>
                  {formatNumber(rating.averageRating)} ({rating.ratings?.length}{" "}
                  {rating.ratings?.length > 1
                    ? t("product.reviews")
                    : t("product.review")}
                  )
                </Typography>
              </Stack>
            </Grid>
          )}
          {!isSeller && (
            <Grid item xs={4}>
              <Typography variant={"body2"}>
                {t("product.ships_from")}{" "}
                {t(`${countryCode}`)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={4}>
            <Typography
              color="primary"
              gutterBottom
              variant="body2"
              component="span"
            // sx={{ fontWeight: 600 }}
            >
              {currencySymbol}&nbsp;&nbsp;
              {calculateRate
                ? ((Number(price) * currency(owner?.currency)) / countryRate).toFixed(2)
                : Number(price).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
    // ((Number(price) * currency(owner?.currency)) / countryRate).toFixed(2)
    // <Card className={'product_card'} sx={{  minWidth: { xs: 50, sm: 200, lg: 250},  mt:3, position: 'relative' }}>
    // <Badge className={'ribbon'} sx={{p:3}} badgeContent={'-8%'} color={'error'} />
    //     <Box sx={{display: 'flex'}}>
    //
    //         <Image
    //             className={'product_next_image'}
    //             height={140}
    //             width={200}
    //             placeholder={'blur'}
    //             blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}
    //             src={'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=403&h=380'}
    //         />
    //         <Stack mt={0} mx={ {xs: 0.5, sm: 2}}>
    //             <Typography gutterBottom variant="body1" component="div">
    //                 Item Name
    //             </Typography>
    //             <Rating name="product_rating" size={'small'} value={3} readOnly />
    //             <Typography gutterBottom variant="body2" mt={2} component="span">
    //                 8$
    //             </Typography>
    //         </Stack>
    //     </Box>
    //     </Card>
  );
};
export default ProductCards;
