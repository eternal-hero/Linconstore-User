import {
  Avatar,
  Box,
  Card,
  Grid,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReviewCards from "../Utils/ReviewCards";
import React from "react";
import { useTranslation } from "react-i18next";

type TReviews = {
  rate: number;
  description: string;
  name: string;
};

interface IReviews {
  reviews: TReviews[];
  showReviews?: boolean;
}
const Product_reviews: React.JSXElementConstructor<IReviews> = ({
  reviews,
  showReviews = false,
}) => {
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();

  return (
    <Box
      padding={1}
      mx={0}
    >
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {t("seller.review.recent_reviews")}
      </Typography>
      <Grid container>
        {reviews.map((item, index) => (
          <Grid item key={index} md={showReviews ? 6 : 12}>
            <ReviewCards
              key={index}
              description={item.description}
              name={item.name}
              rate={item.rate}
            />
          </Grid>
        ))}

      </Grid>
    </Box>
  );
};
export default Product_reviews;
