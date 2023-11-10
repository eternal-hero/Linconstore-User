import React, { useEffect, useState } from "react";
import Nav from "../Layouts/Nav";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ProductCards from "../Utils/ProductCards";
import { TRating, TStoreId } from "../../Helpers/Types";
import { useTranslation } from "react-i18next";
import ProductWrapper from "../Wappers/ProductWrapper";
import { useRouter } from "next/router";
import { ArrowDropDown } from "@mui/icons-material";
import Cookies from "js-cookie";
import { getUserCurrencySymbol } from "../../Helpers/Exchange";
import Filter from "../Utils/Filter";
import LanguageModalComponet from "../LanguageModal";

const schema = yup.object().shape({
  category: yup.string().min(3),
  filter: yup.string().min(3),
});
type options = {
  category: string;
  filter: string;
};
type IProducts = {
  _id: string;
  createdAt: string;
  quantity: number;
  title: string;
  price: number;
  updatedAt: string;
  condition: string;
  owner: TStoreId;
  discount: number;
  photo: string[];
  ratingId: TRating;
  subcategory: string;
};
type TCategory = {
  title: string;
  link: string;
  subcategories: string[];
};
type TCat = {
  category: TCategory;
  products: IProducts[];
};
interface ISub {
  data: TCat;
}
const Category: React.FC<ISub> = ({ data }) => {
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
  const { title, subcategories, link } = data.category;
  const { t } = useTranslation();

  const [products, setProducts] = useState<IProducts[]>(data?.products);
  //TODO Add filter function
  const onFilter = (fData) => {
    let newProducts = data?.products
    if (fData) {
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
  const onSubmit: SubmitHandler<options> = async (data) => {
    reset();
  };
  const [subcats, setSubcats] = useState<string[]>([]);
  useEffect(() => {
    const filter = watch("category");
    if (filter === "All") return setProducts(data.products);
    const newProducts = data.products.filter(
      (data) => data.subcategory === filter
    );
    setProducts(newProducts);
  }, [watch("category")]);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.setItem("catScrollPos", window.scrollY.toString());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    const storedScrollPosition = localStorage.getItem("catScrollPos");
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

  useEffect(() => {
    const filter = watch("filter");
    switch (filter) {
      case "Recent Items":
        let newProducts = products
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setProducts(newProducts);
        break;
      case "A-Z":
        let newProduct = products
          .slice()
          .sort((a, b) => a.title.localeCompare(b.title));
        setProducts(newProduct);
        break;
      case "Z-A":
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

  const isMatches = useMediaQuery("(max-width:350px)");
  const isMobile = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <Nav />

      <Card
        elevation={0}
        sx={{
          // my: 1,
          p: 2,
          borderRadius: "0px",
          minWidth: "98vw",
          pl: isMobile ? 0 : 5,
          pb: 0
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          sx={{ mx: 2, maxWidth: "350px !important" }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Typography fontSize={15}>
              {t(`maincategory.${title}`)}&nbsp;/
            </Typography>
            <Typography sx={{ color: "#323232de", fontSize: "15px" }}>
              &nbsp;{products.length} {t("category.items")}
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Card elevation={0} sx={{ p: 2, borderRadius: "0px", minWidth: "98vw", pt: 0 }}>
        <ProductWrapper
          title={title}
          image={link}
          description={`${title} Category | Linconstore`}
          content={`${title} Sub categories | Linconstore`}
        >
          <Box component={"form"} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControl sx={{ minWidth: isMatches ? 120 : 150 }}>
                <InputLabel id="demo-simple-select-label" shrink={false}
                  sx={{
                    color: "var(--primary)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {watch("category") === "" && t("category.sub_category")}
                </InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      size="small"
                      variant={"outlined"}
                      sx={{
                        height: 50,
                        color: "var(--primary)",
                        "& .MuiSvgIcon-root": {
                          color: "var(--primary)"
                        },
                        "& fieldset": {
                          border: "none"
                        }
                      }}
                    >
                      <MenuItem value={"All"}>{t("category.all")}</MenuItem>
                      {subcategories?.map((subcategory, index) => (
                        <MenuItem key={index} value={title + "." + subcategory}>
                          {t(`subcategory.${title}.${subcategory}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <Box sx={{ mx: isMatches ? 0.5 : 0 }} />
              <FormControl sx={{ minWidth: isMatches ? 120 : 150 }}>
                <InputLabel id="demo-simple-select-label" shrink={false}
                  sx={{
                    color: "var(--primary)",
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {watch("filter") === "" && t("category.filter")}
                </InputLabel>
                <Controller
                  name="filter"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      size="small"
                      variant={"outlined"}
                      sx={{
                        height: 50,
                        color: "var(--primary)",
                        "& .MuiSvgIcon-root": {
                          color: "var(--primary)"
                        },
                        "& fieldset": {
                          border: "none"
                        }
                      }}
                    >
                      <MenuItem value={"Recent Items"}>{t("filter.recent_items")}</MenuItem>
                      <MenuItem value={"A-Z"}>A-Z</MenuItem>
                      <MenuItem value={"Z-A"}>Z-A</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              {/*<Button variant={'outlined'} type={'submit'} color={'inherit'} className={'colorReversed'}>Delete Account</Button>*/}
            </Box>
          </Box>
          <Stack>
            <Grid container spacing={1}>
              {products.map(
                (
                  {
                    title,
                    owner,
                    discount,
                    quantity,
                    photo,
                    _id,
                    price,
                    ratingId,
                  },
                  index
                ) => {
                  if (quantity > 0) {
                    return (
                      <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
                        <ProductCards
                          owner={owner}
                          percent={true}
                          discount={discount}
                          name={title}
                          image={photo}
                          price={price}
                          rating={ratingId}
                          id={_id}
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
          </Stack>

          <Filter onFilter={onFilter} />
        </ProductWrapper>
        <LanguageModalComponet />
      </Card>
    </>
  );
};
export default Category;
