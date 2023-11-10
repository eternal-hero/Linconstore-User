"use client";
import { NextPage } from "next";
import LoginPage from "../Components/Auth/Login";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useContext } from "react";
import ContextApi from "../Store/context/ContextApi";
import { useRouter } from "next/router";
import LanguageModalComponet from "../Components/LanguageModal";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const Login: NextPage = () => {
  const { t } = useTranslation();
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  if (isLoggedIn) {
    router.push("/");
    return;
  }
  const isSelectedLanaguage = Cookies.get("currentLanguage");
  return (
    <>
      <Head>
        <title>{t("pagetitle.Sign_in")}</title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title={t("pagetitle.Buy_and_sell")}
        description="Shop a diverse range of products in different categories for your everyday use!"
      />
      <LoginPage />
      {!isSelectedLanaguage?<LanguageModalComponet />: ""}
    </>
  );
};

export default Login;
