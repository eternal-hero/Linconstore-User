import type { NextPage } from "next";
import Head from "next/head";
import Nav from "../Components/Layouts/Nav";
import MainHolder from "../Components/Wappers/MainHolder";
import Products from "../Components/Seller/Products";
import Cards from "../Components/Seller/Cards";
import BrandCards from "../Components/Utils/BrandCards";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Slider from "../Components/Utils/Slider";
import Footer from "../Components/Layouts/Footer";
import LanguageSelect from "../Components/LanguageSelect";
import React, { useContext, useEffect, useState } from "react";
import {
  useGetAllCategories,
  useGetAllProducts,
  useGetAllStores,
  useGetBrands,
  useGetHotDeals,
  useGetTopCategories,
  useGetTopProducts,
} from "../hooks/useDataFetch";
import { TSellerStore1, TStoreId } from "../Helpers/Types";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { languages } from "../config/i18n";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setLanguageModal, setModalCookie } from "../Store/Modal";
import { getLangPlusCountryCode } from "../Helpers/utils";

type TRating = {
  averageRating: number;
  ratings: [];
};
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
type TCat = {
  title: string;
  subcategories: string[];
  link: string;
  _id: string;
};
interface ICat {
  category: TCat;
}

const Home: NextPage = () => {
  // pages/index.js
  const LanguageModal = useSelector((state: any) => state.modal.languageModal);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // localStorage.setItem("scrollPosition", window.scrollY.toString());
      Cookies.set("scrollPosition", window.scrollY.toString(), { expires: 3, secure: true });
    };
    dispatch(setLanguageModal(true));
    if (Cookies.get("currentLanguage")) {
      if (Cookies.get("CookiesBannerStatus") === "true") {
        dispatch(setModalCookie(false))
      }
    }

    router.events.on("routeChangeStart", handleRouteChange);

    const storedScrollPosition = localStorage.getItem("scrollPosition");
    const timeout = setTimeout(() => {
      if (storedScrollPosition) {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }
    }, 500);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      clearTimeout(timeout);
    };
  }, []);

  const { i18n, t } = useTranslation();
  const [topCategory, setTopCategory] = useState<TCat[]>([]);
  const [allCategory, setAllCategory] = useState<TCat[]>([]);
  const dispatch = useDispatch();
  const onSuccess = (data: TCat[]) => {
    setAllCategory(data);
  };
  const [hotDeals, setHotdeals] = useState<TProducts[]>([]);
  const dealsSuccess = (data: TProducts[]) => {
    const newData = data.length > 11 ? data.slice(0, 11) : data;
    setHotdeals(newData);
  };

  const onTopCategorySuccess = (data: ICat[]) => {
    const placeholder: TCat[] = [];
    data.map((x) => placeholder.push(x.category));
    setTopCategory(placeholder);
  };
  const { data, isLoading: getAllCatLoading } = useGetAllCategories(onSuccess);
  const { data: topCat } = useGetTopCategories(onTopCategorySuccess);
  useGetHotDeals(dealsSuccess);
  const { data: products, isLoading: productLoading } = useGetAllProducts();
  const { data: topProducts, isLoading: topProductLoading } = useGetTopProducts();

  const [stores, setStores] = useState<TSellerStore1[]>([]);
  const [brands, setBrands] = useState<TSellerStore1[]>([]);
  const onStoreSuccess = (data: TSellerStore1[]) => {
    setStores(data);
  };
  const onBrandSuccess = (data: TSellerStore1[]) => {
    setBrands(data);
  };

  useGetBrands(onBrandSuccess);
  useGetAllStores(onStoreSuccess);

  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    // setOpen(false);
    Cookies.set("currentLanguage", i18n.language, { expires: 7, secure: true });
    dispatch(setLanguageModal(false));
    dispatch(setModalCookie(true));
  };

  useEffect(() => {
    setIsClient(true);
    // if (localStorage.getItem("currentLanguage")) {
    if (Cookies.get("currentLanguage")) {
      // setOpen(false);
      dispatch(setLanguageModal(false));
    } else {
      // set default language from browser
      dispatch(setModalCookie(false));
      if (
        languages.some(
          (language) => getLangPlusCountryCode(language) === navigator.language
        )
      ) {
        i18n.changeLanguage(navigator.language);
      } else {
        const broswerLangCode = navigator.language.slice(0, 2);
        const language = languages.find(({ code }) => code === broswerLangCode);
        i18n.changeLanguage(
          language
            ? getLangPlusCountryCode(language)
            : getLangPlusCountryCode(languages[0])
        );
      }
    }
  }, []);

  return isClient ? (
    <>
      <Head>
        <title>{t("pagetitle.Buy_and_sell")}</title>
        <meta
          name="Linconstore | Buy and sell online with ease across Europe and North America"
          content="Find wide range of products to cater for your everyday needs from around the world"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Nav />
      <NextSeo
        title={t("pagetitle.Buy_and_sell")}
        description="Shop diverse range of products in several categories for your everyday use"
      />
      <MainHolder>
        <Stack spacing={0.5}>
          <Typography
            variant={"h5"}
            gutterBottom
            sx={{ fontSize: "15px", fontWeight: "500" }}
          >
            {!topCategory || topCategory?.length === 0
              ? ""
              : t("home.topCategories")}
          </Typography>
          {topCategory?.length > 0 && (
            <Slider data={topCategory} allCat={false} />
          )}
        </Stack>
        <Stack spacing={0.5} mt={2}>
          <Typography
            variant={"h1"}
            gutterBottom
            sx={{ fontSize: "15px", fontWeight: "500" }}
          >
            {!data || data.length === 0 ? "" : t("home.allCategories")}
          </Typography>
          <Slider data={allCategory} allCat={true} />
        </Stack>
        {topProductLoading && <span>{""}</span>}
        <Products
          seller={false}
          hot={false}
          mode={false}
          top={true}
          data={topProducts}
          title={t("home.topProducts")}
          calculateRate={true}
        />
        <Products
          seller={false}
          mode={false}
          top={false}
          hot={false}
          data={products}
          title={t("home.newProducts")}
          calculateRate={true}
        />
        <Products
          top={false}
          hot={true}
          seller={false}
          mode={false}
          title={t("home.hotDeals")}
          data={hotDeals}
          calculateRate={true}
        />
        {stores.length > 0 && <Cards stores={stores} />}
        {brands.length > 0 && <BrandCards brands={brands} />}
        <Dialog
          open={LanguageModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ fontSize: 14 }}>
            {t("language.select_a_language")}
          </DialogTitle>
          <DialogContent>
            <LanguageSelect
              SelectProps={{ MenuProps: { sx: { maxHeight: "30%" } } }}
              onChange={(e) => console.log(e)}
            ></LanguageSelect>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {t("button.ok")}
            </Button>
          </DialogActions>
        </Dialog>
      </MainHolder>
      <Footer />
    </>
  ) : (
    <></>
  );
};

export default Home;
