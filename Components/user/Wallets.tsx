import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import { Add, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import valid from "card-validator";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const schema1 = yup.object().shape({
  name: yup.string().required("This is required").min(4),
  billing: yup.string().required("This is required").min(4),
  card: yup
    .string()
    .test(
      "Test Number",
      "Credit card number is invalid",
      (value) => valid.number(value).isValid
    )
    .required(),
  expiration: yup
    .string()
    .test(
      "Test Expiration",
      "Expiration date not valid",
      (value) => valid.expirationDate(value).isValid
    )
    .required(),
  cvv: yup
    .string()
    .test("Test cvv", "Cvv not valid", (value) => valid.cvv(value).isValid)
    .required(),
});
type addWallet = {
  name: string;
  card: string;
  expiration: string;
  cvv: string;
  billing: string;
};
const Wallets: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const {
    handleSubmit: handlePhoneSubmit,
    control: controlPhone,
    reset: resetPhone,
  } = useForm<addWallet>({
    resolver: yupResolver(schema1),
    mode: "onBlur",
    defaultValues: {
      expiration: "",
      name: "",
      billing: "",
      cvv: "",
      card: "",
    },
  });
  const [addNew, setAddNew] = useState(false);
  const onSubmit: SubmitHandler<addWallet> = async (data) => {
    resetPhone();
    setAddNew(false);
  };
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Wallets")}
          description={"This is where you can manage your wallets "}
          content={"Manage your devices"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/account")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>
                {t("account.wallets.back")}
              </Typography>
            </Stack>
            <Container
              component={"article"}
              maxWidth={"lg"}
              sx={{ p: isMobile ? 1 : 4 }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant={isMobile ? "body1" : "h5"}>
                  {t("account.wallets.title")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      43xxxxx xxx xxx xx05 04/26 xxx{" "}
                    </Typography>
                    <Button
                      variant={"outlined"}
                      size={"small"}
                      color={"inherit"}
                      sx={{ textTransform: "none", maxHeight: "40px" }}
                    >
                      {t("account.wallets.deleteBtn")}
                    </Button>
                  </Stack>
                  <Button
                    variant={"outlined"}
                    disabled={addNew}
                    startIcon={<Add />}
                    onClick={() => setAddNew(true)}
                    size={"small"}
                    color={"inherit"}
                    sx={{
                      maxWidth: 160,
                      textTransform: "none",
                      maxHeight: "40px",
                    }}
                  >
                    {t("account.wallets.addBtn")}
                  </Button>
                  {addNew && (
                    <Grid container>
                      <Grid item xs={12} sm={6}>
                        <Box
                          component={"form"}
                          onSubmit={handlePhoneSubmit(onSubmit)}
                          noValidate
                        >
                          <Controller
                            name="name"
                            control={controlPhone}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.name}
                                field={field}
                                id="Name"
                              />
                            )}
                          />
                          <Controller
                            name="card"
                            control={controlPhone}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.card}
                                field={field}
                                id="Card Number"
                              />
                            )}
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={6} lg={4}>
                              <Controller
                                name="expiration"
                                control={controlPhone}
                                render={({ field, formState: { errors } }) => (
                                  <TextInput
                                    data={errors?.expiration}
                                    field={field}
                                    id="MM/YY"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} lg={4}>
                              <Controller
                                name="cvv"
                                control={controlPhone}
                                render={({ field, formState: { errors } }) => (
                                  <TextInput
                                    data={errors?.cvv}
                                    field={field}
                                    id="cvv"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                          <Controller
                            name="billing"
                            control={controlPhone}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.billing}
                                field={field}
                                id="Billing"
                                multiple={true}
                              />
                            )}
                          />
                          <Button
                            variant={"outlined"}
                            type={"submit"}
                            color={"inherit"}
                            className={"colorReversed"}
                          >
                            {t("account.wallets.saveBtn")}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Wallets;
