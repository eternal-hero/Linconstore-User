import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import Holder from "../Wappers/Holder";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useConfirmPassword } from "../../hooks/useDataFetch";
const schema = yup.object().shape({
  password: yup.string().required().min(8),
});
type reset = {
  password: string;
};
interface IConfirmPassword {
  id: string;
}
const ConfirmPassword: React.FC<IConfirmPassword> = ({ id }) => {
  const isMobile: boolean = useMediaQuery("(max-width : 300px)");
  const { handleSubmit, control, getValues, reset } = useForm<reset>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      password: "",
    },
  });
  const onSuccess = (data: object) => {
    router.push("/login");
  };
  const router = useRouter();
  const {
    isLoading,
    isError,
    isSuccess,
    mutate: confirmPassword,
  } = useConfirmPassword(onSuccess);
  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset();
    }
  }, [isSuccess, isError]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<reset> = async (data) => {
    router.push("/login");
    const pass = {
      password: data.password,
      id,
    };
    confirmPassword(pass);
  };

  return (
    <>
      <Holder>
        <Grid container height={isMobile ? "calc(100vh - 106px)" : "calc(100vh - 50px)"} >
          <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography variant={"h5"}> Enter New Password </Typography>
              <Controller
                control={control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    label="Enter Password"
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
                <Button
                  className={"buttonClass"}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
                >
                  {isLoading && <CircularProgress />}
                  Confirm
                </Button>
                <Box>
                  <Typography variant={"body1"}>
                    You will be redirected to the login page to sign in
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Holder>
    </>
  );
};

export default ConfirmPassword;
