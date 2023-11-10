import { Box } from "@mui/system";
import {
  Card,
  CardMedia,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { TSellerStore1 } from "../../Helpers/Types";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import slug from "slug";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

interface IBrands {
  brands: TSellerStore1[];
}
const BrandCards: React.FC<IBrands> = ({ brands }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mt: 2 }}>
        <Typography mr={2} fontSize={15}>
          {t("home.popularBrands")}
        </Typography>
      </Box>
        <Swiper
          // modules={[Pagination]}
          effect={"fade"}
          breakpoints={{
            // when window width is >= 240px
            240: {
              slidesPerView: brands ? 3 : 1,
              spaceBetween: 20,
            },
            // when window width is >= 340px
            340: {
              slidesPerView: brands ? 3 : 1,
              spaceBetween: 20,
            },
            // when window width is >= 480px
            480: {
              slidesPerView: brands ? 4 : 2,
              spaceBetween: 20,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: brands ? 6 : 2,
              spaceBetween: 20,
            },

            900: {
              slidesPerView: brands ? 6 : 6,
              spaceBetween: 20,
            },


          }}
          // pagination={{
          //   clickable: true,
          // }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {brands?.map(({ logo, name, _id }, index) => {
            return (
              <SwiperSlide key={index}>
                <Grid key={_id + index} item xs={2} sm={2} md={2} lg={2}>
                  <Card
                    onClick={() =>
                      router.push("/store/[slug]", `/store/${slug(name)}`)
                    }
                    sx={{
                      width: {
                        xs: "110px",
                        sm: "110px",
                        md: "150px",
                        lg: "180px",
                      },
                      height: {
                        xs: "110px",
                        sm: "110px",
                        md: "150px",
                        lg: "180px",
                      },

                      position: "relative",
                      boxShadow: "none",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      alt="store image"
                      className={"product_image"}
                      image={logo}
                      sx={{
                        mr: 2,
                      }}
                    />
                  </Card>
                </Grid>
              </SwiperSlide>
            );
          })}
        </Swiper>
    </>
  );
};
export default BrandCards;
