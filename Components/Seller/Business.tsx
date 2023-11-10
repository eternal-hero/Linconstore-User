import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
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
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextInput from "../TextInput";
import Holder from "../Wappers/Holder";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  PhotoCamera,
  Task,
} from "@mui/icons-material";
import Image from "next/image";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useRegisterSeller } from "../../hooks/useDataFetch";
import { uploadImage } from "../../Helpers/utils";
import { useDispatch } from "react-redux";
import { openTermModal } from "../../Store/Modal";
import { useTranslation } from "react-i18next";

type IBusiness = {
  account: string;
  location: string;
  document: string;
  documentId: string;
  attachment: File | null;
  terms: boolean;
  residence: string;
  gender: string;
  dateOfBirth: string;
  websiteUrl: string;
};
export default function Business() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const isMobile: boolean = useMediaQuery("(max-width : 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const schema = yup.object().shape({
    account: yup.string().required(t("register.account_is_a_required_field")),
    location: yup.string().required(t("register.location_is_a_required_field")),
    document: yup.string().required(t("register.document_is_a_required_field")),
    gender: yup.string().when("account", {
      is: t("seller.verify.account.item1"),
      then: yup.string().required(t("register.gender_is_a_required_field")),
      otherwise: yup.string().notRequired(),
    }),
    // residence: yup.string().when("account", {
    //     is: {"Individual Seller"},
    //     then: yup.string().required(),
    //     otherwise: yup.string().notRequired(),
    // }),
    dateOfBirth: yup.string().when("account", {
      is: t("seller.verify.account.item1"),
      then: yup
        .string()
        .nullable()
        .test("dateOfBirth", t("register.you_must_be_18_years_or_older"), function (value) {
          return moment().diff(moment(value, "YYYY-MM-DD"), "years") >= 18;
        })
        .required(t("register.please_enter_your_age")),
      otherwise: yup.string().notRequired(),
    }),
    websiteUrl: yup.string().when("account", {
      is: t("seller.verify.account.item3"),
      then: yup.string().required(t("register.websiteUrl_is_a_required_field")),
      otherwise: yup.string().notRequired(),
    }),
    documentId: yup.string().when("account", {
      is: t("seller.verify.account.item1"),
      then: yup.string().notRequired(),
      otherwise: yup.string().required(t("register.document_id_is_a_required_field")),
    }),
    attachment: yup
      .mixed()
      .required(t("register.you_must_upload_a_document"))
      .test("fileSize", t("register.file_size_is_too_large"), (value) => {
        if (value) {
          return value.size <= 2000000;
        }
        return false;
      }),
    terms: yup.bool().oneOf([true], t("register.you_must_accept_terms_and_condition")),
  });
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<IBusiness>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      account: t("seller.verify.account.item1"),
      location: "",
      document: "",
      documentId: "",
      attachment: null,
      terms: false,
      residence: "",
      gender: "",
      dateOfBirth: "",
      websiteUrl: "",
    },
  });
  const onSuccess = (data: object) => {
    router.push("/seller/setup");
  };
  const {
    error,
    isError,
    isSuccess,
    isLoading,
    mutate: createSeller,
  } = useRegisterSeller(onSuccess);

  React.useEffect(() => {
    if (isSuccess) {
      reset();
    }
    if (isError && !isSuccess) {
      reset();
    }
  }, [isSuccess, isError, reset]);
  // useEffect(() => {
  //   // const role = localStorage.getItem("role");
  //   const role = Cookies.get("role");
  //   // if(role === 'seller') router.push('/')
  // }, []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<IBusiness> = async (data) => {
    const isBrands = watch("account");
    setIsUploading(true);
    const file = await uploadImage(data.attachment);
    setIsUploading(false);
    if (isBrands === t("seller.verify.account.item1")) {
      const sellerData = {
        account: isBrands,
        dob: data.dateOfBirth,
        gender: data.gender,
        file,
        location: data.location,
        documentType: data.document,
      };
      createSeller(sellerData);
    } else if (isBrands === t("seller.verify.account.item3")) {
      const sellerData = {
        account: isBrands,
        file,
        documentType: data.document,
        documentId: data.documentId,
        location: data.location,
        websiteUrl: data.websiteUrl,
      };

      createSeller(sellerData);
    } else {
      const sellerData = {
        account: isBrands,
        file,
        documentType: data.document,
        documentId: data.documentId,
        location: data.location,
      };

      createSeller(sellerData);
    }
  };
  const dispatch = useDispatch();
  const handleDispatch = useCallback(() => {
    dispatch(openTermModal());
  }, []);

  const individualSellerDocumnet = [
    t("seller.verify.business.item7"),
    t("seller.verify.business.item8"),
    t("seller.verify.business.item6"),
  ];
  const smallSellerDocument = [
    t("seller.verify.business.title"),
    t("seller.verify.business.item1"),
    t("seller.verify.business.item2"),
    t("seller.verify.business.item3"),
    t("seller.verify.business.item4"),
    t("seller.verify.business.item5"),
    t("seller.verify.business.item6"),
  ];
  const otherSellerDocument = [];

  const countryList = [
    {label: t("seller.verify.countryList.australia"), value: "australia"},
    {label: t("seller.verify.countryList.austria"), value: "austria" },
    {label: t("seller.verify.countryList.belgium"), value: "belgium"},
    {label: t("seller.verify.countryList.bulgaria"), value: "bulgaria"},
    {label: t("seller.verify.countryList.canada"), value: "canada"},
    {label: t("seller.verify.countryList.croatia"), value: "croatia"},
    {label: t("seller.verify.countryList.cyprus"), value: "cyprus"},
    {label: t("seller.verify.countryList.czech"), value: "czech"},
    {label: t("seller.verify.countryList.denmark"), value: "denmark"},
    {label: t("seller.verify.countryList.estonia"), value: "estonia"},
    {label: t("seller.verify.countryList.finland"), value: "finland"},
    {label: t("seller.verify.countryList.france"), value: "france"},
    {label: t("seller.verify.countryList.germany"), value: "germany"},
    {label: t("seller.verify.countryList.greece"), value: "greece"},
    {label: t("seller.verify.countryList.hungary"), value: "hungary"},
    {label: t("seller.verify.countryList.ireland"), value: "ireland"},
    {label: t("seller.verify.countryList.italy"), value: "italy"},
    {label: t("seller.verify.countryList.lithuania"), value: "lithuania"},
    {label: t("seller.verify.countryList.luxembourg"), value: "luxembourg"},
    {label: t("seller.verify.countryList.mexico"), value: "mexico"},
    {label: t("seller.verify.countryList.netherland"), value: "netherland"},
    {label: t("seller.verify.countryList.newZealand"), value: "newZealand"},
    {label: t("seller.verify.countryList.norway"), value: "norway"},
    {label: t("seller.verify.countryList.poland"), value: "poland"},
    {label: t("seller.verify.countryList.portugal"), value: "portugal"},
    {label: t("seller.verify.countryList.spain"), value: "spain"},
    {label: t("seller.verify.countryList.sweden"), value: "sweden"},
    {label: t("seller.verify.countryList.switzerland"), value: "switzerland"},
    {label: t("seller.verify.countryList.unitedKingdom"), value: "unitedKingdom"},
    {label: t("seller.verify.countryList.unitedStates"), value: "unitedStates"},
  ];
  return (
    <Holder>
      <Grid container spacing={2} height={ isMobile ? "calc(100vh)" : "calc(100vh - 34px)"}>
        <Grid 
          item 
          xs={0} 
          sx={{ display: { xs: "none", sm: "flex" } }} 
          sm={5}          
          bgcolor={'white'}
          display={"flex"}
          justifyContent={"end"}
          height={"100%"}
        >
          <Box width={"100%"} height={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Image
              width={400}
              height={400}
              style={{ marginTop: 30, width: "100%", height: "100%" }}
              placeholder="blur"
              blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
              src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/jxzwtvuhywv7eegz0hif"}
              alt={"image of Happy"}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} pr={2} pb={isMobile && 10} pl={isMobile && "32px !important"}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography variant={"h6"} fontSize={15}>{t("seller.verify.title")}</Typography>
            {/*{loginLoading && <Loader/>}*/}
            {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
            <FormControl sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("account") === "" && "Account type"}
              </InputLabel>
              <Controller
                name="account"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    size="small"
                    sx={{
                      bgcolor: "#fff",
                      "& .MuiSvgIcon-root": {
                        color: "var(--primary)",
                      },
                      "& .MuiOutlinedInput-root:hover fieldset": {
                        borderColor: "var(--primary) !important"
                      },
                      "& fieldset": {
                        borderColor: "var(--primary)"
                      }
                    }}
                  >
                    <MenuItem value={t("seller.verify.account.item1")}>
                      {t("seller.verify.account.item1")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.account.item2")}>
                      {t("seller.verify.account.item2")}
                    </MenuItem>
                    <MenuItem value={t("seller.verify.account.item3")}>
                      {t("seller.verify.account.item3")}
                    </MenuItem>
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.account?.message}{" "}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ minWidth: "100%", mt: 1.5 }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("location") === "" &&
                  t("seller.verify.countryList.title")}
              </InputLabel>
              <Controller
                name="location"
                control={control}
                defaultValue={"Austria"}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    size="small"
                    sx={{
                      my: 1,
                      "& .MuiSvgIcon-root": {
                        color: "var(--primary)",
                      },
                      "& fieldset": {
                        borderColor: "var(--primary)"
                      }
                      
                    }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                  >
                    {countryList.map((country, index) => (
                      <MenuItem key={index} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.location?.message}{" "}
              </FormHelperText>
            </FormControl>
            {/*<Controller*/}
            {/*    control={control}*/}
            {/*    name='location'*/}
            {/*    render={({field}) => (*/}
            {/*        <CountryDropdown*/}
            {/*            id={'country'}*/}
            {/*            defaultOptionLabel={'Select Location'}*/}
            {/*            {...field} />*/}
            {/*    )}*/}
            {/*/>*/}
            <Box sx={{ my: 1 }} />
            <Box sx={{ my: 1 }} />
            <Box sx={{ my: 1 }} />
            <FormControl sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                {watch("document") === "" && t("seller.verify.business.title")}
              </InputLabel>
              <Controller
                name="document"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    {...field}
                    variant={"outlined"}
                    size="small"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "var(--primary)",
                      },
                      "& fieldset": {
                        borderColor: "var(--primary)"
                      }
                    }}
                  >
                    {watch("account") === t("seller.verify.account.item1")
                      ? individualSellerDocumnet.map((seller) => (
                          <MenuItem key={seller} value={seller}>
                            {seller}
                          </MenuItem>
                        ))
                      : smallSellerDocument.map((seller) => (
                          <MenuItem key={seller} value={seller}>
                            {seller}
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.document?.message}
              </FormHelperText>
            </FormControl>
            {watch("account") !== t("seller.verify.account.item1") && (
              <Controller
                name="documentId"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.documentId}
                    field={field}
                    id={t("seller.verify.account.Document_ID")}
                  />
                )}
              />
            )}
            {watch("account") === t("seller.verify.account.item3") && (
              <Controller
                name="websiteUrl"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.documentId}
                    field={field}
                    id={t("seller.verify.account.Website_Url")}
                  />
                )}
              />
            )}
            {watch("account") === t("seller.verify.account.item1") && (
              <Stack
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                }}
              >
                <Stack>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({
                        field: { onChange, value },
                        formState: { errors },
                      }) => (
                        <DatePicker
                          label={t("seller.verify.date_title")}
                          disableFuture
                          value={new Date(value)}
                          onChange={(value: string | null) =>
                            onChange(moment(value).format("YYYY-MM-DD"))
                          }
                          renderInput={(params: any) => (
                            <TextField
                              error={!!errors.dateOfBirth}
                              size="small"
                              // helperText={errors?.dateOfBirth.message}
                              id="dateOfBirth"
                              variant="standard"
                              margin="dense"
                              fullWidth
                              color="primary"
                              autoComplete="bday"
                              {...params}
                              disabled={true}
                              inputProps={{
                                ...params.inputProps,
                                readOnly: true,
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.dateOfBirth?.message}
                  </FormHelperText>
                </Stack>
                <FormControl sx={{ minWidth: isMobile ? "100%" : "50%" }}>
                  <InputLabel id="gender" shrink={false}>
                    {watch("gender") === "" && t("seller.verify.gender.title")}
                  </InputLabel>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <Select
                        labelId="gender"
                        id="gender"
                        {...field}
                        variant={"outlined"}
                        size="small"
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "var(--primary)",
                          },
                          "& fieldset": {
                            borderColor: "var(--primary)"
                          }
                        }}
                      >
                        <MenuItem value={t("seller.verify.gender.item1")}>
                          {t("seller.verify.gender.item1")}
                        </MenuItem>
                        <MenuItem value={t("seller.verify.gender.item2")}>
                          {t("seller.verify.gender.item2")}
                        </MenuItem>
                        <MenuItem value={t("seller.verify.gender.item3")}>
                          {t("seller.verify.gender.item3")}
                        </MenuItem>
                      </Select>
                    )}
                  />

                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.document?.message}{" "}
                  </FormHelperText>
                </FormControl>
              </Stack>
            )}
            <Stack
              spacing={0}
              sx={{
                background: "#f3f2f2",
                display: "flex",
                borderRadius: "8px",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                mt: 2,
              }}
            >
              <Controller
                name={`attachment`}
                control={control}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                      hidden
                      id={`attachment`}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setSelectedImage(e.target.files[0].name);
                        setValue(
                          `attachment`,
                          e.target.files && e.target.files[0]
                        );
                      }}
                    />
                    <Tooltip key="Select Doc" title={"Business document"}>
                      <label htmlFor={`attachment`}>
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<PhotoCamera fontSize="large" />}
                          fullWidth={isMobile}
                        >
                          {t("seller.verify.upload_title")}
                        </Button>
                      </label>
                    </Tooltip>
                  </>
                )}
              />

              <FormHelperText sx={{ color: "red" }}>
                {errors?.attachment?.message}
              </FormHelperText>
            </Stack>

            {selectedImage && (
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  my: 1,
                  width: "100%",
                  height: "60px",
                  border: "1px solid grey",
                  borderRadius: 2,
                }}
              >
                <Task />
                <Box>
                  <Typography>{selectedImage}</Typography>
                </Box>
              </Stack>
            )}

            <Controller
              control={control}
              name={"terms"}
              render={({ field, formState: { errors } }) => (
                <FormControlLabel
                  control={
                    <Checkbox color="primary" aria-required={true} {...field} />
                  }
                  aria-required={true}
                  label={
                    <Typography>
                      {t("seller.verify.terms_alert")}
                      <span onClick={handleDispatch}>
                        <u>{t("seller.verify.link_content")}</u>
                      </span>
                    </Typography>
                  }
                />
              )}
            />
            {errors?.terms && (
              <FormHelperText sx={{ color: "red" }}>
                {" "}
                {errors?.terms?.message}{" "}
              </FormHelperText>
            )}
            <Stack spacing={1}>
              <Button
                disabled={isLoading || isUploading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                }}
              >
                {isLoading || (isUploading && <CircularProgress />)}
                {t("seller.verify.save_btn")}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Holder>
  );
}
