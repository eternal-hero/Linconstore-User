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
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { loginUserDefaultValue } from "../../Helpers/Types";
import Holder from "../Wappers/Holder";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";
import { useGetSellerStatus, useLoginUser } from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { insertTokenAndUserInfo } from "../../Store/Auth";
import ContextApi from "../../Store/context/ContextApi";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import socket, { SOCKET_CHANNELS } from "../../Helpers/socket";
import Cookies from "js-cookie";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});
interface IData {
  data: string;
  storeId: string;
}
export default function LoginPage() {
  const { i18n, t } = useTranslation();
  const { handleSubmit, control, getValues, reset } =
    useForm<loginUserDefaultValue>({
      resolver: yupResolver(schema),
      mode: "onBlur",
      defaultValues: {
        email: "",
        password: "",
      },
    });
  const router = useRouter();
  const dispatch = useDispatch();
  const handleName = useContext(ContextApi).handleName;
  const handleRole = useContext(ContextApi).handleRole;
  const [isLoggined, setIsLoggedIn] = useState<boolean>(false);
  const { pathname, asPath, query } = router;

  const onSuccess = (data: any) => {
    setIsLoggedIn(true);
    dispatch(
      insertTokenAndUserInfo({ token: data.token, userInfo: data.user })
    );

    localStorage.setItem("currentLanguage", data.user.language);
    localStorage.setItem("userIpCountry", data.user.country);
    i18n.changeLanguage(data.user.language);
    Cookies.set("token", data.token, { expires: 3, secure: true });
    Cookies.set("role", data.user.role, { expires: 3, secure: true });
    Cookies.set("seller", data.seller, { expires: 3, secure: true });
    Cookies.set("userInfo", JSON.stringify(data.user), { expires: 3, secure: true });

    socket.emit(SOCKET_CHANNELS.JOIN, { userInfo: data.user });
    Cookies.set("usf", JSON.stringify(data.user.following), { expires: 3, secure: true });

    handleName(data.user.firstName);
    handleRole(data.user.role);
    router.push({ pathname, query }, asPath, { locale: data.user.language })

  };
  const handleSeller = useContext(ContextApi).handleIsSeller;
  const onSellerStatus = (data: IData) => {
    const myData = data.data;
    if (myData === "incomplete") {
      Cookies.set("status", "inComplete", { expires: 3, secure: true  });
    }
    if (myData === "seller") {
      handleSeller();
      Cookies.set("storeId", data.storeId, { expires: 3, secure: true  });
      Cookies.set("status", "seller", { expires: 3, secure: true  });
    }
    if (myData === "invalid") {
      Cookies.set("status", "invalid", { expires: 3, secure: true  });
    }
    if (isLoggined) {
      setIsLoggedIn(false);
      router.back();
    }
  };
  const { refetch } = useGetSellerStatus(onSellerStatus);
  const {
    isLoading,
    isSuccess,
    isError,
    mutate: loginUser,
    error,
  } = useLoginUser(onSuccess);
  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset({
        ...getValues(),
        password: "",
      });
    }
  }, [isSuccess, isError]);
  useEffect(() => {
    if (isError) {
      if (error?.response?.status === 402) {
        dispatch(
          snackBarOpen({
            message: "This account has been deleted",
            snackbarOpen: true,
            severity: "warning",
            rate: 0,
            sellerRate: 0,
          })
        );
      }
    }
  }, [isError]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onSubmit: SubmitHandler<loginUserDefaultValue> = async (data) => {
    const signInData = {
      password: data.password,
      email: data.email,
    };
    loginUser(signInData);
  };

  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <>
      <Holder title={t("pagetitle.Login")}>
        <Grid container height={isMobile ? "calc(100vh - 106px)" : "calc(100vh - 50px)"}>
          <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography variant={"h5"}>{t("login.title")}</Typography>
              <Controller
                name="email"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextField
                    label={t("login.email")}
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
              <Controller
                control={control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    label={t("login.password")}
                    variant="standard"
                    margin={"normal"}
                    fullWidth
                    className={"loginPass"}
                    error={!!errors?.password}
                    helperText={errors?.password?.message}
                    type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                    {...field}
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Stack spacing={1}>
                {isError && (
                  <FormHelperText sx={{ color: "red" }}>
                    {t("login.error_msg")}
                  </FormHelperText>
                )}
                <Button
                  className={"buttonClass"}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                >
                  {isLoading && (
                    <CircularProgress
                      aria-describedby={"progress bar"}
                    />
                  )}
                  {t("login.btnTitle")}
                </Button>
                <Grid container>
                  <Grid item xs={12} md={8} sx={{ color: "text.secondary" }}>
                    <Link href="/register">
                      <Stack
                        direction={"row"}
                        spacing={2}
                      >
                        <Typography variant={"subtitle2"} gutterBottom>
                          {t("login.question")}
                        </Typography>
                        <Typography
                          variant={"subtitle2"}
                          className={"pointer"}
                          color={"primary"}
                        >
                          {t("login.signUp")}
                        </Typography>
                      </Stack>
                    </Link>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Link href="/account/reset">
                      <Typography
                        variant={"subtitle2"}
                        sx={{ alignSelf: "flex-end" }}
                        className={"pointer"}
                        color={"primary"}
                      >
                        {t("login.forgot_password")}
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Stack>
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
                src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/xfbxgm2w8g5v2skmbe4q"}
                alt={"image of Happy"}
              />
            </Box>
          </Grid>
        </Grid>
      </Holder>
    </>
  );
}
