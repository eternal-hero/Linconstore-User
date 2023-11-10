import { NextPage } from "next";
import Work from "../../Components/Work/Index";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const WorkPage: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title> {t("pagetitle.Career_Opportunities")} </title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title={t("pagetitle.Work_with")}
        description="Join the team at Linconstore"
      />
      <Work />
    </>
  );
};
export default WorkPage;
