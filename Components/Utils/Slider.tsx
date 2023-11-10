import React from "react";
import "swiper/css";
import "swiper/css/bundle";
import SwiperCore, { Autoplay, EffectCards, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { categoryOptions } from "../Seller/StoreInfo";
import CatCard from "./CartCard";
import AllCatCard from "./AllCatCard";
import { useTranslation } from "react-i18next";

SwiperCore.use([EffectCards, Pagination, Autoplay]);
type IData = {
  title: string;
  subcategories: string[];
  link: string;
  _id: string;
};
interface ISlider {
  allCat: boolean;
  data: TCat[];
}
type TCat = {
    title: string;
    subcategories: string[];
    link: string;
    _id: string;
};
interface ICat {
    category: TCat;
}
const Slider: React.JSXElementConstructor<ISlider> = ({ allCat, data  }) => {
  const { t } = useTranslation();
  const catOptions: string[] = allCat
    ? categoryOptions
    : categoryOptions.slice(0, 6);

  return (
    <Swiper
      effect={"fade"}
      breakpoints={{
        // when window width is >= 240px
        240: {
          slidesPerView: allCat ? 2 : 1,
          spaceBetween: 20,
        },
        // when window width is >= 340px
        340: {
          slidesPerView: allCat ? 3 : 1,
          spaceBetween: 20,
        },
        // when window width is >= 480px
        480: {
          slidesPerView: allCat ? 4 : 2,
          spaceBetween: 20,
        },
        // when window width is >= 640px
        640: {
          slidesPerView: allCat ? 6 : 2,
          spaceBetween: 20,
        },
        // when window width is >= 840px
        840: {
          slidesPerView: allCat ? 8 : 3,
          spaceBetween: 10,
        },
      }}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="mySwiper"
    >
      {data?.map(({ link, title, _id }, index) => {
        title = t(`maincategory.${title}`);

        return (
          <SwiperSlide key={index}>
            {allCat ? (
              <AllCatCard key={index} category={title} id={_id} link={link} />
            ) : (
              <CatCard
                key={index}
                id={_id}
                index={index}
                link={link}
                category={title}
              />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Slider;
