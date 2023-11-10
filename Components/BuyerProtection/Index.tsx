import React from "react";
import { Card, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import { VerifiedUser } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";
import ContentHeader from "../Utils/contentHeader";
import Footer from "../Layouts/Footer";

const BuyerProtection: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Buyers_Protection")}
          description={"Learn about how your purchases are protected on Linconstore"}
          content={"buyers protection for linconstore"}
        >
          <ContentHeader
            title={t("buyerProtection.title")}
            paths={[t("buyerProtection.home"), t("footer.Buyer")]}
            iconComponent={<VerifiedUser sx={{color: "var(--primary)"}} />} 
            routePath="/"
          />
          <Container component={"main"} maxWidth={"lg"} sx={{py: 5}}>
            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={"body1"}>
                {t("buyerProtection.description1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.description2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question1")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer1")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("buyerProtection.question2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question3")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question4")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer4")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question5")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer5")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question6")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer6")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 3 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.noteTitle")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.note1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note3")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note4")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("buyerProtection.datePost")}
              </Typography>
            </Stack>
          </Container>

          <Footer />
        </Wrapper>
      </Card>
    </>
  );
};
export default BuyerProtection;
