import React, { useEffect, useState } from "react";
import Nav from "../Layouts/Nav";
import Image from "next/image";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import { RssFeed } from '@mui/icons-material';
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ProductCards from "../Utils/ProductCards";
import { TRating, TStoreId } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import ProductWrapper from "../Wappers/StoreWrapper";
import { useScrollPos } from "../../hooks/UseScrollPos";
import { useRouter } from "next/router";
import ContextApi from "../../Store/context/ContextApi";
import { useFollowSeller } from "../../hooks/useDataFetch";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import Cookies from "js-cookie";
import Filter from "../Utils/Filter";
import LanguageModalComponet from "../LanguageModal";

const schema = yup.object().shape({
  filter: yup.string().min(3),
});
type options = {
  category: string;
  filter: string;
};
type TProducts = {
  discount: number;
  title: string;
  updatedAt: string;
  photo: string[];
  condition: string;
  quantity: number;
  price: number;
  owner: TStoreId;
  ratingId: TRating;
  createdAt: string;
  _id: string;
};
interface IProducts {
  products: TProducts[];
  image: string;
  name: string;
  description: string;
  sellerId: string;
  followers;
}

const Brands: React.FC<IProducts> = ({
  products,
  image,
  name,
  description,
  sellerId,
  followers,
}) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const rates = [5, 4, 3, 2, 1, 0];
  const [filterPrice, setFilterPrice] = useState<number>(10);
  const [sellerFollowersCount, setSellerFollowersCount] = useState(followers);
  const isLoggedIn = React.useContext(ContextApi).isLoggedIn;
  const followings = React.useContext(ContextApi).following;
  const [currentUser, setCurrentUser] = useState(null);
  const [productsData, setProducts] = useState<TProducts[]>(products);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const handleSetFollowing = React.useContext(ContextApi).handleSetFollowing;

  const userString = Cookies.get("userInfo");
  const [countryRate, setCountryRate] = useState<number>(1);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  useEffect(() => {
    async function init() {
      const rateRes: any = await getUserCurrencySymbol(userString);
      setCurrencySymbol(rateRes.symbol)
      setCountryRate(rateRes.rate)
    }

    init()
  }, []);

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<options>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      category: "",
      filter: "",
    },
  });

  const onSubmit: SubmitHandler<options> = async (data) => {
    reset();
  };

  const isMatches = useMediaQuery("(max-width: 250px)");
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if(userString){
      setCurrentUser(JSON.parse(userString))
    }
  },[])


  const isCurrentUserTheSeller = () => {
    const seller = products[0]?.owner.owner
    if(currentUser?._id?.toString() === seller?.owner.toString()) return true;
    return false
  }


  useEffect(() => {
    const handleRouteChange = () => {
      Cookies.set("storeScrollPos", window.scrollY.toString(),{expires:3, secure: true });
      // localStorage.setItem("storeScrollPos", window.scrollY.toString());
    };

    
    // const userFollowers = localStorage.getItem("usf");
    const userFollowers = Cookies.get("usf");
    if (userFollowers && JSON.parse(userFollowers).includes(sellerId)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

    router.events.on("routeChangeStart", handleRouteChange);

    // const storedScrollPosition = localStorage.getItem("storeScrollPos");
    const storedScrollPosition = Cookies.get("storeScrollPos");
    const timeout = setTimeout(() => {
      if (storedScrollPosition) {
        window.scrollTo(0, parseInt(storedScrollPosition));
      }
    }, 200);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      clearTimeout(timeout);
    };
  }, []);

  const onSuccess = (data) => {
    if (data.message === "Followed") {
      setIsFollowing(true);
      setSellerFollowersCount(sellerFollowersCount + 1);
    } else {
      setIsFollowing(false);
      setSellerFollowersCount(sellerFollowersCount - 1);
    }

    handleSetFollowing(data.following);
    Cookies.set("usf", JSON.stringify(data.following),{expires:3, secure: true });
    // localStorage.setItem("usf", JSON.stringify(data.following));
  };

  //TODO Add filter function
  const onFilter = (fData) => {
    let newProducts = products    
    if(fData){
      if (fData.pricing == "lowest") {
        newProducts = newProducts.slice().sort((a, b) => a.price - b.price);
      } else {
        newProducts = newProducts.slice().sort((a, b) => b.price - a.price);
      }
      newProducts = newProducts.filter((p) => p.condition == fData.condition)
      
      if (fData.discount == "discount") {
        newProducts = newProducts.filter((p) => p.discount)
      } else if (fData.discount == "noDiscount") {
        newProducts = newProducts.filter((p) => !p.discount)
      }
  
      if (fData.itemOrder == "newListing") {
        const currentDate = new Date();
        newProducts = newProducts.filter((p) => {
          return new Date(p.updatedAt) >= new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        })
      }
    }

    setProducts(newProducts)
  }

  const {
    isLoading,
    mutate: followSeller,
  } = useFollowSeller(onSuccess);

  const handleFollowRequest = () => {
    if (isLoggedIn) {
      followSeller(sellerId);
      return;
    }
    router.push("/login");
  };

  useEffect(() => {
    const filter = watch("filter");

    switch (filter) {
      case "RecentItems":
        let newProducts = products
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setProducts(newProducts);
        break;
      case "AZ":
        let newProduct = products
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
        setProducts(newProduct);
        break;
      case "ZA":
        let newProducs = products
          .slice()
          .sort((a, b) => b.title.localeCompare(a.title));
        setProducts(newProducs);
        break;
      default:
        let newPoducts = products.sort((a, b) => (a.title > b.title ? -1 : 1));
        setProducts(newPoducts);
    }
  }, [watch("filter")]);

  return (
    <>
      <Nav />
      <Card
        elevation={0}
        sx={{
          p: 1,
          borderRadius: "0px",
          minWidth: "98vw",
        }}
      >
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"space-between"}
          mx={2}
        >
          <Stack direction={"row"} sx={{ maxWidth: "400px !important", alignItems: 'center' }}>
            <img
              width={150}
              height={150}
              placeholder="blur"
              className={"storeLogo"}
              src={image}
              alt={"brand Image"}
            />
            <Box className={"storebio"}>
              <Typography fontWeight={600} fontSize={15}>
                {name}
              </Typography>
              <Typography sx={{ mb: 0 }} fontSize={"14px"}>{description}</Typography>
              <Box display={"flex"} alignItems={"center"}>
                <RssFeed sx={{color: "var(--primary)"}} />
                <Typography color={"#0ba659"} fontSize={14} fontWeight={400}>
                  {sellerFollowersCount}{" "}
                  {sellerFollowersCount > 1 ? t("brand.followers") : t("brand.follower")}
                </Typography>
              </Box>
            </Box>
          </Stack>

         {!isCurrentUserTheSeller() && <Button
            variant="outlined"
            className="product__follow__btn"
            size={"small"}
            sx={{
              borderColor: "red",
              height: "30px",
              borderRadius: "45px",
            }}
            onClick={handleFollowRequest}
          >
            {isLoading
              ? t("product.loading")
              : isFollowing
              ? t("product.unfollow")
              : t("product.follow")}
          </Button>}
        </Stack>
      </Card>

      <Card
        elevation={0}
        sx={{ p: 2, borderRadius: "0px", minWidth: "98vw", padding: 0 }}
      >
        <ProductWrapper
          title={name}
          image={image}
          description={description}
          content={`You can find product of ${name} here`}
        >
          <Stack direction={"row"} padding={0} margin={0}>
            <Box width={"100%"}>
              <Box
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Box
                  sx={{
                    px: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontSize={14} fontWeight={400}> {t("home.store")} </Typography>
                  </Box>
                  <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-label" 
                      shrink={false} 
                      sx={{
                        color: "var(--primary)",
                        fontSize: 14,
                        fontWeight: 400,
                      }}
                    >
                      {watch("filter") === "" && t("filter.filter_placeholder")}
                    </InputLabel>
                    <Controller
                      name="filter"
                      control={control}
                      render={({ field, formState: { errors } }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          {...field}
                          variant={"outlined"}
                          sx={{
                            height: 50,
                            bgcolor: "#fff",
                            color: "var(--primary)",
                            borderRadius: "0px",
                            "& .MuiSvgIcon-root": {                              
                              color: "var(--primary)",
                            },
                            "& fieldset": {
                              border: "none"
                            }
                          }}
                        >
                          <MenuItem value={"RecentItems"}>
                            {t("filter.recent_items")}
                          </MenuItem>
                          <MenuItem value={"AZ"}>A-Z</MenuItem>
                          <MenuItem value={"ZA"}>Z-A</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              </Box>
              <Stack>
                {productsData?.length > 0 && (
                  <Grid container spacing={1}>
                    {productsData.map(
                      (
                        {
                          discount,
                          owner,
                          quantity,
                          ratingId,
                          price,
                          _id,
                          title,
                          photo,
                        },
                        index
                      ) => {
                        if (quantity > 0) {
                          return (
                            <Grid
                              key={index}
                              item
                              xs={isMatches ? 12 : 6}
                              sm={4}
                              md={3}
                              lg={2}
                            >
                              <ProductCards
                                discount={discount}
                                owner={owner}
                                rating={ratingId}
                                image={photo}
                                price={price}
                                id={_id}
                                name={title}
                                percent={true}
                                calculateRate={true}
                                countryRate={countryRate}
                                currencySymbol={currencySymbol}
                              />
                            </Grid>
                          );
                        }
                      }
                    )}
                  </Grid>
                )}
              </Stack>

              <Filter onFilter={onFilter} />
            </Box>
          </Stack>
        </ProductWrapper>
      </Card>
      <LanguageModalComponet/>
    </>
  );
};
export default Brands;
