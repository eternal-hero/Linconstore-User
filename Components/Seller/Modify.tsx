import {
  Card,
  CircularProgress,
  FormHelperText,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Avatar from "@mui/material/Avatar";
import {
  ChangeEvent,
  useContext,
  useState,
} from "react";
import Button from "@mui/material/Button";
import {
  ArrowBack,
  PhotoCamera,
  Storefront,
  Place,
  ContentCopy
} from "@mui/icons-material";
import * as React from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import {
  useGetUser,
  useGetUserStore,
  useModifySeller,
  useModifyUser,
  useUpdateStore,
} from "../../hooks/useDataFetch";
import { uploadImage } from "../../Helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import ContextApi from "../../Store/context/ContextApi";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object().shape({
  name: yup
    .string()
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
  location: yup.string().required(),
  description: yup.string().required().min(10),
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
const contactSchema = yup.object().shape({
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("This is required"),
  password: yup.string().required("This is required").min(6),
});
interface Istoreinfo {
  name: string;
  description: string;
  location: string;
  attachment: File | null;
}

type TCurrency = {
  currency: {
    currency: string;
  };
};

interface Icontact {
  phone: "";
  password: string;
}
const Modify = () => {
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Istoreinfo>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
      attachment: null,
    },
  });
  const {
    handleSubmit: modifyInfo,
    control: controlData,
    reset: resetData,
  } = useForm<Icontact>({
    resolver: yupResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<Istoreinfo> = async (data, event) => {
    const logo = await uploadImage(data.attachment);
    const { name, location, description } = data;
    const newData = {
      name,
      location,
      summary: description,
      logo,
    };
    updateStore(newData);
  };

  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  const [isEditDomesticFee, setIsEditDomesticFee] = useState<boolean>(false);
  const [isModify, setIsModify] = useState<boolean>(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const onContact: SubmitHandler<Icontact> = (data) => {
    const newData = {
      phone: data.phone,
      password: data.password,
    };
    updateUser(newData);
  };
  const { data, isLoading: userIsLoading, refetch } = useGetUser();

  useTokenRefetch(refetch);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const onSuccess = (data: object) => {
    reset();
    const snackBar = {
      message: "Profile updated successful",
      severity: "success",
      snackbarOpen: true,
      rate: 0,
      sellerRate: 0,
    };
    dispatch(snackBarOpen(snackBar));

    router.push("/seller");
  };

  const onUserSuccess = (data: object) => {
    setIsModify(false);
    resetData();
    const snackBar = {
      message: "Contact updated successfully",
      severity: "success",
      snackbarOpen: true,
      rate: 0,
      sellerRate: 0,
    };
    dispatch(snackBarOpen(snackBar));
  };

  const { isLoading: isUserLoading, mutate: updateUser } =
    useModifyUser(onUserSuccess);
  const { isLoading, mutate: updateStore } = useModifySeller(onSuccess);

  const { t } = useTranslation();

  const onGetStoreSuccess = (data: Record<string, any>) => {
    setStoreInfo(data);
    setShippingFee(data.domesticShipping.standard);
  };

  const {
    isSuccess,
    data: storedata,
    refetch: refetchUserStore,
  } = useGetUserStore(onGetStoreSuccess);

  const generateStoreLink = () => {
    const storeName = storeInfo?.name.replace(" ", "-");
    return `www.linconstore.com/store/${storeName}`;
  };

  const storeUpdated = () => {
    refetchUserStore();
    refetch();
    const snackBar = {
      message: "Successful",
      severity: "success",
      snackbarOpen: true,
      rate: 0,
      sellerRate: 0,
    };
    dispatch(snackBarOpen(snackBar));
  };

  const { isLoading: updatingStoreLoading, mutate: updateStoreInfo } =
    useUpdateStore(storeUpdated);

  const updateChatAvailability = (value: boolean) => {
    updateStoreInfo({ disableChat: value });
  };

  const updateSellGlobalStatus = (value: boolean) => {
    updateStoreInfo({ sellGlobal: value });
  };

  const updateDomesticShipping = () => {
    setIsEditDomesticFee(false);
    updateStoreInfo({ domesticShipping: shippingFee });
  };

  const handleClick = async (data: string) => {
    await navigator.clipboard.writeText(data);
    dispatch(
      snackBarOpen({
        message: "Copied to clipboard",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };

  return (
    <>
      <Head>
        <title>{t("pagetitle.Modify")}</title>
        <meta name={"Modify"} content={"These are Modify"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      {!isModify && (
        <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {isMobile && (
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
            )}
          </Box>

          <Box
            p={2}
            bgcolor={"white"}
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={isMobile ? "column" : "row"}
            mb={2}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              maxWidth={isMobile ? "100%" : "40%"}
              mb={isMobile ? 1 : 0}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box
                  alignItems={"center"}
                  display={"inline-flex"}
                  px={2}
                  py={1}
                  my={1}
                  border={"1px solid black"}
                  borderRadius={"5px"}
                  bgcolor={"#f3f2f2"}
                >
                  <Storefront sx={{ mr: "10px" }} />
                  <Typography fontSize={isMobile ? "14px" : "14px"}>
                    {storeInfo?.name || ""}
                  </Typography>
                </Box>
              </Box>

              <Box display={"flex"} gap={2} ml={1} alignItems={"center"}>
                <Place sx={{ color: "#00a859" }} />
                <Typography fontSize={isMobile ? "14px" : "14px"}>
                  {storeInfo?.location || ""}
                </Typography>
              </Box>

              <Typography ml={1} fontSize={isMobile ? "14px" : "14px"}>
                {storeInfo?.summary || ""}
              </Typography>

              <Box display={"flex"}>
                <Button variant="contained" onClick={() => setIsModify(true)}>
                  {t("seller.modify.modify")}
                </Button>
              </Box>
            </Box>

            <Box maxWidth={isMobile ? "100%" : "50%"}>
              <Typography mb={1} fontSize={isMobile ? "14px" : "14px"}>
                {t("seller.modify.Copy_the_link_to_your_store_and_share_it")}
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                onClick={() => handleClick(generateStoreLink())}
                sx={{ cursor: "pointer" }}
                flexDirection={isMobile ? "column" : "row"}
              >
                <Typography
                  fontSize={isMobile ? "14px" : "14px"}
                  display={"inline-flex"}
                  border={"1px solid black"}
                  px={2}
                  py={1}
                  mr={1}
                  borderRadius={"5px"}
                  sx={{ textDecoration: "underline" }}
                >
                  {generateStoreLink()}
                </Typography>
                <ContentCopy
                  sx={{
                    color: "#0ba659",
                    width: "30px",
                    mt: isMobile && 1,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box p={2} bgcolor={"white"}>
            <Typography my={2} fontSize={"14px"} fontWeight={700}>
              {t("seller.modify.contact")}{" "}
              {userIsLoading && <CircularProgress />}
            </Typography>
            <Typography my={2} fontSize={"14px"}>
              {t("seller.modify.name")}: {data?.firstName} {data?.lastName}{" "}
            </Typography>
            <Typography my={2} fontSize={"14px"}>
              {t("seller.modify.email")}:{" "}
              <span style={{ textDecoration: "underline" }}>{data?.email}</span>
            </Typography>
            <Typography my={2} fontSize={"14px"}>
              {t("seller.modify.phone")}: {data?.phone}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            px={2}
            py={1}
            bgcolor={"white"}
            alignItems={"center"}
            borderRadius={"5px"}
            my={2}
          >
            <Typography fontSize={"14px"}>
              {t("seller.modify.Disable_chat_with_buyer")}
            </Typography>
            <Switch
              disabled={storeInfo?.owner.package !== "Premium"}
              checked={storeInfo?.disableChat || false}
              onChange={(e) => updateChatAvailability(e.target.checked)}
              sx={{ color: "#00a859" }}
            />
          </Box>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            px={2}
            py={1}
            bgcolor={"white"}
            alignItems={"center"}
            borderRadius={"5px"}
            my={2}
          >
            <Typography fontSize={"14px"}>
              {t("seller.modify.Sell_Globally")}
            </Typography>
            <Switch
              checked={storeInfo?.sellGlobal || false}
              onChange={(e) => updateSellGlobalStatus(e.target.checked)}
              sx={{ color: "#00a859" }}
            />
          </Box>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            p={isEditDomesticFee ? "6.5px" : 2}
            bgcolor={"white"}
            alignItems={"center"}
            borderRadius={"5px"}
            my={2}
          >
            <Typography fontSize={"14px"}>
              {t("seller.modify.Domestic_shipping_fee")}
            </Typography>
            <Box display={"flex"} gap={3} mr={3} alignItems={"center"}>
              {!isEditDomesticFee ? (
                <>
                  <Typography fontSize={"14px"}>
                    {currency}
                    {shippingFee}
                  </Typography>
                  <Typography
                    fontSize={"14px"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setIsEditDomesticFee(true)}
                  >
                    {t("seller.modify.Edit")}
                  </Typography>
                </>
              ) : (
                <>
                  <TextField
                    sx={{ m: 0 }}
                    variant="outlined"
                    size="small"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                  />
                  <Typography
                    fontSize={"14px"}
                    sx={{ cursor: "pointer" }}
                    onClick={() => updateDomesticShipping()}
                  >
                    {t("seller.modify.Set")}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Card>
      )}
      {isModify && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              my: 3,
            }}
          >
            <ArrowBack onClick={() => setIsModify(false)} className={"pointer"} />
          </Box>
          <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 0 }}
            maxWidth={"800px"}
          >
            <Avatar
              src={
                watch("attachment")
                  ? URL.createObjectURL(watch("attachment") as File)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="photo preview"
              variant={"square"}
              sx={{ width: "200px", height: "200px", mb: 2 }}
            />

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
                      setValue(
                        "attachment",
                        e.target.files && e.target.files[0]
                      );
                    }}
                  />
                  <Tooltip key="Select Image" title={"Business picture"}>
                    <label htmlFor="attachment">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PhotoCamera fontSize="large" />}
                      >
                        {t("seller.modify.btn_upload")}
                      </Button>
                    </label>
                  </Tooltip>
                </>
              )}
            />
            <FormHelperText sx={{ color: "red" }}>
              {errors?.attachment?.message}
            </FormHelperText>

            <Controller
              name="name"
              control={control}
              render={({ field, formState: { errors } }) => (
                <Box display={"flex"} alignItems={"center"} mb={2}>
                  <Typography width={"150px"} fontSize={"18px"}>
                    {t("seller.modify.Store_Name")}
                  </Typography>
                  <TextField
                    error={!!errors?.name}
                    {...field}
                    variant="outlined"
                    id="Store Name"
                    name="Store Name"
                    fullWidth
                  />
                </Box>
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field, formState: { errors } }) => (
                <Box display={"flex"} alignItems={"center"} mb={2}>
                  <Typography width={"150px"} fontSize={"18px"}>
                    {t("seller.modify.Store_Location")}
                  </Typography>
                  <TextField
                    error={!!errors?.location}
                    {...field}
                    variant="outlined"
                    id="Store Location"
                    name="Store Location"
                    fullWidth
                  />
                </Box>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, formState: { errors } }) => (
                <Box mb={2}>
                  <Typography fontSize={"18px"} mb={1}>
                    {t("seller.modify.Store_Description")}
                  </Typography>
                  <TextField
                    error={!!errors?.description}
                    {...field}
                    variant={"outlined"}
                    id="Store Description"
                    name="Store Description"
                    fullWidth
                    multiline
                    rows={5}
                  />
                </Box>
              )}
            />
            <Button
              fullWidth={isMobile}
              sx={{ alignSelf: { sm: "flex-end" } }}
              variant={"contained"}
              type={"submit"}
              disabled={!sellerIsActive || isLoading}
              // onClick={() => setIsModify(false)}
            >
              {t("seller.modify.modify")} {isLoading && <CircularProgress />}{" "}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};
export default Modify;
