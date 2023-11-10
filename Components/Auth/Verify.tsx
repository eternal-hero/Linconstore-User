import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { CircularProgress, FormHelperText, Grid, Stack, useMediaQuery } from "@mui/material";
import ReactInputVerificationCode from "react-input-verification-code";
import styled from "styled-components";
import Image from "next/image";
import { useResendOtp, useVerifySignup } from "../../hooks/useDataFetch";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Holder from "../Wappers/Holder";

interface Iverify {
  isInvalid: boolean;
}
interface IverifyProps {
  setVerifyEmail: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}
const StyledReactInputVerificationCode = styled.div`
  display: flex;
  justify-content: center;

  --ReactInputVerificationCode-itemWidth: 50px;
  --ReactInputVerificationCode-itemHeight: 58px;
  --ReactInputVerificationCode-itemSpacing: 8px;

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
const VerifyPage: React.JSXElementConstructor<IverifyProps> = ({
  setVerifyEmail,
  email,
}) => {
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState<boolean | null>();
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();
  const onSuccess = (data: any) => {
    router.back();
  };
  const { isLoading, isError, mutate: verifyUSer } = useVerifySignup(onSuccess);
  const [isValid, setIsValid] = React.useState<boolean>(isError);
  useEffect(() => {
    setIsValid(isError);
  }, [isError]);
  const verifyUser = useCallback(async (value: string) => {
    const data = {
      otp: value,
      email,
    };
    setValue("");
    verifyUSer(data);
  }, []);
  const onResendSuccess = () => {

  }
  const { isLoading: resending, mutate: resendOtp, isSuccess } = useResendOtp(onResendSuccess)
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (isButtonDisabled) {
      const timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isButtonDisabled]);

  const resendOtpCode = useCallback(() => {
    setIsButtonDisabled(true);
    const data = {
      email
    }
    resendOtp(data)
  }, [])

  

  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <>
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
          <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
            <Stack>
              <Typography textAlign={"center"} component="h1" variant="h4">
                {t("verify_email.title")}
              </Typography>
              <Typography
                component="p"
                textAlign={"center"}
                mx={2}
                variant="subtitle1"
                alignItems={"center"}
              >
                {t("verify_email.content")} {email}
              </Typography>
              <Typography
                component="h1"
                mx={2}
                mb={1}
                variant="subtitle1"
                alignItems={"center"}
              >
                {t("verify_email.alert_text")}

                <Button style={{
                  textTransform: 'none',
                  textDecoration: 'underline',
                  color: isButtonDisabled?'gray': 'blue',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }} onClick={resendOtpCode} variant={'outlined'} size={'small'} disabled={isButtonDisabled} > {t("verify_email.resend")}  </Button>  {resending && <CircularProgress />}
              </Typography>
              {isSuccess && <FormHelperText sx={{ textAlign: 'center' }}> Resent Successfully</FormHelperText>}
              <StyledReactInputVerificationCode isInvalid={isValid}>
                <ReactInputVerificationCode
                  value={value}
                  placeholder={""}
                  length={6}
                  onCompleted={(data) => verifyUser(data)}
                  onChange={(newValue) => {
                    setValue(newValue);
                    if (newValue !== "") {
                      setError(null);
                    }
                  }}
                />
              </StyledReactInputVerificationCode>
              <Button
                disabled={isLoading}
                className={"buttonClass"}
                variant="contained"
                fullWidth
                type="submit"
                onClick={() => {
                  setTimeout(() => {
                    setIsValid(false);
                  }, 1000);
                }}
                sx={{ mt: 5, mb: 2, backgroundColor: "#00a859" }}
              >
                {t("verify_email.close_text")}{" "}
                {isLoading && <CircularProgress />}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Holder>
    </>
  );
};
export default VerifyPage;
