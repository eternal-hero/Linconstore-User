import React, { useCallback, useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import countryList from "country-list";
import {
  Card,
  CircularProgress,
  Grid,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
  ArrowBack,
  AddCircleOutline,
  Close,
  MyLocation,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import {
  useDeleteAddress,
  useGetUserAddressOnRefetch,
  useUpdateDefault,
  useUpdateUserAddress,
  useUserPostAddress,
} from "../../hooks/useDataFetch";
import { useTranslation } from "react-i18next";
import { CountryCodes } from "../../Data/CountryCodes";
import PhoneNumberInput from "../Form/PhoneNumberInput";
import ReactCountryFlag from "react-country-flag";

type changeAddress = {
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  state: string;
  city: string;
  country: string;
};
type addContact = {
  name: string;
  phone: string;
  lastName: string;
  address: string;
  country: string;
};
type TContact = {
  phoneNumber: any;
  address: string;
  firstName: string;
  lastName: string;
  _id: string;
  default: boolean;
  country: string;
  state: string;
  zipCode: string;
  city: string;
};
const Contact: React.FC = () => {
  const { t } = useTranslation();
  const allCountriesObject = countryList.getNameList();
  const allCountriesNames = countryList.getNames();

  const schema = yup.object().shape({
    address: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(6, t("account.contact.address_must_be_at_least_6_characters")),
    phone: yup
      .number()

      .required(t("account.contact.require_text"))
      .min(11, t("account.Security.phone_must_be_greater_than_or_equal_to_11")),
    firstName: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(2, t("account.contact.name_must_be_at_least_6_characters")),
    lastName: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(2, t("account.contact.name_must_be_at_least_6_characters")),
    zipCode: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(3, t("account.contact.name_must_be_at_least_6_characters")),
    city: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(3, t("account.contact.name_must_be_at_least_6_characters")),
    state: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(3, t("account.contact.name_must_be_at_least_6_characters")),

    country: yup
      .string()
      .required()
      .min(1)
      .test(
        "is-country-not-none",
        t("register.country_is_a_required_field"),
        (value) => {
          return value !== "none";
        }
      ),
  });

  const schema1 = yup.object().shape({
    phone: yup
      .number()
      .typeError(t("account.contact.type_error"))
      .required(t("account.contact.require_text"))
      .min(11, t("account.Security.phone_must_be_greater_than_or_equal_to_11")),
    name: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(6, t("account.contact.name_must_be_at_least_6_characters")),
    address: yup
      .string()
      .required(t("account.contact.require_text"))
      .min(6, t("account.contact.address_must_be_at_least_6_characters")),
    country: yup
      .string()
      .required()
      .min(1)
      .test(
        "is-country-not-none",
        t("register.country_is_a_required_field"),
        (value) => {
          return value !== "none";
        }
      ),
  });

  const { handleSubmit, control, reset } = useForm<changeAddress>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      phone: "+",
      firstName: "",
      lastName: "",
      state: "",
      zipCode: "",
      city: "",
      country: "",
    },
  });

  const {
    handleSubmit: handleAddressUpdate,
    control: updateAddressControl,
    reset: resetAddress,
    setValue,
  } = useForm<changeAddress>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      address: "",
      phone: "+",
      firstName: "",
      lastName: "",
      state: "",
      zipCode: "",
      city: "",
      country: "",
    },
  });

  const onAddSubmit = async (data) => {
    const { address, firstName, phone, lastName, zipCode, city, state, country, } = data;
    const newData = {
      address: address,
      firstName: firstName,
      phoneNumber: phone,
      lastName,
      zipCode,
      country,
      state,
      city,
      id: currentId,
    };
    AddAddress(newData);
  };

  const onUpdateSubmit = async (data) => {
    const { address, firstName, phone, lastName, zipCode, city, state, country, } = data;
    const newData = {
      address: address,
      firstName: firstName,
      phoneNumber: phone,
      lastName,
      zipCode,
      country,
      state,
      city,
      id: currentId,
    };
    updateAddress(newData);
  };

  const [changeAddress, setChangeAddress] = useState(false);
  const [addContact, setAddContact] = useState(false);

  const addPhoneHandler: SubmitHandler<addContact> = async (data) => {
    const newData = {
      phoneNumber: data.phone,
      firstName: data.name,
      address: data.address,
      country: data?.country,
    };
    AddAddress(newData);
  };

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMatches = useMediaQuery("(max-width: 400px)");
  const isPad = useMediaQuery("(max-width: 900px)");
  const router = useRouter();

  // const [addresses, setAddress] = useState<TContact[]>([]);
  // const [defaultAddress, setDefaultAddress] = useState<TContact[]>([]);
  const [addresses, setAddresses] = useState<TContact[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [defaultId, setDefaultId] = useState<string>("");

  const onSuccess = (data: TContact[]) => {
    if (data.length === 0) {
      // setAddContact(true);
    }
    localStorage.setItem("ssss", JSON.stringify(data));
    // const newArray = data.filter((add) => add.default);
    // setDefaultAddress(newArray);
    // const OtherArray = data?.filter((add) => !add.default);
    setAddresses(data);
  };

  const onAddSuccess = () => {
    setAddContact(false);
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const onUpdateSuccess = () => {
    setChangeAddress(false);
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const handleChangeAddress = (address: TContact) => {
    setChangeAddress(true);
    setCurrentId(address._id);
    setValue("address", address.address);
    setValue("phone", "+" + address.phoneNumber);
    setValue("firstName", address.firstName);
    setValue("lastName", address.lastName);
    setValue("state", address.state);
    setValue("zipCode", address.zipCode);
    setValue("city", address.city);
    setValue("country", address.country);
  };

  const onDeleteSuccess = () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const deleteAddressHandler = (id: string) => {
    deleteAddress(id);
  };

  const onDefaultSuccess = () => {
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const setDefault = useCallback(() => {
    const data = {
      id: defaultId,
    };
    updateDefault(data);
  }, [defaultId]);

  const onHandleDefault = useCallback(
    (id: string) => {
      setDefaultId(id);
      setTimeout(() => {
        setDefault();
      }, 1000);
    },
    [defaultId]
  );

  const { isLoading: isUpdating, mutate: updateAddress } = useUpdateUserAddress(onUpdateSuccess);
  const { data, isLoading, refetch } = useGetUserAddressOnRefetch(onSuccess);

  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch();
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const { isLoading: isAdding, mutate: AddAddress } = useUserPostAddress(onAddSuccess);
  const { isLoading: isDeleting, mutate: deleteAddress } = useDeleteAddress(onDeleteSuccess);
  const { isLoading: isDefaulting, mutate: updateDefault } = useUpdateDefault(onDefaultSuccess);
  
 const handleChange = (event) => {
  const keyword = event.target.value
  const item = CountryCodes.find(c => keyword.includes(c.name))
  if(item){
    const phone_code = item.dial_code
    setValue("phone", phone_code);
  }
 }
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper title={t("pagetitle.Add_Address")} description={""} content={""}>
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
                  sx={{ my: 1 }}
                >
                  {t("account.contact.contact_information")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"main"} maxWidth={"lg"}>
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
                    onClick={() => setAddContact(true)}
                  >
                    <AddCircleOutline sx={{ color: "#07a759" }} />
                    <Button sx={{ maxWidth: 190, color: "#07a759", m: 0, fontSize: 14, fontWeight: 500 }}>
                      {t("account.contact.btn_addaddress")}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                {isLoading && <CircularProgress />}
                {addresses.length > 0 &&
                  addresses.map((address) => (
                    <Grid key={address._id} item md={3} sm={6} xs={12}>
                      <Box
                        sx={{
                          border: "1px solid #07a759",
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box>
                          <Typography fontSize={14}>
                            {address.firstName} {address.lastName}
                          </Typography>
                        </Box>
                        <Box my={2}>
                          <Typography>{address.address}</Typography>
                          <Typography>{address.country}</Typography>
                        </Box>
                        <Box>
                          <Typography fontSize={14}>
                            {address.phoneNumber}
                          </Typography>
                        </Box>
                        <Box display="flex" mt={2} gap={2}>
                          <Button
                            variant="outlined"
                            sx={{ color: "#07a759", borderRadius: "20px" }}
                            onClick={() => handleChangeAddress(address)}
                          >
                            {t("account.contact.btn_edit")}
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{ borderRadius: "20px" }}
                            color="error"
                            onClick={() => deleteAddressHandler(address._id)}
                          >
                            {t("account.contact.btn_delete")}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </Box>
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
                  zIndex: "1000",
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
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onAddSubmit)}
                    noValidate
                  >
                    <Grid
                      container
                      spacing={1}
                      mb={!isMobile ? "100px" : "40px"}
                    >
                      <Grid item xs={12} sm={3}>
                        <InputLabel>{t("address.firstName_label")}*</InputLabel>
                        <Controller
                          name="firstName"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.firstName}
                              {...field}
                              id="firstName"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <InputLabel>{t("address.lastName_label")}*</InputLabel>
                        <Controller
                          name="lastName"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.lastName}
                              {...field}
                              id="lastName"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_country_field")}*</InputLabel>
                        <Controller
                          name="country"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              select
                              // defaultValue={languages.filter((lang) => lang.code === 'GB')[0].label}
                              defaultValue={"Netherlands"}
                              {...field}
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: 3,
                              }}
                              fullWidth
                              error={!!errors?.country}
                              helperText={errors?.country?.message}
                            >
                              {allCountriesNames.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  sx={{ width: "100%" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        maxHeight: "20px",
                                        maxWidth: "20px",
                                        minWidth: "24px"
                                      }}
                                    >
                                      {/* <Flag
                                        code={
                                          allCountriesObject[name.toLowerCase()]
                                        }
                                        width="36px"
                                      ></Flag> */}
                                      <ReactCountryFlag
                                        countryCode={allCountriesObject[name.toLowerCase()]}
                                        svg
                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                        cdnSuffix="svg"
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      sx={{
                                        m: 0,
                                        width: "100%",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <b>{name}</b>
                                    </ListItemText>
                                  </div>
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.Zip_code")}*</InputLabel>
                        <Controller
                          name="zipCode"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.zipCode}
                              {...field}
                              id="zipCode"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} mt={"24px"} mb={"auto"}>
                        <Button
                          variant="contained"
                          sx={{ borderRadius: "50px" }}
                          fullWidth
                        >
                          <MyLocation />
                          <Typography fontSize={14}>{t("address.Use_my_location")}</Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_state_field")}*</InputLabel>
                        <Controller
                          name="state"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.state}
                              {...field}
                              id="state"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_city_field")}*</InputLabel>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.city}
                              {...field}
                              id="city"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.Address_line")}*</InputLabel>
                        <Controller
                          name="address"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.address}
                              {...field}
                              id="address"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field, formState: { errors } }) => (
                            <PhoneNumberInput
                              control={control}
                              label={t("register.phone_number")}
                              name="phone"
                              isActive={"true"}
                              error={errors?.phone?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Button variant="outlined" fullWidth color="error" onClick={() => setAddContact(false)}>
                          {t("address.cancel")}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{ borderRadius: "50px" }}
                        >
                          {/* {isReportCreating && <CircularProgress />}  */}
                          {t("address.save_address")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={changeAddress}
            onClose={() => setChangeAddress(false)}
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
                  zIndex: "1000",
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
                  <Typography variant="h6" component="h2">{t("account.contact.Edit_address")}</Typography>
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => setChangeAddress(false)}
                  >
                    <Close />
                  </Box>
                </Box>
                <Box px={4}>
                  <Box
                    component="form"
                    onSubmit={handleAddressUpdate(onUpdateSubmit)}
                    noValidate
                  >
                    <Grid
                      container
                      spacing={1}
                      mb={!isMobile ? "100px" : "40px"}
                    >
                      <Grid item xs={12} sm={3}>
                        <InputLabel>{t("address.firstName_label")}*</InputLabel>
                        <Controller
                          name="firstName"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.firstName}
                              {...field}
                              id="firstName"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <InputLabel>{t("address.lastName_label")}*</InputLabel>
                        <Controller
                          name="lastName"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.lastName}
                              {...field}
                              id="lastName"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_country_field")}*</InputLabel>
                        <Controller
                          name="country"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              select
                              // defaultValue={languages.filter((lang) => lang.code === 'GB')[0].label}
                              defaultValue={"Netherlands"}
                              {...field}
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: 3,
                              }}
                              fullWidth
                              error={!!errors?.country}
                              helperText={errors?.country?.message}
                              onChange={(e) => {
                                field.onChange(e); // This triggers the change event
                                handleChange(e);
                              }}
                            >
                              {allCountriesNames.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  sx={{ width: "100%" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        maxHeight: "20px",
                                        maxWidth: "20px",
                                        minWidth: "24px",
                                      }}
                                    >
                                      <ReactCountryFlag
                                        countryCode={allCountriesObject[name.toLowerCase()]}
                                        svg
                                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                        cdnSuffix="svg"
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      sx={{
                                        m: 0,
                                        width: "100%",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <b>{name}</b>
                                    </ListItemText>
                                  </div>
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.Zip_code")}*</InputLabel>
                        <Controller
                          name="zipCode"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.zipCode}
                              {...field}
                              id="zipCode"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} mt={"24px"} mb={"auto"}>
                        <Button
                          variant="contained"
                          sx={{ borderRadius: "50px" }}
                          fullWidth
                        >
                          <MyLocation />
                          <Typography fontSize={14}>{t("address.Use_my_location")}</Typography>
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_state_field")}*</InputLabel>
                        <Controller
                          name="state"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.state}
                              {...field}
                              id="state"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.data_city_field")}*</InputLabel>
                        <Controller
                          name="city"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.city}
                              {...field}
                              id="city"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel>{t("address.Address_line")}*</InputLabel>
                        <Controller
                          name="address"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <TextField
                              size="small"
                              fullWidth
                              error={!!errors?.address}
                              {...field}
                              id="address"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="phone"
                          control={updateAddressControl}
                          render={({ field, formState: { errors } }) => (
                            <PhoneNumberInput
                              control={updateAddressControl}
                              label={t("register.phone_number")}
                              name="phone"
                              isActive={"true"}
                              error={errors?.phone?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Button variant="outlined" fullWidth color="error" onClick={() => setChangeAddress(false)}>
                          {t("address.cancel")}
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{ borderRadius: "50px" }}
                        >
                          {/* {isReportCreating && <CircularProgress />}  */}
                          {t("address.save_address")}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Wrapper>
      </Card>
    </>
  );
};
export default Contact;
