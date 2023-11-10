import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, FormHelperText, Grid, Stack } from "@mui/material";
import ReactInputVerificationCode from "react-input-verification-code";
import styled from "styled-components";
import { ArrowBack } from "@mui/icons-material";
import GenNav from "../Layouts/GenNav";
import { useVerifyAdmin } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../Store/Auth";
import ContextApi from "../../Store/context/ContextApi";
import Cookies from "js-cookie";

type TVerify = {
  token: string;
  adminVerify: any;
};
interface Iverify {
  isInvalid: boolean;
}
interface IverifyProps {
  setAdminVerify: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}
const StyledReactInputVerificationCode = styled.div`
  display: flex;
  justify-content: center;

  --ReactInputVerificationCode-itemWidth: 50px;
  --ReactInputVerificationCode-itemHeight: 58px;
  --ReactInputVerificationCode-itemSpacing: 20px;

  .ReactInputVerificationCode__item {
    font-size: 16px;
    font-weight: 500;
    color: black;
    background: #fff;
    border: 2px solid
      ${({ isInvalid }: Iverify) =>
    isInvalid ? "#EF6C65" : "rgba(28, 30, 60, 0.4)"};
    box-shadow: none;
  }

  .ReactInputVerificationCode__item.is-active {
    box-shadow: none;
    border: 1px solid #36c6d9;
  }
`;
const AdminVerify: React.JSXElementConstructor<IverifyProps> = ({
  setAdminVerify,
  email,
}) => {
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState<boolean | null>();
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onVerifySuccess = useContext(ContextApi).onAdminLogin;
  const onSuccess = (data: TVerify) => {
    onVerifySuccess();
    Cookies.set("adminToken", data.token, { expires: 3, secure: true  });
    Cookies.set("adminInfo", JSON.stringify(data.adminVerify), { expires: 3, secure: true  });
    dispatch(loginAdmin({ token: data.token }));
    router.push("/admin");
  };
  const {
    mutate: verifyAdmin,
    isError,
    error: verifyError,
    isLoading,
  } = useVerifyAdmin(onSuccess);
  const handleVerifyData = useCallback(async (otp: string) => {
    const data = {
      otp,
      email,
    };
    verifyAdmin(data);
  }, []);
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    if (verifyError instanceof Error) {
      // @ts-ignore
      setErrorMessage(verifyError?.response?.data?.status);
    }
  }, []);
  return (
    <>
      <GenNav admin={false} mode={false} />
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          <span className={"arrowBack"} onClick={() => setAdminVerify(false)}>
            <ArrowBack />
          </span>
        </Stack>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container>
            <Grid item xs={0} sm={3} />

            <Grid item xs={12} sm={6}>
              <Typography textAlign={"center"} component="h1" variant="h4">
                Authenticate Login
              </Typography>
              <Typography
                component="p"
                textAlign={"center"}
                mx={2}
                variant="subtitle1"
                alignItems={"center"}
              >
                Enter the code sent to your email
              </Typography>
              <Typography
                component="h1"
                mx={2}
                mb={1}
                variant="subtitle1"
                alignItems={"center"}
              >
                Please Input code below.
              </Typography>
              <StyledReactInputVerificationCode isInvalid={isValid}>
                <ReactInputVerificationCode
                  value={value}
                  placeholder={""}
                  length={6}
                  onCompleted={(data) => handleVerifyData(data)}
                  onChange={(newValue) => {
                    setValue(newValue);

                    if (newValue !== "") {
                      setError(null);
                    }
                  }}
                />
              </StyledReactInputVerificationCode>
              {isError && (
                <FormHelperText sx={{ color: "red" }}>
                  {" "}
                  {errorMessage}{" "}
                </FormHelperText>
              )}
              <Button
                className={"buttonClass"}
                variant="contained"
                fullWidth
                type="submit"
                onClick={() => {
                  setIsValid(true);
                  setTimeout(() => {
                    setIsValid(false);
                  }, 1000);
                }}
                sx={{ mt: 5, mb: 2, backgroundColor: "#00a859" }}
              >
                Confirm {isLoading && <CircularProgress />}
              </Button>
            </Grid>
            <Grid item xs={0} sm={3} />
          </Grid>
        </Box>
      </Container>
    </>
  );
};
export default AdminVerify;
