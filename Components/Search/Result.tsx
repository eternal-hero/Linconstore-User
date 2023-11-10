import React, { useEffect, useState } from "react";
import Nav from "../Layouts/Nav";
import MainHolder from "../Wappers/MainHolder";

import { Grid } from "@mui/material";
import SearchItemCards from "../Utils/SearchItemCards";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TStoreId } from "../../Helpers/Types";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Filter from "../Utils/Filter";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";

type TRating = {
  averageRating: number;
  ratings: [];
};
type TProducts = {
  title: string;
  updatedAt: string;
  price: number;
  photo: string[];
  condition: string;
  discount: number;
  quantity: number;
  owner: TStoreId;
  ratingId: TRating;
  _id: string;
};
type TAds = {
  productId: TProducts;
};
interface IResults {
  products: TProducts[];
  ads: TAds[];
  searchTags: string[];
  relatedProducts: TProducts[];
}
const SearchResults: React.JSXElementConstructor<IResults> = ({
  searchTags,
  ads,
  relatedProducts,
  products,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const userString = Cookies.get("userInfo");
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  const [filterAds, setFilterAds] = useState<TAds[]>(ads.sort((a, b) => new Date(b.productId?.updatedAt).getTime() - new Date(a.productId?.updatedAt).getTime()));
  const [filterProducts, setFilterProducts] = useState<TProducts[]>(products.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  const [filterRProducts, setFilterRProducts] = useState<TProducts[]>(relatedProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));

  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem("searchScrollPos", window.scrollY.toString());
    };
    router.events.on("routeChangeStart", handleRouteChange);
    const storedScrollPosition = localStorage.getItem("searchScrollPos");
    const timeout = setTimeout(() => {
      if (storedScrollPosition) {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }
    }, 50);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      clearTimeout(timeout);
    };
  }, []);

  //TODO Add filter function
  const onFilter = (data) => {
    const tempAds = ads.filter((ad) => ad.productId)
    let fAds = tempAds
    let fProducts = products
    let fRProducts = relatedProducts
    if(data){
      if (data.pricing == "lowest") {
        fAds = tempAds.slice().sort((a, b) => a.productId?.price - b.productId?.price);
        fProducts = products.slice().sort((a, b) => a.price - b.price);
        fRProducts = relatedProducts.slice().sort((a, b) => a.price - b.price);
      } else {
        fAds = tempAds.slice().sort((a, b) => b.productId?.price - a.productId?.price);
        fProducts = products.slice().sort((a, b) => b.price - a.price);
        fRProducts = relatedProducts.slice().sort((a, b) => b.price - a.price);
      }
  
      fAds = fAds.filter((ad) => ad.productId?.condition == data.condition)
      fProducts = fProducts.filter((p) => p.condition == data.condition)
      fRProducts = fRProducts.filter((p) => p.condition == data.condition)
  
      if (data.discount == "discount") {
        fAds = fAds.filter((ad) => ad.productId?.discount)
        fProducts = fProducts.filter((p) => p.discount)
        fRProducts = fRProducts.filter((p) => p.discount)
      } else if (data.discount == "noDiscount") {
        fAds = fAds.filter((ad) => !ad.productId?.discount)
        fProducts = fProducts.filter((p) => !p.discount)
        fRProducts = fRProducts.filter((p) => !p.discount)
      }
  
      if (data.itemOrder == "newListing") {
        const currentDate = new Date();
        fAds = fAds.filter((ad) => {
          return new Date(ad.productId?.updatedAt) >= new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        })
        fProducts = fProducts.filter((p) => {
          return new Date(p.updatedAt) >= new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        })
        fRProducts = fRProducts.filter((p) => {
          return new Date(p.updatedAt) >= new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        })
      }
    }

    setFilterAds(fAds)
    setFilterProducts(fProducts)
    setFilterRProducts(fRProducts)
  }

  useEffect(() => {
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol)
      setCountryRate(rateRes.rate)
    }
    init()
  }, []);

  return (
    <>
      <Nav searchaValue={searchTags.toString()} />
      <MainHolder>
        {/*<Products mode={false} title={'Top Deals'} data={[]} seller={false} discount={false}/>*/}
        {/*<Cards/>*/}
        <Typography variant={"h5"} mt={2} fontSize={14} fontWeight={500} gutterBottom>
          {t("search.title") + " " + searchTags}
        </Typography>
        {filterAds.length === 0 &&
          filterProducts.length === 0 &&
          filterRProducts.length === 0 && (
            <Typography variant={"h6"} textAlign={"center"} mt={2} gutterBottom>
              {t("search.no_find_title")}
            </Typography>
          )}
        {filterAds.length > 0 && (
          <Box>
            <Typography variant={"body1"} fontSize={14} fontWeight={500} gutterBottom>
              {t("search.ads_title")}
            </Typography>
            <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
              {filterAds.map((ad, index) => {
                if (ad.productId?.title && ad.productId?.quantity > 0) {
                  return (
                    <Grid key={index} item xs={6} sm={6} md={4} lg={2}>
                      <SearchItemCards percent={true} product={ad.productId} countryRate={countryRate} currencySymbol={currencySymbol} />
                    </Grid>
                  );
                }
              })}
            </Grid>
          </Box>
        )}
        {filterProducts.length > 0 && (
          <Box>
            <Typography variant={"body1"} fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 5 }}>
              {t("search.title2")}
            </Typography>
            <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
              {filterProducts.map((product, index) => {
                if (product.title && product.quantity > 0) {
                  return (
                    <Grid key={index} item xs={6} sm={6} md={4} lg={2}>
                      <SearchItemCards percent={true} product={product} countryRate={countryRate} currencySymbol={currencySymbol} />
                    </Grid>
                  );
                }
              })}
            </Grid>
          </Box>
        )}
        {filterRProducts.length > 0 && (
          <Box>
            <Typography variant={"body1"} gutterBottom>
              {t("search.similar_products_related_to") + " " + searchTags}
            </Typography>
            <Grid container spacing={{ xs: 4, md: 6, lg: 6 }}>
              {filterRProducts.map((product, index) => {
                if (product.title && product.quantity > 0) {
                  return (
                    <Grid key={index} item xs={6} sm={6} md={4} lg={2}>
                      <SearchItemCards percent={true} product={product} countryRate={countryRate} currencySymbol={currencySymbol} />
                    </Grid>
                  );
                }
              })}
            </Grid>
          </Box>
        )}

        <Filter onFilter={onFilter} />
      </MainHolder>
    </>
  );
};
export default SearchResults;
