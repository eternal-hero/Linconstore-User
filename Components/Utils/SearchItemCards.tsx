import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import slug from "slug";
import { useRouter } from "next/router";
import Truncate from "../../Helpers/Truncate";
import { TRating, TStoreId } from "../../Helpers/Types";
import Badge from "@mui/material/Badge";
import StarIcon from "@mui/icons-material/Star";
import { formatNumber } from "../../Helpers/utils";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../hooks/useCurrency";

type TProducts = {
  title: string;
  price: number;
  owner: TStoreId;
  discount: number;
  photo: string[];
  ratingId: TRating;
  _id: string;
};
interface IProducts {
  product: TProducts;
  percent: boolean;
  countryRate: any;
  currencySymbol: any;
}
const SearchItemCards: React.JSXElementConstructor<IProducts> = ({
  product,
  percent,
  countryRate,
  currencySymbol,
}) => {
  const router = useRouter();
  const { title, photo, price, _id, owner, discount } = product;
  const ratingId = product?.ratingId;
  const isMobile = useMediaQuery("(max-width:600px)");
  const { t } = useTranslation();
  const [rate, setRate] = useState<number>(1);
  const currency = useCurrency();
  const sellerRate = currency(owner?.currency);
  return (
    <Card
      elevation={0}
      className={"category"}
      onClick={() =>
        router.push("/product/[slug]", `/product/${slug(title)}-${_id}`)
      }
      sx={{
        minWidth: { xs: 50, sm: 250, lg: 300 },
        mt: 3,
        position: "relative",
      }}
    >
      {/*<Box sx={{display: 'row', mx:isMobile ? 0 : 2, flexDirection: 'row',p:1 }}>*/}
      {/*    <Image*/}
      {/*        className={'products_image'}*/}
      {/*        height={120}*/}
      {/*        width={150}*/}
      {/*        placeholder={'blur'}*/}
      {/*        blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}*/}
      {/*        src={photo[0]}*/}
      {/*    />*/}
      {/*    <Grid container direction={'column'} spacing={0}>*/}
      {/*        <Grid item  xs={4}>*/}
      {/*            <Typography sx={{width: 150}} gutterBottom variant="body1" component="div">*/}
      {/*                {Truncate(title, 30)}*/}
      {/*            </Typography>*/}
      {/*        </Grid>*/}
      {/*        { ratingId &&  <Rating name="product_rating" value={ratingId.averageRating} readOnly />}*/}
      {/*        <Grid item  xs={4}>*/}
      {/*            <Typography gutterBottom variant="body2"  component="span">*/}
      {/*                ${price}*/}
      {/*            </Typography>*/}
      {/*        </Grid>*/}
      {/*    </Grid>*/}
      {/*</Box>*/}
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
          height={isMobile ? 140 : 120}
          width={150}
          placeholder={"blur"}
          blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
          src={photo[0]}
          alt={"image of products"}
        />
        <Grid container direction={"column"} spacing={0}>
          <Grid item xs={4}>
            <Typography
              sx={{ width: 170, fontWeight: 500, fontSize: 14 }}
              variant="body1"
            >
              {Truncate(title, 30)}
            </Typography>
          </Grid>

          {ratingId && (
            <Grid item xs={4} >
              <Stack direction={"row"}>
                <StarIcon fontSize={"small"} sx={{ color: "#FFD700" }} />{" "}
                <Typography style={{fontSize: "13px"}}>
                  {formatNumber(ratingId?.averageRating)} (
                  {ratingId?.ratings?.length}
                  {ratingId?.ratings?.length > 1
                    ? t("product.reviews")
                    : t("product.review")}
                  )
                </Typography>
              </Stack>
            </Grid>
          )}
          <Grid item xs={4} >
            <Typography sx={{ width: 150 }} variant="body2">
              {t("product.ships_from")}{" "}
              {t(
                "seller.verify.countryList." +
                  owner?.owner?.location.toLowerCase()
              )}
            </Typography>
          </Grid>
          {/*<Grid item xs={4}>*/}
          {/*    <Typography variant={'body2'}>ships from {owner?.location} </Typography>*/}
          {/*</Grid>*/}
          <Grid item xs={4}>
            <Typography
              gutterBottom
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#0ba659" }}
              component="span"
            >
              {currencySymbol}&nbsp;&nbsp;{" "}
              {((price * sellerRate) / countryRate).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/*<Box sx={{display: 'flex'}}>*/}
      {/*    <Image*/}
      {/*    height={200}*/}
      {/*    width={250}*/}
      {/*    placeholder={'blur'}*/}
      {/*    blurDataURL={'https://via.placeholder.com/300.png/09f/fff'}*/}
      {/*    src={photo[0]}*/}
      {/*    />*/}
      {/*    <Stack spacing={0.5} mt={0} mx={2}>*/}
      {/*        <Typography gutterBottom variant="h6" component="div">*/}
      {/*            {Truncate(title, 30)}*/}
      {/*        </Typography>*/}
      {/*        { ratingId &&  <Rating name="product_rating" value={ratingId.averageRating} readOnly />}*/}
      {/*        <Stack direction={'row'}>*/}
      {/*            <Box flexGrow={1} />*/}
      {/*            <Typography gutterBottom variant="body1" mt={2} component="div">*/}
      {/*                ${price}*/}
      {/*            </Typography>*/}
      {/*        </Stack>*/}

      {/*    </Stack>*/}
      {/*</Box>*/}
    </Card>
  );
};
export default SearchItemCards;
