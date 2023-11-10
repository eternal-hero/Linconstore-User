import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import GenNav from "../Layouts/GenNav";
import {
  useChangeUserPassword,
  useChangeUserPhone,
  useGetUser,
} from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import PhoneNumberInput from "../Form/PhoneNumberInput";

type changePassword = {
  password: string;
  new_password: string;
};
type addPhone = {
  phone: string;
};
const Security: React.FC = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    password: yup.string().required(t("account.Security.this_is_required")).min(6, t("account.Security.password_must_be_at_least_6_characters")),
    new_password: yup.string().required(t("account.Security.this_is_required")).min(6, t("account.Security.new_password_must_be_at_least_6_characters")),
  });
  const schema1 = yup.object().shape({
    phone: yup
      .string()
      .typeError(t("account.Security.must_be_a_number"))
      .required(t("account.Security.this_is_required"))
  });

  const { handleSubmit, control, reset } = useForm<changePassword>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      new_password: "",
    },
  });
  const onSubmit: SubmitHandler<changePassword> = async (data) => {
    const { password, new_password } = data;
    const newData = {
      oldPassword: password,
      newPassword: new_password,
    };
    updatePassword(newData);
  };
  const dispatch = useDispatch();
  const onSuccess = () => {
    reset();
    dispatch(
      snackBarOpen({
        message: t("account.Security.password_successfully_updated"),
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setChangePassword(false);
  };
  const {
    mutate: updatePassword,
    isError,
    isLoading,
  } = useChangeUserPassword(onSuccess);
  const [changePassword, setChangePassword] = useState(false);
  const [addPhone, setAddPhone] = useState(false);
  const { data, isLoading: isGetting, refetch } = useGetUser();

  const {
    handleSubmit: handlePhoneSubmit,
    control: controlPhone,
    reset: resetPhone,
  } = useForm<addPhone>({
    resolver: yupResolver(schema1),
    mode: "onBlur",
    defaultValues: {
      phone: "+",
    },
  });
  const addPhoneHandler: SubmitHandler<addPhone> = async (data) => {
    updatePhone(data);
  };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 400px)");
  const onAddPhoneSuccess = () => {
    resetPhone();
    refetch();
    dispatch(
      snackBarOpen({
        message: t("account.Security.phone_successfully_updated"),
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
    setAddPhone(false);
  };
  const {
    mutate: updatePhone,
    isError: phoneIsError,
    isLoading: isUpdating,
  } = useChangeUserPhone(onAddPhoneSuccess);
  const router = useRouter();
  useEffect(() => {
    if (isError || phoneIsError) {
      dispatch(
        snackBarOpen({
          message: t("account.reset_password.error_msg"),
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, [isError, phoneIsError]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper title={t("pagetitle.Security")} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"} alignItems={"center"} mb={10}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                  color="success"
                />
                <Typography variant={"h5"} fontSize={15}>
                  {t("account.Security.title")}
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ p: 2, width: "100%", border: "1px solid #c3c3c3" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box display='flex' flexDirection='column' mb={5} pl={2}>
                  <Typography fontSize={14} mb={2}>{t("account.Security.email")} :</Typography>
                  <Typography fontSize={14}>{data?.email}</Typography>
                </Box>
                
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    p: 2,
                    justifyContent: "space-between",
                    border: "1px solid #c3c3c3",
                    mb: 3,
                  }}
                >
                  <Box display='flex' flexDirection='column'>
                    <Typography fontSize={14} mb={2}>{t("account.Security.phone")}:</Typography>
                    <Typography>{data?.phone}</Typography>
                  </Box>
                  {!addPhone && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{fontSize: 12, fontWeight: 400}}
                      onClick={() => setAddPhone(true)}
                    >
                      {t("account.Security.btn_edit")}
                    </Button>
                  )}
                </Stack>
                {addPhone && (
                  <Box
                    component={"form"}
                    onSubmit={handlePhoneSubmit(addPhoneHandler)}
                    noValidate
                  >
                    <Controller
                      name="phone"
                      control={controlPhone}
                      render={({ field, formState: { errors } }) => (
                        <PhoneNumberInput
                            control={controlPhone}
                            label={t("register.phone_number")}
                            name="phone"
                            isActive={"true"}
                            error={errors?.phone?.message}
                          />
                        
                      )}
                    />
                    <Button
                      variant={"outlined"}
                      type={"submit"}
                      color={"inherit"}
                      className={"colorReversed"}
                      disabled={isUpdating}
                      sx={{my: 2, fontSize: 14, fontWeight: 500}}
                    >
                      {isUpdating && <CircularProgress />}{" "}
                      {t("account.Security.btn_add")}
                    </Button>
                  </Box>
                )}
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: isMatches ? "column" : "row",
                    p: 2,
                    justifyContent: "space-between",
                    border: "1px solid #c3c3c3"
                  }}
                >
                  <Box display='flex' flexDirection='column'>
                    <Typography fontSize={14} mb={2}>{t("account.Security.password")} : </Typography>
                    <Typography fontSize={14}>**********</Typography>
                  </Box>
                  {!changePassword && (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{px: 5, fontSize: 12, fontWeight: 400}}
                      onClick={() => setChangePassword(true)}
                    >
                      {t("account.Security.btn_edit")}
                    </Button>
                  )}
                </Stack>
                {changePassword && (
                  <Box
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          data={errors?.password}
                          field={field}
                          id={t("account.Security.current_password")}
                          type={"password"}
                        />
                      )}
                    />
                    <Controller
                      name="new_password"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          data={errors?.new_password}
                          id={t("account.Security.new_password")}
                          field={field}
                          type={"password"}
                        />
                      )}
                    />
                    <Button
                      variant={"outlined"}
                      type={"submit"}
                      color={"inherit"}
                      className={"colorReversed"}
                      disabled={isLoading}
                    >
                      {isLoading && <CircularProgress />}
                      {t("account.Security.btn_change")}
                    </Button>
                  </Box>
                )}
                {/*<Typography variant={'h6'}> 2fa verification  </Typography>*/}
                {/*<Stack sx={{display: 'flex', flexDirection: 'row',p:2, justifyContent: 'space-between'}}>*/}
                {/*    <Typography variant={isMobile ? 'body1' : 'h6'}> Request verification code on every sign in </Typography>*/}
                {/*    <Switch/>*/}
                {/*</Stack>*/}
                {/*<Stack sx={{display: 'flex', flexDirection: 'row',p:2, justifyContent: 'space-between'}}>*/}
                {/*    <Typography variant={isMobile ? 'body1' : 'h6'}> Request verification code to  access wallet </Typography>*/}
                {/*    <Switch/>*/}
                {/*</Stack>*/}
              </Box>
            </Box>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Security;
