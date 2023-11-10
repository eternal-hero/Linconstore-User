import * as React from "react";
import Button from "@mui/material/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Holder from "../../Wappers/Holder";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
import { PhotoCamera } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { uploadImage } from "../../../Helpers/utils";
import { useUpdateSellerFile } from "../../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

type IDoc = {
  document: string;
  attachment: File | null;
};
type reset = {
  doc: IDoc[];
  info: string;
};
interface IVerify {
  setVerifyDoc: React.Dispatch<React.SetStateAction<boolean>>;
}
const Verify: React.FC = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    doc: yup.array().of(
      yup.object().shape({
        document: yup
          .string()
          .required(t("seller.verify.document_type_is_a_required_field")),
        attachment: yup
          .mixed()
          .required(t("register.you_must_upload_a_document"))
          .test("fileSize", t("register.file_size_is_too_large"), (value) => {
            if (value) {
              return value.size <= 2000000;
            }
            return false;
          }),
      })
    ),
    info: yup.string().optional(),
  });

  const isMobile: boolean = useMediaQuery("(max-width : 300px)");
  const {
    handleSubmit,
    control,
    getValues,
    unregister,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<reset>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      doc: [
        {
          document: "",
          attachment: null,
        },
      ],
      info: "",
    },
  });
  useEffect(() => {
    const token = Cookies.get("token");
    // const token = localStorage.getItem("token");
    if (!token) {
      router.back();
    }
  }, []);
  const [docs, setDocs] = useState([1]);
  const router = useRouter();

  const addDoc = (index: number) => {
    const oldState = [...docs];
    oldState.push(index);
    setDocs(oldState);
  };
  const remDoc = (index: number) => {
    if (docs.length === 1) return;
    unregister(`doc.${index}`);
    unregister(`doc.${index}`);
    const newData = [...docs];
    newData.splice(index, 1);
    setDocs(newData);
  };
  const onSuccess = () => {
    reset();
    router.push("/seller/expenses");
  };
  const { mutate, isLoading } = useUpdateSellerFile(onSuccess);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<reset> = async (data) => {
    setIsUploading(true);
    const imageLink = await uploadImage(data.doc[0].attachment);
    const type = data.doc[0].document;

    const uploadData = {
      file: imageLink,
      type,
    };
    mutate(uploadData);
    setIsUploading(false);
  };

  return (
    <>
      <Holder>
        <Grid container mt={4}>
          <Grid item xs={0} sm={1} />
          <Grid item xs={12} sm={10}>
            <Typography variant={"h6"}>
              {t(
                "seller.verify.verify_your_identity_to_keep_the_marketplace_safe"
              )}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              {/*{loginLoading && <Loader/>}*/}
              {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
              <Toolbar />
              {docs.map((doc, index) => (
                <Box key={index}>
                  <Stack spacing={2} direction={"row"}>
                    <Typography variant={"body1"}>
                      {t("seller.verify.document_type")}
                    </Typography>
                    <FormControl sx={{ minWidth: "80%" }}>
                      <InputLabel id="demo-simple-select-label" shrink={false}>
                        {watch(`doc.${index}.document`) === "" &&
                          t("seller.verify.select_a_document_type")}
                      </InputLabel>

                      <Controller
                        name={`doc.${index}.document`}
                        control={control}
                        render={({ field, formState: { errors } }) => (
                          <Select
                            labelId={`doc.${index}.document`}
                            id={`doc.${index}.document`}
                            {...field}
                            variant={"outlined"}
                            className={"sortButton"}
                            sx={{
                              bgcolor: "#fff",
                              height: 45,
                              color: "#000",
                              border: "2px solid black",
                              "& .MuiSvgIcon-root": {
                                color: "black",
                              },
                            }}
                          >
                            <MenuItem value={"Passport"}>
                              {t("seller.verify.passport")}
                            </MenuItem>
                            <MenuItem value={"National ID"}>
                              {t("seller.verify.national_id")}
                            </MenuItem>
                            <MenuItem value={"Driver's license"}>
                              {t("seller.verify.drivers_license")}
                            </MenuItem>
                            <MenuItem value={"Lease agreement"}>
                              {t("seller.verify.lease_agreement")}
                            </MenuItem>
                            <MenuItem value={"Bank statement"}>
                              {t("seller.verify.bank_statement")}
                            </MenuItem>
                            <MenuItem value={"Credit Card Statement"}>
                              {t("seller.verify.credit_card_statement")}
                            </MenuItem>
                            <MenuItem value={"Government Issued document"}>
                              {t("seller.verify.government_issued_document")}
                            </MenuItem>
                          </Select>
                        )}
                      />

                      <FormHelperText sx={{ color: "red" }}>
                        {errors?.doc?.[index]?.document?.message}{" "}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                  <Stack
                    spacing={1}
                    sx={{
                      my: 1,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                    }}
                  >
                    {/*<Box>*/}
                    {/*    // @ts-ignore*/}
                    {/*    <>*/}
                    {/*    // @ts-ignore*/}
                    {/*    {watch(`doc.${index}.attachment.name`)}</></Box>*/}
                    <Controller
                      name={`doc.${index}.attachment`}
                      control={control}
                      render={({
                        field: { onChange },
                        formState: { errors },
                      }) => (
                        <>
                          {" "}
                          <input
                            type="file"
                            accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                            hidden
                            id={`doc.${index}.attachment`}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setValue(
                                `doc.${index}.attachment`,
                                e.target.files && e.target.files[0]
                              );
                            }}
                          />
                          <Tooltip
                            key="Select Doc"
                            title={t("seller.verify.business_picture")}
                          >
                            <label htmlFor={`doc.${index}.attachment`}>
                              <Button
                                variant="contained"
                                component="span"
                                startIcon={<PhotoCamera fontSize="large" />}
                                fullWidth={isMobile}
                              >
                                {t("seller.verify.upload")}
                              </Button>
                            </label>
                          </Tooltip>
                        </>
                      )}
                    />
                    <Button
                      variant={"contained"}
                      color={"error"}
                      onClick={() => remDoc(index)}
                      sx={{ maxHeight: 38 }}
                    >
                      {t("seller.verify.remove")}
                    </Button>
                    <Box />
                  </Stack>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.doc?.[index]?.attachment?.message}
                  </FormHelperText>
                </Box>
              ))}
              <Button
                variant={"contained"}
                fullWidth={isMobile}
                sx={{ maxWidth: { xs: "auto", sm: 200 } }}
                color={"success"}
                onClick={() => addDoc(docs.length + 1)}
              >
                {t("seller.verify.add")}
              </Button>
              <Stack
                spacing={1}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                }}
                mt={2}
              >
                <Typography variant={"h6"} sx={{ minWidth: 250 }}>
                  {t("seller.verify.additional_information")}
                </Typography>
                <Controller
                  name="info"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      multiline
                      rows={5}
                      variant={"outlined"}
                      error={!!errors?.info}
                      helperText={errors?.info?.message}
                      {...field}
                      type={"text"}
                      label={t("seller.verify.info")}
                      name={"info"}
                    />
                  )}
                />
              </Stack>

              <Box>
                <Button
                  disabled={isLoading || isUploading}
                  // className={'buttonClass'}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color={"success"}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isLoading || (isUploading && <CircularProgress />)}
                  {t("seller.verify.submit")}
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={0} sm={1} />
        </Grid>
      </Holder>
    </>
  );
};
export default Verify;
