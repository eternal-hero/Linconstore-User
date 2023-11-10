import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Select,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { hey, postItemDefaultValue } from "../../../Helpers/Types";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  Add,
  ArrowBack,
  Delete,
  HelpOutline,
  PhotoCamera,
} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Dropzone, { Accept } from "react-dropzone";
import {
  useCreateProduct,
  useGetAllCategories,
} from "../../../hooks/useDataFetch";
import { uploadImages } from "../../../Helpers/utils";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import { categoryTags } from "../../../Helpers/CategoryTags";

type TProduct = {
  price: number;
  country: string;
};
type IShipping = {
  express: TProduct;
  standard: TProduct;
};
type IContinents = {
  africa: number;
  asia: number;
  oceania: number;
  southAmerica: number;
  northAmerica: number;
  europe: number;
  antarctica: number;
};
interface IProduct {
  setStepper: React.Dispatch<boolean>;
  handleRefetch: () => void;
  location: string;
  selectedTemp: any;
}
type Iutil = {
  util: {
    sellerRate: number;
  };
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type IVariant = {
  option: string;
  variant: string;
  price: number;
  stock: number;
};
const AddProduct: React.FC<IProduct> = ({
  setStepper,
  location,
  selectedTemp,
  handleRefetch,
}) => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    title: yup
      .string()
      .required(t("seller.post.add_product.require_msg"))
      .min(4, t("seller.post.add_product.must_be_at_least_4")),
    description: yup
      .string()
      .required(t("seller.post.add_product.require_msg"))
      .min(5, t("seller.post.add_product.must_be_at_least_5")),
    condition: yup
      .string()
      .required(t("seller.post.add_product.require_msg"))
      .min(3, t("seller.post.add_product.must_be_at_least_3")),
    price: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg"))
      .min(1, t("seller.post.add_product.must_be_at_least_1")),
    quantity: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg"))
      .min(1, t("seller.post.add_product.must_be_at_least_1")),
    category: yup
      .string()
      .required(t("seller.post.add_product.you_must_select_a_category")),
    tags: yup.array().of(yup.string()).nullable(),
    // details: yup.string().required("This is required"),
    terms: yup.boolean(),
    test: yup.array().of(
      yup.object().shape({
        stock: yup.array().of(
          yup.object().shape({
            name: yup
              .number()
              .typeError(t("seller.post.add_product.must_be_a_number")),
            price: yup
              .number()
              .typeError(t("seller.post.add_product.must_be_a_number"))
              .min(1, t("seller.post.add_product.price_must_be_grater_than_0")),
            variants: yup.string(),
          })
        ),
      })
    ),
    subcategory: yup.string().required(t("seller.post.add_product.you_must_select_a_sub_category")),
    standard: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    express: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    africa: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    asia: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    europe: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    northAmerica: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    southAmerica: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    oceania: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
    antarctica: yup
      .number()
      .typeError(t("seller.post.add_product.must_be_a_number"))
      .required(t("seller.post.add_product.require_msg")),
  });
  const [categories, setCategories] = useState<string[]>([]);
  const onCategorySuccess = () => { };
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );
  const { data, isLoading: loading } = useGetAllCategories(onCategorySuccess);
  const [subCategories, setSubCategories] = useState([]);

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) return;
    data?.map((value: any) => categories.push(value.title));
  }, [loading]);
  const [isCheck, setIsChecked] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<postItemDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      condition: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      subcategory: "",
      variation: "",
      tags: [],
      details: "",
      terms: false,
      care: "",
      standard: 0,
      express: 0,
      file: undefined,
      asia: 0,
      africa: 0,
      europe: 0,
      southAmerica: 0,
      northAmerica: 0,
      oceania: 0,
      antarctica: 0,
      test: [
        {
          stock: [
            {
              name: 1,
              price: 1,
            },
          ],
        },
      ],
    },
  });
  const [items, setItem] = useState([
    {
      options: {
        id: 1,
        name: "",
        value: [{ name: "" }],
      },
    },
  ]);

  useEffect(() => {
    if (selectedTemp) {
      setValue("template_title", selectedTemp.template_title)
      setValue("title", selectedTemp.title)
      setValue("condition", selectedTemp.condition)
      setValue("category", selectedTemp.category.title)
      setValue("subcategory", selectedTemp.subcategory)
      setValue("price", selectedTemp.price)
      setValue("quantity", selectedTemp.quantity)
      setValue("tags", selectedTemp.tags)
      setValue("details", selectedTemp.shippingDetail)
      setValue("care", selectedTemp.instruction)
      setValue("standard", selectedTemp.shipping[0].standard.price)
      setValue("express", selectedTemp.shipping[0].express.price)
    }
  }, [selectedTemp]);

  const category = watch("category");
  const tag = watch("tags");
  const subcategory = watch("subcategory");

  useEffect(() => {
    const subTags = categoryTags.find((x) => x.key === category);
    if (subTags) {
      setTags(subTags.category.map((tag) => `${category}.${tag}`));
    }
  }, [category]);
  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { value } = event.target;
    const values = [...items];
    values[index].options.name = value;
    setItem(values);
  };

  const addItem = () => {
    setItem((prevState) => [
      ...prevState,
      {
        options: {
          id: prevState.length + 1,
          name: "",
          value: [{ name: "" }],
        },
      },
    ]);
  };

  const removeItem = (index: number) => {
    let option = [...items];
    // option.splice(index , 1);
    setItem((prevState) => [
      ...prevState.filter((data) => data.options.id !== index),
    ]);
  };
  const acceptedFileTypes = {
    "image/*": [".jpeg", ".jpg", ".png"],
  };

  const handleAddShare = (index: number) => {
    const values = [...items];
    values[index].options.value = [
      ...values[index].options.value,
      { name: "" },
    ];
    setItem(values);
  };
  const removeItemName = (id: number, parIndex: number) => {
    const newItem = [...items];
    newItem.forEach((data, parentIndex) =>
      data.options.value.forEach((s, index) => {
        if (index === id && parIndex === parentIndex) {
          return data.options.value.splice(index, 1);
        }
      })
    );
    setItem(newItem);
    //     this.setState({
    //         value: this.state.value.filter((s, sidx) => idx !== sidx)
    //     });
  };
  //
  //
  const price = watch("price");

  const validateProductStock = (index, stock) => {
    const quantity = watch(`test.${index}.stock`)?.reduce(
      (index, { name }) => index + Number.parseInt(name as unknown as string),
      0
    );
    if (quantity > Number(stock)) {
      return t("seller.post.add_product.must_not_be_greater_than_stock");
    }
    if (quantity < Number(stock)) {
      return t("seller.post.add_product.must_not_be_less_than_stock");
    }

    return "";
  };

  useEffect(() => {
    if (price > 0) {
      const testArray: hey[] = watch("test");
      const updatedTestArray = testArray.map((item) => ({
        ...item,
        stock: item.stock.map((stockItem) => ({
          ...stockItem,
          price: price,
        })),
      }));
      setValue("test", updatedTestArray);
    }
  }, [price]);
  const handleNameChange = (
    idx: number,
    parIndex: number,
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const { value } = event.target;
    const newItem = [...items];
    newItem.forEach((data, parentIndex) =>
      data.options.value.forEach((s, index) => {
        if (index === idx && parIndex === parentIndex) {
          s.name = value;
        }
      })
    );

    setItem(newItem);
  };
  useEffect(() => {
    const category = watch("category");
    const filterCategory = data?.filter(
      (categori) => categori.title === category
    );
    if (filterCategory?.length > 0) {
      setSubCategories(
        filterCategory[0].subcategories.map(
          (subcategory) => `${category}.${subcategory}`
        )
      );
    }
  }, [watch("category")]);
  const router = useRouter();
  const onSuccess = (data: object) => {
    reset();
    handleRefetch();
    setStepper(false);
  };
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { isLoading, error, mutate, isError } = useCreateProduct(onSuccess);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(rateDispatch);
  useEffect(() => {
    if (!rate) {
      const rateExchange = localStorage.getItem("rateSeller");
      setRate(parseInt(rateExchange));
    }
  }, [rateDispatch]);

  /*
  make sure the variants quantity
   matched the product quantity
  */

  const isVariantStockValid = (variantPlaceholder, quantity) => {
    const result = variantPlaceholder.reduce((acc, curr) => {
      const existingVariant = acc.find((item) => item.variant === curr.variant);
      if (existingVariant) {
        existingVariant.stock += curr.stock;
      } else {
        acc.push({ variant: curr.variant, stock: curr.stock });
      }
      return acc;
    }, []);

    // Filter the items where the result variant has stock less than 5
    const resultLessThanQuantity = result.filter(
      (item) => item.stock < quantity
    );

    return resultLessThanQuantity;
  };

  //submit the add product form
  const onSubmit: SubmitHandler<postItemDefaultValue> = async (data) => {
    setIsUploading(true);
    const photo = await uploadImages(data.file);
    setIsUploading(false);
    const {
      antarctica,
      asia,
      africa,
      northAmerica,
      southAmerica,
      europe,
      oceania,
      price,
    } = data;
    const { express, standard } = data;
    const shipping: IShipping[] = [
      {
        express: {
          price: Number(express.toFixed(2)),
          country: location,
        },
        standard: {
          price: Number(standard.toFixed(2)),
          country: location,
        },
      },
    ];
    const continents: IContinents[] = [
      {
        africa,
        asia,
        antarctica,
        oceania,
        europe,
        northAmerica,
        southAmerica,
      },
    ];
    setIsUploading(false);
    const { test } = data;
    const variantPlaceholder: IVariant[] = [];
    if (items.length > 0) {
      items.map(
        (data, index) =>
          data.options.name !== "" &&
          data.options.value.map((name, id) => {
            const option = name.name;
            const variant = data.options.name;
            const variantPrice =
              Number(test[index].stock[id].price.toFixed(2)) ||
              Number(price.toFixed(2));
            const stock = test[index].stock[id].name;
            const newData: IVariant = {
              variant,
              option,
              price: variantPrice,
              stock,
            };
            variantPlaceholder.push(newData);
          })
      );

      const stockMatch = isVariantStockValid(variantPlaceholder, data.quantity);

      if (stockMatch.length !== 0) {
        return;
      }

      if (isGlobal) {
        const createProduct = {
          ...data,
          price: Number(price.toFixed(2)),
          subcategory: data.subcategory,
          shippingDetail: data.details,
          instruction: data.care,
          photo,
          isGlobal,
          continents,
          variants: variantPlaceholder,
        };
        mutate(createProduct);
      } else {
        const createProduct = {
          ...data,
          price: Number(price.toFixed(2)),
          subcategory: data.subcategory,
          shippingDetail: data.details,
          instruction: data.care,
          shipping,
          photo,
          isGlobal,
          variants: variantPlaceholder,
        };
        mutate(createProduct);
      }
    } else {
      if (isGlobal) {
        const createProduct = {
          ...data,
          subcategory: data.subcategory,
          shippingDetail: data.details,
          instruction: data.care,
          price: price,
          isGlobal,
          photo,
          continents,
        };
        mutate(createProduct);
      } else {
        const createProduct = {
          ...data,
          price: price,
          subcategory: data.subcategory,
          shippingDetail: data.details,
          instruction: data.care,
          shipping,
          isGlobal,
          photo,
        };
        mutate(createProduct);
      }
    }
  };
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const stock = watch("quantity");

  const onGlobalChangeHandler = () => {
    setIsGlobal((prevState) => !prevState);
  };

  return (
    <>
      <Box>
        <ArrowBack onClick={() => setStepper(false)} className={"pointer"} />
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        {/*{loginLoading && <Loader/>}*/}
        <Card
          elevation={1}
          sx={{
            background: "white",
            // border: "2px solid #000",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            // maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Stack
            spacing={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Controller
              control={control}
              name="file"
              rules={{
                required: {
                  value: true,
                  message: t("seller.post.add_product.require_msg"),
                },
              }}
              render={({ field: { onChange, onBlur }, fieldState }) => (
                <Dropzone
                  noClick
                  accept={acceptedFileTypes as unknown as Accept}
                  onDrop={(acceptedFiles) => {
                    setValue("file", acceptedFiles as unknown as FileList[], {
                      shouldValidate: true,
                    });
                  }}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    open,
                    isDragActive,
                    acceptedFiles,
                  }) => (
                    <div>
                      <div
                        style={{
                          backgroundColor: isDragActive
                            ? `#808080`
                            : "transparent",
                        }}
                        {...getRootProps()}
                      >
                        <input
                          {...getInputProps({
                            id: "spreadsheet",
                            onChange,
                            onBlur,
                          })}
                        />

                        {/*<p>*/}
                        {/*    <button type="button" onClick={open}>*/}
                        {/*        Choose a file*/}
                        {/*    </button>{' '}*/}
                        {/*    or drag and drop*/}
                        {/*</p>*/}
                        <Grid container>
                          {acceptedFiles.length > 0 &&
                            acceptedFiles.map((file, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Avatar
                                  variant={"square"}
                                  src={URL.createObjectURL(file)}
                                  alt="photo preview"
                                  sx={{
                                    width: "200px",
                                    height: "200px",
                                    mb: 2,
                                  }}
                                />
                              </Grid>
                            ))}
                        </Grid>
                        {acceptedFiles.length === 0 && (
                          <Avatar
                            variant={"square"}
                            src={
                              "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt="photo preview"
                            sx={{ width: "200px", height: "200px", mb: 2 }}
                          />
                        )}
                        <div>
                          {fieldState.error && (
                            <span role="alert">{fieldState.error.message}</span>
                          )}
                        </div>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCamera fontSize="large" />}
                          onClick={open}
                        >
                          {t("seller.post.add_product.upload_btn")}
                        </Button>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
          </Stack>
        </Card>
        <Box
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          gap={2}
        >
          <Box boxShadow={"0 2px 12px 0 rgba(0,0,0,0.4)"} width={"100%"}>
            <Controller
              name="title"
              control={control}
              render={({ field, formState: { errors } }) => (
                <TextField
                  error={!!errors?.title}
                  helperText={errors?.title?.message}
                  {...field}
                  id={t("seller.post.add_product.product_title")}
                  label={t("seller.post.add_product.product_title")}
                  name={t("seller.post.add_product.product_title")}
                  autoComplete={t("seller.post.add_product.product_title")}
                  sx={{ bgcolor: "white", boxShadow: "" }}
                  variant="outlined"
                  color="primary"
                  fullWidth
                />
              )}
            />
          </Box>
          <Box width={"100%"}>
            <FormControl
              fullWidth
              sx={{
                bgcolor: "white",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              }}
            >
              <InputLabel shrink={false}>
                {watch("condition") === "" &&
                  t("seller.post.add_product.condition")}
              </InputLabel>
              <Controller
                name="condition"
                control={control}
                render={({ field, formState: { errors } }) => (
                  <Select
                    {...field}
                    variant={"outlined"}
                    required
                    fullWidth
                    error={!!errors?.condition}
                  // helperText={errors?.category?.message}
                  >
                    <MenuItem value={"New"}>
                      {t("seller.post.add_product.new")}
                    </MenuItem>
                    <MenuItem value={"Used"}>
                      {t("seller.post.add_product.used")}
                    </MenuItem>
                  </Select>
                )}
              />
              {errors.condition && (
                <FormHelperText sx={{ color: "red" }}>
                  {errors.condition.message}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
        </Box>

        <Controller
          control={control}
          name="description"
          render={({ field, formState: { errors } }) => (
            <TextField
              error={!!errors?.description}
              helperText={errors?.description?.message}
              {...field}
              id={t("seller.post.add_product.product_description")}
              label={t("seller.post.add_product.product_description")}
              name={t("seller.post.add_product.product_description")}
              autoComplete={t("seller.post.add_product.product_description")}
              type="text"
              multiline
              rows={5}
              fullWidth
              sx={{
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                bgcolor: "white",
                mt: 2,
              }}
            />
          )}
        />

        <Box
          display={"flex"}
          gap={!isMobile && 2}
          justifyContent={"space-between"}
          flexDirection={isMobile ? "column" : "row"}
        >
          <Controller
            control={control}
            name="category"
            defaultValue={"Pet"}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Autocomplete
                id="cats-options"
                fullWidth
                options={categories}
                value={category}
                getOptionLabel={(cat) => (cat && t(`maincategory.${cat}`))}
                renderInput={(params) => (
                  <TextField
                    sx={{
                      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                      bgcolor: "white",
                      mt: 2,
                    }}
                    {...params}
                    value={categories[0]}
                    variant="outlined"
                    required
                    fullWidth
                    error={!!errors?.category}
                    helperText={errors?.category?.message}
                    label={t("seller.post.add_product.category_field")}
                    placeholder={t(
                      "seller.post.add_product.category_field_placeholder"
                    )}
                  />
                )}
                onChange={(e, data) => onChange(data)}
              />
            )}
          />

          <Controller
            control={control}
            name="subcategory"
            defaultValue={"Pet"}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <Autocomplete
                id="sub categories"
                fullWidth
                value={subcategory}
                options={subCategories}
                getOptionLabel={(cat) => cat && t(`subcategory.${cat}`)}
                noOptionsText={t("subcategory.no_options")}
                renderInput={(params) => (
                  <TextField
                    sx={{
                      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                      bgcolor: "white",
                      mt: 2,
                    }}
                    {...params}
                    value={subCategories[0]}
                    variant="outlined"
                    required
                    fullWidth
                    error={!!errors?.subcategory}
                    helperText={errors?.subcategory?.message}
                    label={t("seller.post.add_product.sub_category")}
                    placeholder={t(
                      "seller.post.add_product.sub_category_placeholder"
                    )}
                  />
                )}
                onChange={(e, data) => onChange(data)}
              />
            )}
          />
        </Box>

        <Box
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          justifyContent={"space-between"}
          gap={2}
        >
          <Controller
            control={control}
            name="price"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                  mt: 2,
                  "& input[type=number]": {
                    "-moz-appearance": "textfield",
                    "&::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "&::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  },
                }}
                fullWidth
                error={!!errors?.price}
                helperText={errors?.price?.message}
                {...field}
                label={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
                name={`${currency} ${t("seller.post.add_product.price_title")}`}
                autoComplete={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
                id={`${currency} ${t("seller.post.add_product.price_title")}`}
                type="number"
              />
            )}
          />

          <Controller
            control={control}
            name="quantity"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                  mt: 2,
                  "& input[type=number]": {
                    "-moz-appearance": "textfield",
                    "&::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "&::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  },
                }}
                fullWidth
                error={!!errors?.quantity}
                helperText={errors?.quantity?.message}
                {...field}
                id={t("seller.post.add_product.quantityStock")}
                label={t("seller.post.add_product.quantityStock")}
                name={t("seller.post.add_product.quantityStock")}
                autoComplete={t("seller.post.add_product.quantityStock")}
                type="number"
              />
            )}
          />
        </Box>

        <Controller
          control={control}
          name="tags"
          // defaultValue={'shopping'}
          render={({ field: { onChange, value }, formState: { errors } }) => (
            <Autocomplete
              id="tags"
              fullWidth
              options={tags}
              autoSelect
              value={tag}
              freeSolo
              multiple={true}
              getOptionLabel={(cat) => cat && t(`categoryTags.${cat}`)}
              renderInput={(params) => (
                <TextField
                  sx={{
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                    bgcolor: "white",
                    mt: 2,
                  }}
                  {...params}
                  fullWidth
                  // value={'shopping'}
                  variant="outlined"
                  required
                  error={!!errors?.tags}
                  helperText={errors?.tags?.message}
                  label={t("seller.post.add_product.tags")}
                  placeholder={t("seller.post.add_product.tags_placeholder")}
                />
              )}
              onChange={(e, data) => onChange(data)}
            />
          )}
        />

        {!isGlobal && (
          <Card
            elevation={1}
            sx={{
              background: "white",
              maxWidth: { xs: "auto", lg: "auto" },
              my: 2,
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: "645px", width: "100%", background: "white" }}
                aria-label="stats table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      {t("seller.post.add_product.shipping_title")}
                    </TableCell>
                    <TableCell align="left">
                      {t("seller.post.add_product.price_title")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {t("seller.post.add_product.ship_faq1")}
                      <Tooltip
                        placement={"top-start"}
                        title={t("seller.post.add_product.ship_faq1_tooltip")}
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="standard"
                        render={({ field, formState: { errors } }) => (
                          <TextField
                            sx={{
                              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                              bgcolor: "white",
                            }}
                            error={!!errors?.standard}
                            helperText={errors?.standard?.message}
                            required={true}
                            fullWidth
                            {...field}
                            id={`${currency} ${t(
                              "seller.post.add_product.standard_title"
                            )} `}
                            label={`${currency} ${t(
                              "seller.post.add_product.standard_title"
                            )} `}
                            name={`${currency} ${t(
                              "seller.post.add_product.standard_title"
                            )} `}
                            autoComplete={`${currency} ${t(
                              "seller.post.add_product.standard_title"
                            )} `}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {t("seller.post.add_product.ship_faq2")}
                      <Tooltip
                        placement={"top-start"}
                        title={t("seller.post.add_product.ship_faq2_tooltip")}
                      >
                        <IconButton aria-label="help">
                          <HelpOutline />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="left">
                      <Controller
                        control={control}
                        name="express"
                        render={({ field, formState: { errors } }) => (
                          <TextField
                            sx={{
                              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                              bgcolor: "white",
                            }}
                            error={!!errors?.express}
                            helperText={errors?.express?.message}
                            required={true}
                            fullWidth
                            {...field}
                            id={`${currency} ${t(
                              "seller.post.add_product.express_shipping"
                            )}`}
                            label={`${currency} ${t(
                              "seller.post.add_product.express_shipping"
                            )}`}
                            name={`${currency} ${t(
                              "seller.post.add_product.express_shipping"
                            )}`}
                            autoComplete={`${currency} ${t(
                              "seller.post.add_product.express_shipping"
                            )}`}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <Box
          display={"flex"}
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <Controller
            control={control}
            name="care"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                }}
                error={!!errors?.care}
                helperText={errors?.care?.message}
                required={true}
                fullWidth
                multiline
                rows={5}
                {...field}
                variant="outlined"
                id={t("seller.post.add_product.care_instruction")}
                label={t("seller.post.add_product.care_instruction")}
                name={t("seller.post.add_product.care_instruction")}
                autoComplete={t("seller.post.add_product.care_instruction")}
              />
            )}
          />
          <Controller
            control={control}
            name="details"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                }}
                error={!!errors?.details}
                helperText={errors?.details?.message}
                required={true}
                {...field}
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                id={t("seller.post.add_product.shipping_details")}
                name={t("seller.post.add_product.shipping_details")}
                label={t("seller.post.add_product.shipping_details")}
                autoComplete={t("seller.post.add_product.shipping_details")}
              />
            )}
          />
        </Box>

        <Card
          elevation={1}
          sx={{
            background: "white",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            maxWidth: { xs: "auto", lg: "auto" },
            my: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant={"body1"}>
              {t("seller.post.add_product.variant_title")}
            </Typography>
            <Stack direction={"row"}>
              <Checkbox
                color="primary"
                value={isCheck}
                sx={{ maxWidth: 25 }}
                onClick={() => {
                  setIsChecked((prevState) => !prevState);
                }}
              />
              <Typography mt={1} mx={1} variant={"body1"}>
                {t("seller.post.add_product.checkBox_title")}
              </Typography>
            </Stack>
            <Box>
              {isCheck && (
                <Box>
                  {items.map((data, index) => {
                    return (
                      <Box key={index}>
                        <Grid container spacing={1} alignItems="flex-end">
                          <Grid item xs={isMobile ? 11 : 2}>
                            <TextField
                              label={
                                t("seller.post.add_product.variant_type") +
                                " " +
                                (index + 1)
                              }
                              required
                              value={data.options?.name}
                              variant="standard"
                              color={"primary"}
                              onChange={(event) => handleChange(index, event)}
                              fullWidth={isMobile}
                              helperText={t(
                                "seller.post.add_product.color_size_material_style"
                              )}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <div
                              className="font-icon-wrapper"
                              onClick={(event) => removeItem(data.options.id)}
                            >
                              <IconButton aria-label="delete">
                                <Delete />
                              </IconButton>
                            </div>
                          </Grid>
                        </Grid>

                        {data.options.value.map((name, id) => (
                          <Box key={id}>
                            <Grid container spacing={1} alignItems="flex-end">
                              <Grid item xs={isMobile ? 11 : 2}>
                                <TextField
                                  label={
                                    t(
                                      "seller.post.add_product.variant_option"
                                    ) +
                                    " " +
                                    (id + 1)
                                  }
                                  variant="standard"
                                  required
                                  value={name.name}
                                  onChange={(event) =>
                                    handleNameChange(id, index, event)
                                  }
                                  fullWidth={isMobile}
                                />
                              </Grid>
                              <Grid item xs={1}>
                                <div
                                  className="font-icon-wrapper"
                                  onClick={() => removeItemName(id, index)}
                                >
                                  <IconButton aria-label="delete">
                                    <Delete />
                                  </IconButton>
                                </div>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                        <Grid item xs={2}>
                          <div
                            className="font-icon-wrapper"
                            onClick={() => handleAddShare(index)}
                          >
                            <IconButton aria-label="delete">
                              <Add />
                            </IconButton>
                          </div>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {isCheck && (
                <Button
                  onClick={addItem}
                  sx={{ color: "black" }}
                  startIcon={<Add />}
                  color="primary"
                >
                  {t("seller.post.add_product.btn_variant")}
                </Button>
              )}
              {isCheck && items.length > 0 && items[0].options.name !== "" && (
                <>
                  <Typography variant={"h6"}>
                    {t("seller.post.add_product.edit_variant")}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.variant_title")}
                    </Grid>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.price_title")}
                    </Grid>
                    <Grid item xs={4} sm={6} lg={3}>
                      {t("seller.post.add_product.stock_title")}
                    </Grid>
                  </Grid>
                  <Box>
                    {items.map(
                      (data, index) =>
                        data.options.name !== "" &&
                        data.options.value.map((name, id) => {
                          if (name.name !== "") {
                            // @ts-ignore
                            return (
                              <Box key={id + index}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} lg={3} mt={3}>
                                    <Typography>
                                      {data.options.name} / {name.name}
                                    </Typography>
                                    {/*<Controller*/}
                                    {/*    control={control}*/}
                                    {/*    name={`test.${index}.stock.${id}.variants`}*/}
                                    {/*    // defaultValue={`${data.options.name} /  ${name.name}`}*/}
                                    {/*    render={({field : {onChange}, formState: {errors}}) => (*/}
                                    {/*        <TextField*/}
                                    {/*            margin="normal"*/}
                                    {/*            required*/}
                                    {/*            fullWidth*/}
                                    {/*            onChange={(e) =>  onChange(e.target.value)}*/}
                                    {/*            value={`${data.options.name} /  ${name.name}`}*/}
                                    {/*            variant={'standard'}*/}
                                    {/*            error={!!errors?.test?.[index]?.stock?.[id]?.variants}*/}
                                    {/*            helperText={errors?.test?.[index]?.stock?.[id]?.variants?.message}*/}
                                    {/*            id={'variants'}*/}
                                    {/*            type={'text'}*/}
                                    {/*            label={'variants'}*/}
                                    {/*            name={'variants'}*/}
                                    {/*        />*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.price`}
                                      defaultValue={watch("price")}
                                      render={({
                                        field,
                                        formState: { errors },
                                      }) => (
                                        <TextField
                                          margin="normal"
                                          required
                                          fullWidth
                                          variant={"standard"}
                                          error={
                                            !!errors?.test?.[index]?.stock?.[id]
                                              ?.price
                                          }
                                          helperText={
                                            errors?.test?.[index]?.stock?.[id]
                                              ?.price?.message
                                          }
                                          {...field}
                                          id={"price"}
                                          type={"number"}
                                          label={`${currency} ${t(
                                            "seller.post.add_product.price_title"
                                          )}`}
                                          name={"price"}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.name`}
                                      defaultValue={0}
                                      render={({
                                        field,
                                        formState: { errors },
                                      }) => (
                                        <TextField
                                          margin="normal"
                                          required
                                          fullWidth
                                          variant={"standard"}
                                          error={
                                            !!errors?.test?.[index]?.stock?.[id]
                                              ?.name
                                          }
                                          helperText={
                                            errors?.test?.[index]?.stock?.[id]
                                              ?.name?.message
                                          }
                                          {...field}
                                          id={"stock"}
                                          type={"number"}
                                          label={t(
                                            "seller.post.add_product.stock_title"
                                          )}
                                          name={"stock"}
                                        />
                                      )}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                      {validateProductStock(index, stock)}
                                      {/* {watch(`test.${index}.stock`)?.reduce(
                                        (index, { name }) =>
                                          index +
                                          Number.parseInt(
                                            name as unknown as string
                                          ),
                                        0
                                      ) !== Number(stock)
                                        ? "Total variant stock should be equal to product stock"
                                        : ""} */}
                                    </FormHelperText>
                                  </Grid>
                                </Grid>

                                {/*<Controller*/}
                                {/*    control={control}*/}
                                {/*    name={`test?.[${index}]`}*/}
                                {/*    defaultValue={null}*/}
                                {/*    render={({ field, formState: {errors} }) => (*/}
                                {/*        <TextField*/}
                                {/*        margin="normal"*/}
                                {/*        required*/}
                                {/*        fullWidth*/}
                                {/*        variant={'standard'}*/}
                                {/*        error={!!errors?.test?.[index]?.stock}*/}
                                {/*        helperText={errors?.test?.[index]?.stock?.message}*/}
                                {/*         {...field}*/}
                                {/*        id={'stock'}*/}
                                {/*        type={'number'}*/}
                                {/*        label={'stock'}*/}
                                {/*        name={'stock'}*/}
                                {/*        />*/}
                                {/*    )}*/}
                                {/*/>*/}
                              </Box>
                            );
                          }
                        })
                    )}
                    {/*<Button variant={'outlined'} fullWidth type={'submit'}*/}
                    {/*        className={'color'}>Save</Button>*/}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Card>
        <Box sx={{ p: 1, display: "flex", justifyContent: "space-around" }}>
          <Button
            color="primary"
            fullWidth={isMobile}
            variant="outlined"
            sx={{ width: "fit-content", textTransform: "capitalize" }}
            onClick={() => setStepper(false)}
          >
            {t("address.cancel")}
          </Button>
          <Button
            // className={"color"}
            color="primary"
            fullWidth={isMobile}
            disabled={isLoading || isUploading}
            type="submit"
            variant="contained"
            sx={{ width: "fit-content" }}
          >
            {isLoading || (isUploading && <CircularProgress />)}
            {t("seller.post.add_product.btn_save")}
            {isError && t("seller.post.add_product.something_went_wrong")}
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default AddProduct;
