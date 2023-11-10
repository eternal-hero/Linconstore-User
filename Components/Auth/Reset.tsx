import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormHelperText,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Holder from "../Wappers/Holder";
import { useResetPassword } from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Image from "next/image";

const schema = yup.object().shape({
  email: yup.string().email().required(),
});
type reset = {
  email: string;
};

export default function ResetPassword() {
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  const { t } = useTranslation();
  const { handleSubmit, control, getValues, reset } = useForm<reset>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });
  const onSuccess = (data: object) => {

  };

  const {
    isLoading,
    isSuccess,
    isError,
    mutate: resetPass,
  } = useResetPassword(onSuccess);

  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset();
    }
  }, [isSuccess, isError]);
  const onSubmit: SubmitHandler<reset> = async (data) => {
    const reset = {
      email: data.email,
    };
    resetPass(reset);
  };
  return (
    <>
      <Holder title={t("pagetitle.Reset_Password")}>
        <Grid container height={isMobile ? "calc(100vh - 106px)" : "calc(100vh - 50px)"}>
          <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
              width={"100%"}
              maxWidth={500}
            >
              <Typography variant={"h5"}>
                {t("account.reset_password.title")}
              </Typography>
              <Controller
                name="email"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextField
                    label={t("account.reset_password.email")}
                    variant="standard"
                    margin={"normal"}
                    fullWidth
                    className={"loginPass"}
                    error={!!errors?.email}
                    helperText={errors?.email?.message}
                    type={"email"}
                    {...field}
                  />
                )}
              />
              <Stack spacing={1}>
                <Button
                  className={"buttonClass"}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                >
                  {isLoading && <CircularProgress />}
                  {t("account.reset_password.btnTitle")}
                </Button>
                <Box>
                  {isError && (
                    <FormHelperText sx={{ color: "red" }}>
                      {t("account.reset_password.error_msg")}
                    </FormHelperText>
                  )}
                </Box>
              </Stack>


              {isSuccess && (
                <Typography variant={"body2"}>
                  {" "}
                  {t("account.reset_password.success_msg")}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={0}
            sx={{ display: { xs: "none", sm: "flex" } }}
            sm={5}
            bgcolor={'white'}
            display={"flex"}
            justifyContent={"end"}
          >
            <Box width={"100%"} height={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
              <Image
                width={400}
                height={400}
                style={{ marginTop: 30, width: "100%", height: "100%" }}
                placeholder="blur"
                blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/ix9c4kduwp2avxbergry"}
                alt={"image of Happy"}
              />
            </Box>
          </Grid>
        </Grid>
      </Holder>
    </>
  );
}
