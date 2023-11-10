import React from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import SellersCard from "../Utils/SellerCards";
import { TSellerStore1 } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";

interface ISellerStore {
  stores: TSellerStore1[];
}
const Cards: React.FC<ISellerStore> = ({ stores }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
        <Typography variant={"h6"} mr={2} noWrap fontSize={15} fontWeight={500}>
          {t("home.bestSeller")}
        </Typography>
      </Box>
      {isMobile ? (
        <Swiper
          effect={"fade"}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {stores?.map(({ logo, name, _id }, index) => {
            return (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    width: "380px",
                    mb: 4,
                    mt: 2,
                  }}
                >
                  {logo && <SellersCard name={name} _id={_id} image={logo} />}
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <Grid container spacing={{ xs: 4, md: 3, lg: 3 }}>
          {stores.map(({ _id, name, logo }, index) => {
            return (
              <Grid key={index + _id} item xs={12} sm={6} md={4} lg={3}>
                {logo && <SellersCard name={name} _id={_id} image={logo} />}
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};
export default Cards;
