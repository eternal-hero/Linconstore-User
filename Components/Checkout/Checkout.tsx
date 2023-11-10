import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  ArrowBack,
  LocalShippingOutlined,
  ReceiptLongOutlined,
  MyLocation,
  Edit,
  Cookie,
} from "@mui/icons-material";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Address from "./Address";
import Nav from "../Layouts/Nav";
import Image from "next/image";
import { useRouter } from "next/router";
import ContextApi from "../../Store/context/ContextApi";
import {
  useGetUserAddress,
  useHandleCheckout,
  useHandlePayment,
} from "../../hooks/useDataFetch";
import { CONTINENT_MAP } from "../../Data/countries";
import { useTranslation } from "react-i18next";
import { useTokenRefetch } from "../../hooks/useRefresh";
import { TStoreId } from "../../Helpers/Types";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import { useCurrency } from "../../hooks/useCurrency";
import { countryCurrency } from "../../Helpers/Exchange";
import { arDZ } from "date-fns/locale";
import { userInfo } from "os";

let isFirst = false;
type IContinents = {
  africa: number;
  asia: number;
  oceania: number;
  southAmerica: number;
  northAmerica: number;
  europe: number;
  antarctica: number;
};
type TContinent = {
  continent: string;
  price: number;
};
interface IProduct {
  price: number;
  country: string;
}
type IShipping = {
  express: IProduct;
  standard: IProduct;
};
type TProducts = {
  title: string;
  shipping: IShipping[];
  price: number;
  photo: string[];
  // ratingId : TRating,
  owner: TStoreId;
  _id: string;
  continents: IContinents[];
};

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
type TVariant = {
  option: string;
  variant: string;
};
type TProduct = {
  name: string;
  photo: string;
  quantity: number;
  price: number;
  variants: TVariant[];
  productId: TProducts;
};

type TCart = {
  bill: number;
  products: TProduct[];
};
const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const currency = useCurrency();
  const isMobile: boolean = useMediaQuery("(max-width: 450px)");
  const isMatches: boolean = useMediaQuery("(max-width: 353px)");
  const isResponsive: boolean = useMediaQuery("(max-width: 900px)");
  const isAddress: boolean = useMediaQuery("(max-width: 520px)");
  const [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false);
  const [stepper, setStepper] = useState<boolean>(false);
  const router = useRouter();
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const [rate, setRate] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<TContact>();
  const [billingAddress, setBillingAddress] = useState<TContact>();
  const [userAddresses, setUserAddresses] = useState<TContact[]>();
  const [continent, setContinent] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [editAddress, setEditAddress] = useState<any>();
  const [products, setProducts] = useState<TProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [totalCartBill, setTotalCartBill] = useState<number>(0);
  const [subTotalCartBill, setSubTotalCartBill] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [expressCost, setExpressCost] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [value, setValue] = React.useState("Express");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  const [currencyLabel, setCurrencyLabel] = useState<string>("gbp");

  useEffect(() => {
    const userString = Cookies.get("userInfo");
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol);
      setCountryRate(rateRes.rate);
      setCurrencyLabel(rateRes.label);
    }

    init();
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const userDataString = Cookies.get("userInfo");
    // const token = localStorage.getItem("token");
    // const userDataString = localStorage.getItem('userInfo')
    if (!token && !isLoggedIn) router.back();

    if (userDataString) {
      setCurrentUser(JSON.parse(userDataString));
    }
  }, [isLoggedIn]);

  const onGetAddressSuccess = (data: TContact[]) => {
    loadDefaultAddress();
    setUserAddresses(data);
    setIsAddressUpdated((prevState) => !prevState);
  };

  useEffect(() => {
    const initialCountry = shippingAddress?.country;
    const findContinent: string = CONTINENT_MAP.find(({ countries }) =>
      countries.includes(initialCountry)
    )?.continent;
    setContinent(findContinent);
  }, [shippingAddress]);

  const { isLoading, refetch, isFetched } =
    useGetUserAddress(onGetAddressSuccess);

  const handleRefetch = () => {
    refetch();
  };

  const onCheckoutSuccess = (data: TCart) => {
    setProducts(data.products);
    let total = 0;
    data.products.map((product) => {
      const productObj = product.productId;
      const price = product.price;
      const quantity = product.quantity;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const sellerRate = currency(productObj.owner.currency);
      total = total + (quantity * (price * sellerRate)) / countryRate;
    });
    setSubTotalCartBill(total);
    setTotalCartBill(total);
    setIsLoaded((prevState) => !prevState);
  };

  const {
    isLoading: isChecking,
    data,
    refetch: refresh,
  } = useHandleCheckout(onCheckoutSuccess);
  useTokenRefetch(refresh);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const loadDefaultAddress = () => {
    const billingAddress = localStorage.getItem("addb");
    const shippingAddress = localStorage.getItem("adds");
    if (billingAddress) {
      setBillingAddress(JSON.parse(billingAddress));
    }
    if (shippingAddress) {
      setShippingAddress(JSON.parse(shippingAddress));
    }
  };

  useEffect(() => {
    loadDefaultAddress();
    const exchangeRate = localStorage.getItem("sellerRate");
    if (exchangeRate) {
      setRate(Number(exchangeRate));
    }
  }, []);

  useEffect(() => {
    if (billingAddress || isChecked) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [billingAddress, isChecked]);

  const paymentSuccess = (data: any) => {
    // alert(`data after payment-------------------------${data.url}`);
    router.push(data.url);
  };

  const handleBilling = () => {
    setType("billing");
    setStepper((cur) => !cur);
  };

  useEffect(() => {
    const shippingPlaceholder: number[] = [];
    const expressPlaceholder: number[] = [];
    products.forEach((product) => {
      const shipping = product.productId.shipping;

      const continents = product.productId?.continents;
      const continentPlaceholder: TContinent[] = [];
      if (continents?.length > 0) {
        if (continents[0].africa) {
          const africa = {
            continent: "Africa",
            price: continents[0].africa,
          };
          continentPlaceholder.push(africa);
          const europe = {
            continent: "Europe",
            price: continents[0].europe,
          };
          continentPlaceholder.push(europe);
          const northAmerica = {
            continent: "North America",
            price: continents[0].northAmerica,
          };
          const southAmerica = {
            continent: "South America",
            price: continents[0].southAmerica,
          };
          continentPlaceholder.push(southAmerica);
          const asia = {
            continent: "Asia",
            price: continents[0].asia,
          };
          continentPlaceholder.push(asia);
          const antarctica = {
            continent: "Antarctica",
            price: continents[0].antarctica,
          };
          continentPlaceholder.push(antarctica);
          const priceData: TContinent = continentPlaceholder.find(
            (x) => x.continent === continent
          );
          shippingPlaceholder.push(priceData?.price);
          expressPlaceholder.push(priceData?.price);
        }
      }
      if (shipping?.length > 0) {
        if (shipping[0].standard.price) {
          const userCountry = currentUser.country;
          const userCountryName: any = countryCurrency.find(
            (value) => value.abb === userCountry
          );
          const sellerCountry = product.productId.owner.owner.location;
         
          const sellerRate = currency(product.productId.owner.currency);

          if (userCountryName.country.toLowerCase().replace(/\s+/g, '') === sellerCountry.toLowerCase()) {
            localStorage.setItem("donesticShipping", (product.productId.owner.domesticShipping.standard).toString());
            shippingPlaceholder.push(
              (product.productId.owner.domesticShipping.standard * sellerRate) / countryRate
            );
            expressPlaceholder.push(
              (product.productId.owner.domesticShipping.standard * sellerRate) / countryRate
            );
          } else {
            shippingPlaceholder.push(
              (shipping[0].standard.price * sellerRate) / countryRate
            );
            expressPlaceholder.push(
              (shipping[0].express.price * sellerRate) / countryRate
            );
          }
        }
      }
    });
    const shippingTotal: number = shippingPlaceholder.reduce(
      (a, b) => a + b,
      0
    );
    const shippingExpress: number = expressPlaceholder.reduce(
      (a, b) => a + b,
      0
    );
    setShippingCost(Number(shippingTotal));
    setExpressCost(Number(shippingExpress));
  }, [isFetching, products]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsFetching((prevState) => !prevState);
    }, 700);
    return () => clearTimeout(timeOut);
  }, []);
 
  const handlePayment = () => {
    localStorage.removeItem("addb");
    localStorage.removeItem("adds");
    const address = shippingAddress ? shippingAddress._id : billingAddress._id;
    localStorage.setItem("address", address);
    // Cookies.set("address", address, { expires: 7 });
    const shipping: number = value === "Standard" ? shippingCost : expressCost;
    const data = {
      shipping,
      type: value,
      currencyLabel,
      address: address,
      countryRate,
    };
    // alert(`address-----------------------------------: ${data.address}`);
    // alert(JSON.stringify(data));
    pay(data);
  };

  const { isLoading: isPaying, mutate: pay } = useHandlePayment(paymentSuccess);

  useEffect(() => {
    const shipping: number = value === "Standard" ? shippingCost : expressCost;
    const totalBill: number = shipping + subTotalCartBill;
    setTotalCartBill(Number(totalBill));
  }, [value, shippingCost, expressCost]);

  const isScreenLargerThanSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  return (
    <>
      {!stepper && (
        <>
          <Head>
            <title>{t("pagetitle.Check_out")}</title>
            <meta
              name={"Please proceed with your order"}
              content={
                "Please proceed your order " + "in purchase to complete order"
              }
            />
            <link rel="icon" href="/favicon-store.ico" />
          </Head>
          <Nav />
          <Box component="main" mx={isScreenLargerThanSm ? 3 : 0}>
            <CssBaseline />
            <Box
              sx={{
                marginTop: 3,
                padding: 3,
                marginBottom: 3,
                display: "flex",
                flexDirection: "column",
                // alignItems: 'center',
                // height: 600,
                justifyContent: "center",
              }}
            >
              <Stack direction={"row"} alignItems={"center"}>
                <Stack width={"45%"}>
                  <span>
                    <ArrowBack
                      onClick={() => router.back()}
                      className={"pointer"}
                    />
                  </span>
                </Stack>
              </Stack>
              <Typography variant={"h6"} component={"p"}>
                {/* {products.length} {t("checkout.items_label")} */}
                {isChecking && <CircularProgress />}
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={8} xs={12}>
                  <Stack spacing={0} sx={{ my: 3 }}>
                    {products.length > 0 &&
                      products.map(
                        (
                          { name, variants, photo, quantity, price, productId },
                          index
                        ) => {
                          const sellerRate = currency(productId.owner.currency);
                          return (
                            <Box key={index + productId._id}>
                              <Box
                                sx={{
                                  my: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    p: 2,
                                    gap: 2,
                                    border: "1px solid #c3c3c3",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <Image
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                    placeholder="blur"
                                    blurDataURL={
                                      "https://via.placeholder.com/300.png/09f/fff"
                                    }
                                    src={photo}
                                    alt={"image of product"}
                                  />
                                  <Box
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    width={"100%"}
                                    alignItems={"center"}
                                    position={"relative"}
                                  >
                                    <Box
                                      display={"flex"}
                                      flexDirection={"column"}
                                      width={"150px"}
                                    >
                                      <Typography
                                        sx={{
                                          fontWeight: 500,
                                          mb: 1,
                                          position: "absolute",
                                          top: 0,
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          width: isMobile ? "100px" : "200px",
                                          fontSize: isMobile ? "14px" : "15px",
                                        }}
                                      >
                                        {name}
                                      </Typography>
                                      {variants.map((variant) => (
                                        <Box
                                          key={variant.option}
                                          display={"flex"}
                                          flexDirection={"row"}
                                        >
                                          <Typography
                                            fontSize={
                                              !isMobile ? "16px" : "14px"
                                            }
                                          >
                                            {variant.variant}:
                                          </Typography>
                                          <Typography
                                            fontSize={
                                              !isMobile ? "16px" : "14px"
                                            }
                                          >
                                            {variant.option}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                    <Box
                                      position={"absolute"}
                                      left={"50%"}
                                      color={"#00a859"}
                                    >
                                      {quantity}
                                    </Box>
                                    <Box
                                      display={"flex"}
                                      flexDirection={"column"}
                                      justifyContent={"space-between"}
                                      alignItems={"flex-end"}
                                      gap={2}
                                      width={"50px"}
                                      position={"absolute"}
                                      top={0}
                                      right={0}
                                    >
                                      <Typography color={"#00a859"}>
                                        {currencySymbol}&nbsp;&nbsp;
                                        {(
                                          (price * sellerRate) /
                                          countryRate
                                        ).toFixed(2)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          );
                        }
                      )}
                  </Stack>
                  {!shippingAddress && (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      mb={2}
                    >
                      <Box display={"flex"} gap={2}>
                        <LocalShippingOutlined sx={{ color: "#00a859" }} />
                        <Typography fontSize={14}>
                          {t("checkout.ADD_SHIPPING_ADDRESS")}
                        </Typography>
                      </Box>
                      <Button
                        sx={{ p: 2, fontWeight: 400, fontSize: 12 }}
                        variant="contained"
                        onClick={() => setStepper((cur) => !cur)}
                      >
                        {t("checkout.btn_add_label")}
                      </Button>
                    </Box>
                  )}
                  {shippingAddress && (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      mb={2}
                    >
                      <Box display={"flex"} gap={2} alignItems={"center"}>
                        <MyLocation sx={{ color: "#00a859" }} />
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Typography fontWeight={700}>
                            {t("checkout.shipping_address_label")}
                          </Typography>
                          <Box display={"flex"} gap={2}>
                            <Typography>
                              {shippingAddress.firstName +
                                shippingAddress.lastName}
                            </Typography>
                            <Typography>
                              {shippingAddress.phoneNumber}
                            </Typography>
                          </Box>
                          <Typography>
                            {shippingAddress.address +
                              ", " +
                              shippingAddress.country}
                          </Typography>
                        </Box>
                      </Box>

                      <Edit
                        sx={{ color: "#00a859", cursor: "pointer" }}
                        onClick={() => setStepper((cur) => !cur)}
                      />
                    </Box>
                  )}
                  {!billingAddress && (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Box display={"flex"} gap={2}>
                        <ReceiptLongOutlined sx={{ color: "#00a859" }} />
                        <Typography fontSize={14}>
                          {t("checkout.ADD_BILLING_ADDRESS")}
                        </Typography>
                      </Box>
                      <Button
                        sx={{ p: 2, fontWeight: 400, fontSize: 12 }}
                        variant="contained"
                        onClick={handleBilling}
                      >
                        {t("checkout.btn_add_label")}
                      </Button>
                    </Box>
                  )}
                  {billingAddress && (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      mb={2}
                    >
                      <Box display={"flex"} gap={2} alignItems={"center"}>
                        <MyLocation sx={{ color: "#00a859" }} />
                        <Box display={"flex"} flexDirection={"column"} gap={2}>
                          <Typography fontWeight={700}>
                            {t("checkout.Billing_address")}
                          </Typography>
                          <Box display={"flex"} gap={2}>
                            <Typography>
                              {billingAddress.firstName +
                                billingAddress.lastName}
                            </Typography>
                            <Typography>
                              {billingAddress.phoneNumber}
                            </Typography>
                          </Box>
                          <Typography>
                            {billingAddress.address +
                              ", " +
                              billingAddress.country}
                          </Typography>
                        </Box>
                      </Box>
                      <Edit
                        sx={{ color: "#00a859", cursor: "pointer" }}
                        onClick={() => {
                          handleBilling();
                        }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item md={4} xs={12}>
                  <Box
                    p={isScreenLargerThanSm ? 2 : 0}
                    display={"flex"}
                    flexDirection={"column"}
                    sx={{
                      position: !isResponsive && "fixed",
                      top: !isResponsive && 140,
                      width: !isResponsive ? "30vw" : "100%",
                    }}
                  >
                    <Box mb={2}>
                      <Typography mb={1} fontSize={15}>
                        {t("checkout.code_title")}
                      </Typography>
                      <InputLabel sx={{ mb: 1 }} htmlFor="coupon">
                        {t("checkout.code_label")}
                      </InputLabel>
                      <TextField
                        id="coupon"
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <Button
                                variant={"contained"}
                                className={"buttonClass"}
                                sx={{
                                  position: "absolute",
                                  right: "0px",
                                  height: "100%",
                                  px: 3,
                                  fontWeight: 400,
                                  fontSize: 12,
                                }}
                              >
                                {t("checkout.btn_use_label")}
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                      />
                    </Box>

                    <Box display={"flex"} flexDirection={"column"} mb={2}>
                      <Typography fontSize={15} mb={1}>
                        {t("checkout.shipping_method_label")}
                      </Typography>
                      <FormControl>
                        <FormLabel id="Shipping" />
                        <RadioGroup
                          aria-labelledby="payment"
                          name="payment"
                          value={value}
                          onChange={handleChange}
                          sx={{ alignItems: "start" }}
                        >
                          <FormControlLabel
                            sx={{
                              width: "100%",
                              display: "flex",
                              mb: 1,
                              "& .MuiFormControlLabel-label": {
                                display: "flex",
                                width: "100%",
                              },
                              "& .MuiFormControlLabel-label p": {
                                fontSize: 14,
                              },
                            }}
                            value="Standard"
                            control={
                              <Radio
                                sx={{
                                  "&, &.Mui-checked": {
                                    color: "#00a859",
                                  },
                                }}
                              />
                            }
                            label={
                              <>
                                <Box
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  width={"100%"}
                                  alignItems={"center"}
                                >
                                  <Box
                                    sx={{ pt: 1 }}
                                    display={"flex"}
                                    flexDirection={"column"}
                                    width={"100%"}
                                  >
                                    <Typography variant={"body1"}>
                                      {t("checkout.standard_item_label")}
                                    </Typography>
                                    <Typography variant={"caption"}>
                                      {t("checkout.period_label")}
                                    </Typography>
                                  </Box>
                                  <Typography color={"#00a859"}>
                                    {currencySymbol}&nbsp;&nbsp;
                                    {(shippingCost).toFixed(2)}
                                  </Typography>
                                </Box>
                              </>
                            }
                          />
                          <FormControlLabel
                            sx={{
                              width: "100%",
                              display: "flex",
                              "& .MuiFormControlLabel-label": {
                                display: "flex",
                                width: "100%",
                              },
                              "& .MuiFormControlLabel-label p": {
                                fontSize: 14,
                              },
                            }}
                            value="Express"
                            control={
                              <Radio
                                sx={{
                                  "&, &.Mui-checked": {
                                    color: "#00a859",
                                  },
                                }}
                              />
                            }
                            label={
                              <>
                                <Box
                                  display={"flex"}
                                  justifyContent={"space-between"}
                                  width={"100%"}
                                  alignItems={"center"}
                                >
                                  <Box>
                                    <Typography variant={"body1"}>
                                      Express
                                    </Typography>
                                    <Typography variant={"caption"}>
                                      {t("checkout.period_check")}
                                    </Typography>
                                  </Box>
                                  <Typography color={"#00a859"}>
                                    {currencySymbol}&nbsp;&nbsp;
                                    {(expressCost).toFixed(2)}
                                  </Typography>
                                </Box>
                              </>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    <Box>
                      <Typography fontSize={15} mb={1}>
                        {t("checkout.Order_Summary")}
                      </Typography>
                      <Box mb={1}>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                        >
                          <Typography fontSize={15}>
                            {t("checkout.subtotal_label")}
                          </Typography>
                          <Typography color={"#00a859"}>
                            {currencySymbol}&nbsp;&nbsp;
                            {Number(subTotalCartBill.toFixed(2))}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                        >
                          <Typography fontSize={15}>
                            {value} {t("checkout.shipping_label")}
                          </Typography>
                          <Typography color={"#00a859"}>
                            {currencySymbol}&nbsp;&nbsp;
                            {value === "Standard"
                              ? (shippingCost).toFixed(2)
                              : (expressCost).toFixed(2)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                        >
                          <Typography fontSize={15}>
                            {t("checkout.total_price_label")}:
                          </Typography>
                          <Typography color={"#00a859"}>
                            &nbsp;{currencySymbol}&nbsp;&nbsp;
                            {totalCartBill.toFixed(2)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Button
                        size={"medium"}
                        type={"submit"}
                        fullWidth
                        onClick={handlePayment}
                        disabled={isPaying || isDisabled}
                        variant={"contained"}
                        className={"buttonClass"}
                      >
                        {t("checkout.pay_with_stripe")}
                        {isPaying && <CircularProgress />}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </>
      )}
      {stepper && (
        <Address
          type={type}
          setType={setType}
          setEditAddress={setEditAddress}
          editAddress={editAddress}
          handleRefetch={handleRefetch}
          setStepper={setStepper}
        />
      )}
      <Box></Box>
    </>
  );
};
export default Checkout;
