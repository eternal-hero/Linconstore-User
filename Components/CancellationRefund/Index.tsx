import React from "react";
import { Card, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import { DoDisturb } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const CancellationRefund: React.FC = () => {
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
            title={t("cancellationRefund.title")}
            paths={[t("cancellationRefund.home"), t("footer.Refund")]}
            iconComponent={<DoDisturb sx={{color: "var(--primary)"}} />}
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cancellationRefund.description1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.description2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer1_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer1_2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_3")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_4")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_5")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_6")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_7")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question3")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question4")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question5")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_2")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_3")}
              </Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default CancellationRefund;
