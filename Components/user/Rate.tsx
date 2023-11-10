import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import {
  SentimentSatisfiedAltOutlined,
  SentimentVeryDissatisfiedOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import { useEffect, useState } from "react";
import GenNav from "../Layouts/GenNav";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { usePostUserExperience } from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';
const schema = yup.object().shape({
  feedback: yup.string().required().min(8),
});

interface IRate {
  feedback: string;
}
export default function RateExperience() {
  const { i18n, t } = useTranslation();
  const isMobile: boolean = useMediaQuery("(max-width : 300px)");
  const { handleSubmit, control, getValues, reset } = useForm<IRate>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      feedback: "",
    },
  });
  const router = useRouter();
  const [happy, setHappy] = useState(false);
  const [sad, setSad] = useState(false);

  const dispatch = useDispatch();
  const onSubmit: SubmitHandler<IRate> = async (data) => {
    const { feedback } = data;
    const newData = {
      message: feedback,
    };
    sendFeedback(newData);
  };
  const onSuccess = () => {
    dispatch(
      snackBarOpen({
        message: "feedback sent successfully",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    reset();
  };
  
  const currentLanguage = localStorage.getItem("currentLanguage");
  
  const {
    isError,
    isLoading,
    mutate: sendFeedback,
  } = usePostUserExperience(onSuccess);
  useEffect(() => {
    if (isError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong",
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, [isError]);
  return (
    <>
      <GenNav admin={false} mode={false} />
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // height: 600,
            // justifyContent: 'center'
          }}
        >
          <Grid container mt={4} spacing={1}>
            <Grid item xs={0} sm={6}>
              <Grid container direction={"column"} spacing={2}>
                <Grid item xs={2}>
                  <Typography textAlign={"center"} variant={"h6"}>
                    {t("account.rate.success_msg")}
                  </Typography>
                </Grid>
                <Grid item xs={8} sx={{ my: 1 }}>
                  <Image
                    width={450}
                    height={350}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/apg0ktqfrw15xrtbe0dd"}
                    alt={"icon of confetti"}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    textAlign={"center"}
                    variant={isMobile ? "subtitle2" : "body1"}
                  >
                    <i>{t("account.rate.info_msg")}</i>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1 }}
              >
                <Stack spacing={5}>
                  <Typography textAlign={"center"} variant={"h6"}>
                    <i> {t("account.rate.ques1")} </i>
                  </Typography>
                  <Stack
                    direction={"row"}
                    spacing={10}
                    sx={{
                      mx: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SentimentSatisfiedAltOutlined
                      fontSize={"large"}
                      className={"pointer"}
                      onClick={() => setHappy((prevState) => !prevState)}
                      sx={{ color: happy ? "green" : "inherit" }}
                    />
                    <SentimentVeryDissatisfiedOutlined
                      fontSize={"large"}
                      className={"pointer"}
                      onClick={() => setSad((prevState) => !prevState)}
                      sx={{ color: sad ? "red" : "inherit" }}
                    />
                  </Stack>
                  <Stack>
                    <Controller
                      name="feedback"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          multiline
                          rows={5}
                          variant={"outlined"}
                          error={!!errors?.feedback}
                          helperText={errors?.feedback?.message}
                          {...field}
                          type={"text"}
                          label={"Feedback"}
                          name={"Feedback"}
                        />
                      )}
                    />
                    <Button
                      disabled={isLoading}
                      className={"buttonClass"}
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                    >
                      {isLoading && <CircularProgress />}
                      {t("account.rate.btn_submit")}
                    </Button>
                  </Stack>
                </Stack>
                {/*{loginLoading && <Loader/>}*/}
                {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}

                <Stack sx={{ mt: 4 }}>
                  <Button
                    // disabled={isLoading}
                    className={"buttonClass"}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                    onClick={() => {
                      Cookies.set("currentLanguage", currentLanguage, {expires:7, secure: true});
                      router.push("/")
                      localStorage.removeItem("address")
                    }}
                  >
                    {/*{isLoading && <CircularProgress/>}*/}
                    {t("account.rate.btn_return")}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
