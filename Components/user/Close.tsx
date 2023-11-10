import React, { useContext, useEffect } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
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
import { closeAccountDefaultValue } from "../../Helpers/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import { useCloseUserAccount } from "../../hooks/useDataFetch";
import ContextApi from "../../Store/context/ContextApi";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";

const CloseAccount: React.FC = () => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    reason: yup.string().required(t("account.close.reason_require")).min(3),
    comment: yup.string().required(t("account.close.comment-require")).min(4),
  });
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<closeAccountDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      reason: "",
      comment: "",
    },
  });
  const onSubmit: SubmitHandler<closeAccountDefaultValue> = async (data) => {
    const { reason, comment } = data;
    const newData = {
      reason,
      comment,
    };
    deleteUser(newData);
  };
  const handleLogouts = useContext(ContextApi).handleLogout;
  const handleLogout = () => {
    handleLogouts();
    router.push("/login");
  };
  const dispatch = useDispatch();
  const onSuccess = () => {
    dispatch(
      snackBarOpen({
        message: t("account.close.success_message"),
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
    reset();
    handleLogout();
  };
  const {
    isLoading,
    mutate: deleteUser,
    isError,
  } = useCloseUserAccount(onSuccess);
  useEffect(() => {
    if (isError) {
      dispatch(
        snackBarOpen({
          message: t("account.close.error_message"),
          snackbarOpen: true,
          severity: "warning",
          rate: 0,
          sellerRate: 0,
        })
      );
    }
  }, [isError]);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card
        elevation={0}
        sx={{
          borderRadius: "0px",
          minHeight: "100vh",
        }}
      >
        <Wrapper title={t("pagetitle.Close_Account")} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography
                  variant={"h5"}
                  fontSize={15}
                >
                  {t("account.close.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container
              component={"article"}
              maxWidth={"md"}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant={"body1"} sx={{ my: 2 }} fontSize={14}>
                  {t("account.close.description")}
                </Typography>
                <Box
                  component={"form"}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  sx={{ width: "100%" }}
                >
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-label" shrink={false} sx={{fontSize: 14}}>
                      {watch("reason") === "" && t("account.close.select_list")}
                    </InputLabel>
                    <Controller
                      name="reason"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          {...field}
                          variant={"outlined"}
                          className={"sortButton"}
                          sx={{
                            bgcolor: "#fff",
                            color: "#000",
                            backgroundColor: "transparent",
                            fontSize: 14,
                            "& .MuiSvgIcon-root": { color: "black" },
                          }}
                        >
                          <MenuItem value={t("account.close.reasonOpt1")} sx={{fontSize: 14}}>
                            {t("account.close.reasonOpt1")}
                          </MenuItem>
                          <MenuItem value={t("account.close.reasonOpt2")} sx={{fontSize: 14}}>
                            {t("account.close.reasonOpt2")}
                          </MenuItem>
                          <MenuItem value={t("account.close.reasonOpt3")} sx={{fontSize: 14}}>
                            {t("account.close.reasonOpt3")}
                          </MenuItem>
                          <MenuItem value={t("account.close.reasonOpt4")} sx={{fontSize: 14}}>
                            {t("account.close.reasonOpt4")}
                          </MenuItem>
                        </Select>
                      )}
                    />

                    <FormHelperText sx={{ color: "red" }}>
                      {errors?.reason?.message}
                    </FormHelperText>
                  </FormControl>
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <TextInput
                        data={errors?.comment}
                        field={field}
                        id={t("account.close.comment")}
                        multiple={true}
                      />
                    )}
                  />

                  <Button
                    variant={"outlined"}
                    type={"submit"}
                    color={"inherit"}
                    className={"colorReversed"}
                    sx={{ width: "fit-content", }}
                  >
                    {t("account.close.btnTxt")}
                    {isLoading && <CircularProgress />}
                  </Button>
                </Box>
              </Box>
            </Container>
            <Stack mt={5}>
              <Box
                width={isMobile ? 150 : "100%"}
                height={isMobile ? 50 : 150}
                className={"storeLogo"}
                sx={{backgroundClip: "white"}}
              />
            </Stack>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default CloseAccount;
