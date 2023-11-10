import React from "react";
import { Card, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import { Handshake } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const SellerAgreement: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Cancellation_Refund_Return")}
          description={
            "Learn about Cancellation, Refund, and Return Policy when you purchase an item on Linconstore"
          }
          content={"Cancellation, Refund, and Return Policy | linconstore"}
        >
          <ContentHeader 
            title={t("seller.verify.term.title")}
            paths={[t("about.ArrowBackTitle"), t("footer.Sellers_agreement")]}
            iconComponent={<Handshake sx={{color: "var(--primary)"}} />}
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("selleragreement.s1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s3")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s4")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b3")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s5")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b4")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s6")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b5")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s7")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b6")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s8")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b7")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s9")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b8")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s10")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b9")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s11")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b10")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s12")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("selleragreement.b11")}
              </Typography>

              <Typography variant={"body1"}>
                {t("selleragreement.s13")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("selleragreement.s14", { date: "December 30, 2022" })}
              </Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default SellerAgreement;