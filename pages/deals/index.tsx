import { NextPage } from "next";
import Deals from "../../Components/Deals/Hotdeals";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const HotDeals: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("pagetitle.Find_discounted_products")}</title>
        <meta
          name="description"
          content="Find a wide range of discounted products"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title={t("pagetitle.Buy_and_sell")}
        description="Shop a wide range of discounted deals here "
      />
      <Deals />
    </>
  );
};

export default HotDeals;
