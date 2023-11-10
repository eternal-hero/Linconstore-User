import React, { useCallback, useEffect, useMemo, useState } from "react";
import Wrapper from "../Wappers/Container";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CircularProgress,
  Container,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { addAddressDefaultValue } from "../../Helpers/Types";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  AddCircleOutline,
  ArrowBack,
  Close,
  MyLocation
} from "@mui/icons-material";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import GenNav from "../Layouts/GenNav";
import countryList from "country-list";
import {
  useGetUserAddress,
  useUpdateDefault,
  useUpdateUserAddress,
  useUserPostAddress, 
  useUserPostBillAddress,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Flag from "react-world-flags";
import { useRouter } from "next/router";

type TContact = {
  phoneNumber: number;
  address: string;
  country: string;
  type: string;
  lastName: string;
  firstName: string;
  _id: string;
  default: boolean;
};
interface Iaddress {
  setStepper: React.Dispatch<React.SetStateAction<boolean>>;
  setEditAddress: React.Dispatch<React.SetStateAction<any>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  editAddress: any;
  type: string;
  handleRefetch: () => void;
}

const Address: React.JSXElementConstructor<Iaddress> = ({
  setType,
  type,
  setStepper,
  handleRefetch,
  editAddress,
  setEditAddress,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const schema = yup.object().shape({
    firstName: yup
      .string()
      .required(t("address.firstName_helper_text"))
      .min(3, t("address.must_be_at_least_3")),
    lastName: yup
      .string()
      .required(t("address.lastName_helper_text"))
      .min(3, t("address.must_be_at_least_3")),
    country: yup.string().required(t("address.country_helper_text")).min(1),
    phoneInput: yup
      .mixed()
      .required(t("address.you_must_input_your_phone_number"))
      .test(
        "is-valid-phone",
        t("register.phone_number_is_not_valid"),
        (value) => {
          if (value) {
            return isValidPhoneNumber(value);
          }
          return false;
        }
      ),
    address: yup
      .string()
      .required(t("address.you_must_input_your_address"))
      .nullable(),
  });
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm<addAddressDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      country: "",
      phoneInput: "",
    },
  });

  const handleRouteAddAddress = () => {
    router.push("/account/contact");
  };

  useEffect(() => {
    if (editAddress) {
      reset(editAddress);
    }
  }, [editAddress]);
  const onSubmit: SubmitHandler<addAddressDefaultValue> = async (data) => {
    const { address, firstName, lastName, country, phoneInput } = data;
    const addressData = {
      address,
      default: true,
      firstName,
      lastName,
      country,
      phoneNumber: phoneInput,
    };
    if (editAddress?.address) {
      const newAddress = {
        ...addressData,
        id: editAddress?._id,
      };
      return updateAddress(newAddress);
    }
    if (type === "billing") {
      localStorage.setItem("addb", JSON.stringify(addressData));
      AddAddress(addressData);
      return;
    }
    AddAddress(addressData);
    localStorage.setItem("adds", JSON.stringify(addressData));
  };
  const onUpdateSuccess = () => {
    reset();
    setEditAddress({});
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const [defaultId, setDefaultId] = useState<string>("");
  const [addContact, setAddContact] = useState<boolean>(false);

  const allCountriesObject = countryList.getNameList();
  const allCountriesNames = countryList.getNames();

  const isMobile = useMediaQuery("(max-width: 600px)");

  const onAddSuccess = () => {
    reset();
    setEditAddress({});
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const onAddBillSuccess = () => {
    reset();
    setEditAddress({});
    setType("");
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const { isLoading: isBilling, mutate: addBill } =
    useUserPostBillAddress(onAddBillSuccess);
  const { isLoading: isAdding, mutate: AddAddress } =
    useUserPostAddress(onAddSuccess);
  const { isLoading: isUpdating, mutate: updateAddress } =
    useUpdateUserAddress(onUpdateSuccess);
  const [shippingAddress, setSetShippingAddress] = useState<TContact[]>([]);
  const handleBack = () => {
    setStepper((cur) => !cur);
    setEditAddress({});
  };
  const onGetAddressSuccess = (data: TContact[]) => {
    setSetShippingAddress(data);
  };
  const setDefault = useCallback(
    (id: string) => {
      const data = {
        id,
      };
      updateDefault(data);
    },
    [defaultId]
  );
  const onHandleDefault = ({
    address,
    _id,
    firstName,
    lastName,
    country,
    phoneNumber,
  }) => {
    const addressData = {
      address,
      default: true,
      firstName,
      lastName,
      country,
      phoneNumber,
      _id
    };

    if (type === "billing") {
      localStorage.setItem("addb", JSON.stringify(addressData));
      // return addBill(addressData);
    } else {
      localStorage.setItem("adds", JSON.stringify(addressData));
    }
    // AddAddress(addressData);
    setStepper((cur) => !cur);
    handleRefetch();
  };
  const { isLoading, refetch, isFetched } =
    useGetUserAddress(onGetAddressSuccess);

  useTokenRefetch(refetch);
  const isMatches: boolean = useMediaQuery("(max-width: 353px)");
  const isPad = useMediaQuery("(max-width: 900px)");
  const onDefaultSuccess = () => {
    handleRefetch();
    setTimeout(() => {
      setStepper((cur) => !cur);
    }, 1000);
  };
  const { isLoading: isDefaulting, mutate: updateDefault } =
    useUpdateDefault(onDefaultSuccess);
  return (
    <>
      <GenNav admin={false} mode={false} />
      <Wrapper
        title={t("address.wrapper_title")}
        content={t("address.wrapper_content")}
        description={t("address.wrapper_description")}
      >
        <Container maxWidth="xl">
          <Box sx={{ my: 4, px: 4 }}>
            <span>
              <ArrowBack onClick={() => handleBack()} className={"pointer"} />
            </span>
            <Typography variant={"h5"} textAlign={"center"}>
              {type === "billing"
                ? t("address.billing_title")
                : t("address.shipping_title")}{" "}
              {t("address.address_label")}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 1 }}
            >
              {/* <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    variant={"standard"}
                    {...field}
                    type={"text"}
                    label={t("address.firstName_label")}
                    name={"First Name"}
                    autoComplete={"First Name"}
                  />
                )}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {t("address.firstName_helper_text")}
                </FormHelperText>
              )}
              <Controller
                control={control}
                name="lastName"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    variant={"standard"}
                    {...field}
                    type={"text"}
                    label={t("address.lastName_label")}
                    name={"Last Name"}
                    autoComplete={"Last Name"}
                  />
                )}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {t("address.lastName_helper_text")}
                </FormHelperText>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <CountryDropdown id={"country"} {...field} />
                    )}
                  />
                  {errors.country && (
                    <FormHelperText sx={{ color: "#d32f2f" }}>
                      {errors?.country?.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneInput"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        style={{ border: "0px" }}
                        {...field}
                        defaultCountry="US"
                        id="phoneInput"
                        placeholder={t("address.phone_number_placeholder")}
                      />
                    )}
                  />
                  {errors.phoneInput && (
                    <FormHelperText sx={{ color: "#d32f2f" }}>
                      {errors?.phoneInput?.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Controller
                control={control}
                name="address"
                // defaultValue={''}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <Autocomplete
                    id="address"
                    options={["Address 1", "Address 2", "Address 3"]}
                    // getOptionLabel={(address) => address}
                    autoSelect
                    // @ts-ignore
                    value={value}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        sx={{ mt: 2 }}
                        {...params}
                        label={t("address.lookup_label")}
                        variant="standard"
                        required
                        error={!!errors?.address}
                        helperText={errors?.address?.message}
                        placeholder="Start typing your address"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchOutlined />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    onChange={(e, data) => onChange(data)}
                  />
                )}
              />
              <Button
                className={"buttonClass"}
                disabled={isAdding || isUpdating}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
              >
                {isAdding || isUpdating || (isBilling && <CircularProgress />)}
                {t("address.btn_save_label")}
              </Button>
              {isLoading && (
                <Typography textAlign={"center"}>
                  {" "}
                  <CircularProgress />{" "}
                </Typography>
              )} */}

              <Grid container>
                <Grid item md={3} sm={6} xs={12}>
                  <Box
                    sx={{
                      p: !isMobile ? 5 : 0,
                      display: "flex",
                      flexDirection: !isMobile ? "column" : "row",
                      alignItems: "center",
                      border: !isMobile && "1px solid #07a759",
                      mb: 2,
                    }}
                    onClick={() => handleRouteAddAddress()}
                  >
                    <AddCircleOutline sx={{ color: "#07a759" }} />
                    <Button sx={{ maxWidth: 190, color: "#07a759", m: 0 }}>
                      {t("account.contact.btn_addaddress")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                {shippingAddress.length > 0 &&
                  shippingAddress.map(
                    ({
                      address,
                      _id,
                      firstName,
                      lastName,
                      country,
                      phoneNumber,
                    }) => (
                      <Grid key={_id} item md={3} sm={6} xs={12}>
                        <Box
                          sx={{
                            border: "3px solid #07a759",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box>
                            <Typography fontSize={18} fontWeight={600}>
                              {firstName} {lastName}
                            </Typography>
                          </Box>
                          <Box my={2}>
                            <Typography>{address}</Typography>
                            <Typography>{country}</Typography>
                          </Box>
                          <Box>
                            <Typography fontWeight={600}>{phoneNumber}</Typography>
                          </Box>
                          <Box display="flex" mt={2} gap={2}>
                            <Button
                              variant={"contained"}
                              sx={{ height: "34px" }}
                              onClick={() =>
                                onHandleDefault({
                                  address,
                                  _id,
                                  firstName,
                                  lastName,
                                  country,
                                  phoneNumber,
                                })
                              }
                              disabled={isDefaulting}
                            >
                              {defaultId === _id && isDefaulting && (
                                <CircularProgress />
                              )}
                              {t("checkout.Select")}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    )
                  )}
              </Grid>
              <Modal
                open={addContact}
                onClose={() => setAddContact(false)}
                sx={{
                  bottom: isMobile ? 50 : 0,
                }}
              >
                <Box
                  sx={{
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    top: "100",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: "1000",
                    overflowY: "auto",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute" as "absolute",
                      top: !isMobile ? "50%" : "70%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: isPad ? "95vw" : 850,
                      bgcolor: "background.paper",
                      borderRadius: "20px",
                      boxShadow: 24,
                      pb: !isMobile ? 4 : 10,
                    }}
                  >
                    <Box
                      px={4}
                      pt={4}
                      pb={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" component="h2">
                        {t("address.wrapper_title")}
                      </Typography>
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => setAddContact(false)}
                      >
                        <Close />
                      </Box>
                    </Box>
                    <Box px={4}>
                      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                          container
                          spacing={1}
                          mb={!isMobile ? "100px" : "40px"}
                        >
                          <Grid item xs={12} sm={3}>
                            <InputLabel>{t("address.firstName_label")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <InputLabel>{t("address.lastName_label")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("address.data_country_field")}*</InputLabel>
                            <TextField
                              size="small"
                              select
                              // defaultValue={languages.filter((lang) => lang.code === 'GB')[0].label}
                              defaultValue={"Netherlands"}
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: 3,
                                width: "fit-content",
                              }}
                              fullWidth
                            >
                              {allCountriesNames.map((name) => (
                                <MenuItem key={name} value={name}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{ maxHeight: "20px", maxWidth: "20px" }}
                                    >
                                      <Flag
                                        code={
                                          allCountriesObject[name.toLowerCase()]
                                        }
                                        width="36px"
                                      ></Flag>
                                    </ListItemIcon>
                                    <ListItemText sx={{ ml: 1 }}>
                                      <b>{name}</b>
                                    </ListItemText>
                                  </div>
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("address.Zip_code")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} mt={"24px"} mb={"auto"}>
                            <Button
                              variant="contained"
                              sx={{ borderRadius: "50px" }}
                            >
                              <MyLocation />
                              {t("address.Use_my_location")}
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("address.data_state_field")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("address.data_city_field")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("address.Address_line")}*</InputLabel>
                            <TextField size="small" fullWidth />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <InputLabel>{t("Phone_number")}*</InputLabel>
                            <TextField
                              size="small"
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <>
                                    <Box
                                      pr={1}
                                      display={"flex"}
                                      alignItems={"center"}
                                    >
                                      <Flag code={"US"} width="36px" />
                                    </Box>
                                    <Typography pr={1}>+1</Typography>
                                  </>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <Button
                              size="small"
                              variant="outlined"
                              fullWidth
                              color="error"
                            >
                              {t("address.cancel")}
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              size="small"
                              type="submit"
                              variant="contained"
                              fullWidth
                              sx={{ borderRadius: "50px" }}
                            >
                              {/* {isReportCreating && <CircularProgress />}  */}
                              {t("address.Submit_Report")}
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Box>
        </Container>
      </Wrapper>
    </>
  );
};
export default React.memo(Address);
