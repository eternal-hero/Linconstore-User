import { NextPage } from "next";
import RegisterPage from "../Components/Auth/Register";
import { NextSeo } from "next-seo";
import Head from "next/head";
import LanguageModalComponet from "../Components/LanguageModal";
import { useTranslation } from "react-i18next";

const Register: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title> {t("pagetitle.Create_new")} </title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title={t("pagetitle.Buy_and_sell")}
        description="Shop a diverse range of products in several categories for your everyday use!"
      />
      <RegisterPage />
      <LanguageModalComponet/>
    </>
  );
};

export default Register;
