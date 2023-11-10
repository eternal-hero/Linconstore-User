import * as React from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { createUserDefaultValue } from "../../Helpers/Types";
import Holder from "../Wappers/Holder";
import VerifyPage from "./Verify";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import Image from "next/image";
import { useRegister } from "../../hooks/useDataFetch";
import { restrictedPasswords } from "../../Data/placeholder";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import RegisterStepOne from "./RegisterStep1";
import { languages } from "../../config/i18n";
import { handleRateCountryChange } from "../../Helpers/Exchange";

export default function RegisterPage() {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    email: yup.string().email().required(t("register.email_is_a_required_field")),
    password: yup
      .string()
      .required(t("register.password_is_a_required_field"))
      .min(8)
      .test("Password", t("register.your_password_is_weak"), (value) => {
        if (value) {
          return !restrictedPasswords.includes(value);
        }
      }),
    firstName: yup.string().required(t("register.firstName_is_a_required_field")).min(2),
    lastName: yup.string().required(t("register.lastName_is_a_required_field")).min(2),
    terms: yup.bool().oneOf([true], t("register.you_must_accept_terms_and_condition")),
  });
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<createUserDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      lastName: "",
      firstName: "",
      password: "",
      terms: false,
    },
  });
  const router = useRouter();
  const onSuccess = (data: any) => {
    setVerifyEmail(true);
    setEmail(data.user.email);
  };
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isStepOne, setIsStepOne] = useState<boolean>(true);
  const {
    isLoading,
    mutate: register,
    isError,
    isSuccess,
  } = useRegister(onSuccess);
  const [verifyEmail, setVerifyEmail] = React.useState<boolean>(false);
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<createUserDefaultValue> = async (data) => {
    const currency: any = await handleRateCountryChange(country)
    const tmpLang = languages.find(({ code, country }) => country?.toLowerCase() === currency.code?.toLowerCase() || code?.toLowerCase() === currency.code?.toLowerCase());
    const language = tmpLang?.code ?? localStorage.getItem("currentLanguage");
    const registerData = {
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      phone: phoneNumber,
      lastName: data.lastName,
      country: country,
      currency: currency.label,
      language: language,
    };
    register(registerData);
  };

  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <>
      {!verifyEmail && (
        <Holder title={t("pagetitle.Register")}>
          <Grid container height={isMobile ? "calc(100vh - 106px)" : "calc(100vh - 50px)"}>
            <Grid
              item
              xs={12}
              sx={{ display: { xs: "none", sm: "flex" } }}
              sm={5}
              height={"calc(100vh - 50px)"}
              width={"100%"}
              bgcolor={'white'}
            >
              <Box width={"100%"} height={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Image
                  width={400}
                  height={400}
                  style={{ marginTop: 30, width: "40%", height: "100%" }}
                  placeholder="blur"
                  blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                  src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/xfbxgm2w8g5v2skmbe4q"}
                  alt={"image of login"}
                />
              </Box>
            </Grid>
            {isStepOne ? (
              <RegisterStepOne
                onCompleted={(value) => {
                  setPhoneNumber(value.phone);
                  setCountry(value.country);
                  setIsStepOne(false);
                }}
              />
            ) : (
              <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                <Box
                  component="form"
                  maxWidth={600}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  sx={{ mt: 1, mb: 2 }}
                >
                  <Typography variant={"h5"}>{t("register.title")}</Typography>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <TextField
                        label={t("register.first_name")}
                        variant="standard"
                        margin={"normal"}
                        fullWidth
                        className={"loginPass"}
                        error={!!errors?.firstName}
                        helperText={errors?.firstName?.message}
                        type={"text"}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <TextField
                        label={t("register.last_name")}
                        variant="standard"
                        margin={"normal"}
                        fullWidth
                        className={"loginPass"}
                        error={!!errors?.lastName}
                        helperText={errors?.lastName?.message}
                        type={"text"}
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <TextField
                        label={t("register.email")}
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
                        label={t("register.password")}
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
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={"terms"}
                    render={({
                      field: { onChange, value },
                      formState: { errors },
                    }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            required={true}
                            color="primary"
                            aria-required={true}
                            defaultChecked={value}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        }
                        aria-required={true}
                        label={
                          <Typography>
                            {t("register.accept_title")}{" "}
                            <u>
                              <Link href={"/terms"}>
                                <a target="_blank" rel="terms_link">
                                  {t("register.accept_link")}
                                </a>
                              </Link>
                            </u>
                          </Typography>
                        }
                      />
                    )}
                  />
                  {errors?.terms && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors?.terms?.message}
                    </FormHelperText>
                  )}
                  <Button
                    disabled={isLoading}
                    className={"buttonClass"}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                  >
                    {isLoading && <CircularProgress />}
                    {t("register.btnTitle")}
                  </Button>

                  <Grid container>
                    <Grid item>
                      <u>
                        <Link href="/login">{t("register.signIn")}</Link>
                      </u>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Holder>
      )}
      {verifyEmail && (
        <VerifyPage email={email} setVerifyEmail={setVerifyEmail} />
      )}
    </>
  );
}
