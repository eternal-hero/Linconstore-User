import * as React from "react";
import Box from "@mui/material/Box";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../TextInput";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  CircularProgress,
  Container,
  Divider,
  FormHelperText,
  Grid,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import Logo from "../Utils/Logo";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import {
  useGetStoreInfo,
  useSellerStore,
} from "../../hooks/useDataFetch";
import { uploadImage } from "../../Helpers/utils";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

type Store_info = {
  name: string;
  store_summary: string;
  category: string;
  currency: string;
  location: string;
  attachment: File | null;
};
type currencies = {
  value: string;
  label: string;
};
const currencies: currencies[] = [
  { value: "EUR", label: "€-EUR" },
  { value: "AUD", label: "$-AUD" },
  { value: "BGN", label: "лв-BGN" },
  { value: "CAD", label: "$-CAD" },
  { value: "HRK", label: "kn-HRK" },
  { value: "CZK", label: "Kč-CZK" },
  { value: "DKK", label: "kr-DKK" },
  { value: "HUF", label: "Ft-HUF" },
  { value: "NOK", label: "kr-NOK" },
  { value: "PLN", label: "zł-PLN" },
  { value: "NZD", label: "$-NZD" },
  { value: "MXN", label: "$-MXN" },
  { value: "Pounds", label: "£-GBP" },
  { value: "SEK", label: "kr-SEK" },
  { value: "CHF", label: "Fr-CHF" },
  { value: "USD", label: "$-USD" },
];
export const categoryOptions: string[] = [
  "Animal",
  "Art & Craft",
  "Baby",
  "Carriers",
  "Cleaning",
  "Clothing",
  "Electronic",
  "Furniture",
  "Garden & terrace",
  "cooking",
  "Home",
  "Jewelry",
  "Media",
  "Music",
  "Occasion and event",
];

const StoreInfo: React.JSXElementConstructor<any> = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    name: yup
      .string()
      .matches(/^[A-Za-z0-9 ]*$/, "Only characters and numbers are allowed")
      .required("you must provide a name for your store")
      .min(4)
      .test("unique-username", "Username is already taken", async (value) => {
        try {
          const response = await axios.get(
            `${baseUrl}/store/unique-name?storename=${value}`
          );
          const data = response.data;
          return !data; // Return true if the username is unique, false otherwise
        } catch (error) {
          console.error("Error checking username:", error);
          return false; // Return false if an error occurs
        }
      }),
    store_summary: yup.string().required("summary is required").min(10),
    // category: yup.array().of(yup.string()).required(),
    currency: yup.string().required(),
    location: yup.string().required(),
    attachment: yup
      .mixed()
      .required("You Must upload a logo")
      .test("fileSize", "File Size is too large", (value) => {
        if (value) {
          return value.size <= 2000000;
        }
        return false;
      })
      .test("fileType", "Unsupported File Format", (value) => {
        if (value) {
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }
        return false;
      }),
  });
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Store_info>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      store_summary: "",
      // category: '',
      currency: "Pounds",
      location: "",
      attachment: null,
    },
  });
  const dispatch = useDispatch();
  const [cat_error, setCat_error] = useState<boolean>(false);
  const [limit, setLimit] = useState<string>("");
  const router = useRouter();
  const onSellerStoreSuccess = (data: any) => {
    Cookies.set("role", "seller",{expires:3, secure: true});
    Cookies.set("completed", "true",{expires:3, secure: true});
    // localStorage.setItem("role", "seller");
    // localStorage.setItem("completed", "true");
    const status = Cookies.get("status");
    // const status = localStorage.getItem("status");
    if (status !== "seller") {
      Cookies.remove("status");
      // localStorage.removeItem("status");
    }
    router.push("/seller");
  };
  // const {isLoading: isLoadingOnboard,refetch,} = useSellerOnboard(onSellerStoreSuccess)
  const onSuccess = (data: any) => {
    reset();
    Cookies.set("role", "seller",{expires:3, secure: true});
    Cookies.set("status", "seller",{expires:3, secure: true});
    Cookies.set("completed", "true",{expires:3, secure: true});
    // localStorage.setItem("role", "seller");
    // localStorage.setItem("status", "seller");
    // localStorage.setItem("completed", "true");
    // const status = localStorage.getItem("status");
    // if (status !== "seller") {
    //   localStorage.removeItem("status");
    // }
    router.push("/seller");
  };
  const {
    isLoading,
    isSuccess: isCreateSuccess,
    error,
    isError,
    mutate: createStore,
  } = useSellerStore(onSuccess);

  const onSubmit: SubmitHandler<Store_info> = useCallback(
    async (data, event) => {
      // data.attachment = event?.target.attachment.files
      const logo = await uploadImage(data.attachment);
      // create post here
      const { currency, category, store_summary, name, location } = data;
      const postStore = {
        logo,
        location,
        name,
        // categories: category,
        currency,
        summary: store_summary,
      };
      createStore(postStore);
    },
    [cat_error, createStore]
  );
  type ICategories = {
    title: string;
  };
  const [limitPlan, setLimitPlan] = useState<number>();
  const [categories, setCategories] = useState<ICategories[]>([]);
  const { isSuccess, data } = useGetStoreInfo();
  useEffect(() => {
    if (isSuccess) {
      const { categories, limit } = data;
      const categoryArray: any[] = [];
      categories.forEach((category: { title: string }) =>
        categoryArray.push(category.title)
      );
      setCategories(categoryArray);
      setLimitPlan(limit);
    }
  }, [data, isSuccess]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          position: !isMobile && ("absolute" as "absolute"),
          top: !isMobile && "50%",
          left: !isMobile && "50%",
          transform: !isMobile && "translate(-50%, -50%)",
          width: !isMobile ? "90%" : "100%",
          maxWidth: "900px"
        }}
      >
        <Typography variant={"h6"} mb={5}>
          {t("storeinfo.Setting_up_your_store")}
        </Typography>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 0 }}
        >
          
          <Typography mb={1}>{t("storeinfo.Your_store_logo")}</Typography>

          <Controller
            name="attachment"
            control={control}
            render={({ field: { onChange }, formState: { errors } }) => (
              <>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id={"attachment"}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setValue("attachment", e.target.files && e.target.files[0]);
                  }}
                />
                <Tooltip key="Select Image" title={"Business picture"}>
                  
                  <label htmlFor="attachment">
                    <Button
                      // variant="contained"
                      component="span"
                      // startIcon={<PhotoCamera fontSize="large" />}
                    >
                      <Avatar
                        src={
                          watch("attachment")
                            ? URL.createObjectURL(watch("attachment") as File)
                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt="photo preview"
                        sx={{ width: "150px", height: "150px" }}
                      />
                    </Button>
                  </label>
                </Tooltip>
              </>
            )}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors?.attachment?.message}
          </FormHelperText>

          <Divider sx={{my: 1}} />

          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.name}
                    field={field}
                    id={t("storeinfo.What_is_your_store_name")}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name="store_summary"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.store_summary}
                    field={field}
                    id={t("storeinfo.Give_us_a_short_summary_of_your_store")}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <TextInput
                    data={errors?.location}
                    field={field}
                    id={t("storeinfo.Business_location")}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name="currency"
                control={control}
                render={({ field: { onChange, value }, formState: { errors } }) => (
                  <TextField
                    id="outlined-select-currency"
                    select
                    fullWidth
                    margin="normal"
                    size="small"
                    variant="outlined"
                    label={t("storeinfo.Currency")}
                    error={!!errors?.currency}
                    onChange={onChange}
                    value={value}
                    required={true}
                    helperText={
                      errors
                        ? errors?.currency?.message
                        : t("storeinfo.Please_select_your_currency")
                    }
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        sx: { top: "-180px", maxHeight: "190px" },
                      },
                    }}
                  >
                    {currencies.map((currency, index) => (
                      <MenuItem key={currency.value + index} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          
          {isError && (
            <FormHelperText sx={{ color: "red" }}>
              {error?.response?.data?.status}
            </FormHelperText>
          )}
          <Box display={"flex"} gap={2} justifyContent={"end"} mb={isMobile ? 5 : 2} mt={2}>
            <Button
              disabled={isLoading}
              variant="contained"
              type="submit"
              // className={"buttonClass"}
              fullWidth={isMobile && true}
            >
              {t("storeinfo.Personalize_your_store")} {isLoading && <CircularProgress />}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
export default StoreInfo;
