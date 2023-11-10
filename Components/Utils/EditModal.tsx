import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleCloseModal } from "../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { HelpOutline, PhotoCamera } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Dropzone, { Accept } from "react-dropzone";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextInput from "../TextInput";
import TextField from "@mui/material/TextField";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { useCallback, useEffect, useState } from "react";
import { categoryTags } from "../../Helpers/CategoryTags";
import {
  EditItemDefaultValue,
  IProducts,
  TCat,
} from "../../Helpers/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  useGetAllCategories,
  useGetSellerInfo,
  useUpdateProduct,
} from "../../hooks/useDataFetch";
import { uploadImages } from "../../Helpers/utils";
import { baseUrl } from "../../Helpers/baseUrl";
import { groupByKey } from "../Product/Index";
import { useTranslation } from "react-i18next";
import { useRefresh } from "../../hooks/useRefresh";

interface modal {
  modal: {
    modal: boolean;
    message: string;
    image: string;
    productId: string;
  };
}
type TCategory = {
  category: TCat;
};
type TProduct = {
  price: number;
  country: string;
};
type IShipping = {
  express: TProduct;
  standard: TProduct;
};
type TCurrency = {
  currency: {
    currency: string;
  };
};
type Iutil = {
  util: {
    sellerRate: number;
  };
};
interface IStore {
  location: string;
}
type TVaraint = {
  option: string;
  stock: number;
  variant: string;
  price: number;
};
interface IVariant {
  stock: TVaraint[];
}
const schema = yup.object().shape({
  title: yup.string().required().min(4),
  description: yup.string().required().min(5),
  price: yup
    .number()
    .typeError("Must be a number")
    .required()
    .min(1, "Must be at least 1"),
  quantity: yup
    .number()
    .typeError("Must be a number")
    .required()
    .min(1, "Must be at least 1"),
  category: yup.string(),
  tags: yup.array().of(yup.string()).nullable(),
  terms: yup.boolean(),
  weight: yup.string().when("terms", {
    is: true,
    then: yup.string().required().min(1),
    otherwise: yup
      .string()
      .transform(() => {
        return undefined;
      })
      .nullable()
      .notRequired(),
  }),
  test: yup.array().of(
    yup.object().shape({
      stock: yup.array().of(
        yup.object().shape({
          name: yup.number().typeError("Must be a number"),
          price: yup
            .number()
            .typeError("Must be a number")
            .min(1, "Price must be grater than 0"),
          variants: yup.string(),
        })
      ),
    })
  ),
  subcategory: yup.string(),
  standard: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
  express: yup
    .number()
    .typeError("Must be a number")
    .required("this is a required field"),
});
export default function EditModal() {
  const rateDispatch: number = useSelector(
    (state: Iutil) => state.util.sellerRate
  );

  const [rate, setRate] = useState<number>(rateDispatch);
  const [location, setLocation] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState([]);
  const [data, setData] = useState<IProducts>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<string>("");
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [initialSubCategory, setInitialSubCategory] = useState<string>("");
  const [tags, setInitialTags] = useState<string[]>([]);
  const [isCheck, setIsChecked] = useState<boolean>(false);
  const [initialCategory, setInitialCategory] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [allTags, setAllTags] = useState<Array<string>>([]);
  const [stockQuantity, setStockQuantity] = useState<number>(3);
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");
  const { t } = useTranslation();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "auto",
    bgcolor: "var(--primary)",
    // border: '2px solid #000',
    boxShadow: "24",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    // alignItems: 'center',
    minHeight: "500px",
    maxHeight: "500px",
    overflow: "scroll",
    borderRadius: "5",
    p: "16px",
  };
  const currency: string = useSelector(
    (state: TCurrency) => state.currency.currency
  );

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditItemDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
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
  const handleClose = () => {
    // setData(null)
    dispatch(handleCloseModal());
  }

  const onSuccess = (data: any) => {
    handleClose();
  };

  useEffect(() => {
    const rateExchange = localStorage.getItem("rateSeller");
    setRate(parseInt(rateExchange));
  }, []);

  const onCategorySuccess = () => { };

  const { data: allCategories, isLoading: loading } = useGetAllCategories(onCategorySuccess);

  const category = watch("category");
  useEffect(() => {
    const categori1 = watch("category");
    const filterCategory = allCategories?.filter(
      (categori) => categori.title === categori1
    );
    if (filterCategory?.length > 0) {
      setSubCategories(filterCategory[0].subcategories.map(subcategory => `${categori1}.${subcategory}`));
    }
  }, [watch("category")]);

  useEffect(() => {
    allCategories?.map((value: any) => categories.push(value.title));
  }, [loading]);

  const productId: string = useSelector(
    (state: modal) => state.modal.productId
  );

  //validate the product stuck
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

  //update the variant price when the product price changes.
  const handlePriceChange = (value) => {
    const values = getValues(); // Get the current form values
    if (values.test === undefined) return;
    const updatedTest = values.test.map((item) => ({
      ...item,
      stock: item.stock.map((stockItem) => ({ ...stockItem, price: value })),
    }));
    setValue("test", updatedTest);
  };

  const { isLoading: updating, mutate: updateProduct } = useUpdateProduct(
    productId,
    onSuccess
  );
  const onStoreSuccess = (data: IStore) => {
    if (data != null) {
      setLocation(data.location);

    }
  };
  const acceptedFileTypes = {
    "image/*": [".jpeg", ".jpg", ".png"],
  };

  const { refetch } = useGetSellerInfo(onStoreSuccess);
  useRefresh(refetch);

  const onSubmit: SubmitHandler<EditItemDefaultValue> = async (formData) => {
    const {
      test,
      file,
      express,
      standard,
      category: newCategory,
      care,
      description,
      subcategory,
      tags,
      terms,
      title,
      price,
      quantity,
      details,
    } = formData;
    const filterCategory = allCategories?.find((categori) =>
      categori.subcategories.includes(subcategory)
    );
    const saveCategory = filterCategory?._id;

    const shipping: IShipping[] = [
      {
        express: {
          price: Number(express),
          country: location,
        },
        standard: {
          price: Number(standard),
          country: location,
        },
      },
    ];
    const variantPlaceholder: any[] = [];
    
    if (data.variants && data.variants.length > 0) {
      let variantLength = data.variants.length;
    
      data.variants.map(({ stock }, index: number) => {
        stock.map((x: TVaraint, id: number) => {
          const { option, variant } = x;
          const price = Number(test[index].stock[id].price);
          const newStock = test[index].stock[id].name;
    
          const newData: TVaraint = {
            variant,
            option,
            price,
            stock: newStock,
          };
    
          variantPlaceholder.push(newData);
        });
      });
    }

    const stockMatch = isVariantStockValid(variantPlaceholder, stockQuantity);

    if (stockMatch.length !== 0) {
      return;
    }

    const newPrice = Number(price);
    const newData = {
      price: newPrice,
      title,
      description,
      shipping,
      category: saveCategory ? saveCategory : newCategory,
      subcategory: subcategory,
      quantity,
      tags,
      care,
      variants: variantPlaceholder,
      instruction: care,
      shippingDetails: details,
    };
    if (file) {
      const photo = await uploadImages(formData.file);
      const photoIncluded = { ...newData, photo };
      updateProduct(photoIncluded);
      return;
    }

    updateProduct(newData);
  };

  const subcategory = watch("subcategory");
  const tag = watch("tags");
  const stock = watch("quantity");
  const price = watch("price");

  const dispatch = useDispatch();
  const open: boolean = useSelector((state: modal) => state.modal.modal);

  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/product/${productId}`);
      let res = response.data.product
      const filterCategory = allCategories?.filter((categori) => categori._id === res.category);
      res.category = filterCategory[0]?.title
      setData(res);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch, productId]);

  const handleRefetch = useCallback(
    async (id: string) => {
      const newRate = localStorage.getItem("sellerRate");
      setRate(Number(newRate));
      if (!id) return;
      const response = await axios.get(`${baseUrl}/category/${id}`);
      const data = response.data;
      const category = data.category.title;
      setInitialCategory(category);
    },
    [variants]
  );
  useEffect(() => {
    if (data) {
      const groupVariant = groupByKey(data?.variants, "variant", {
        omitKey: false,
      });
      // let groupVariantLength =  Object.entries(groupVariant).length;
      const groupVariantPlaceHolder: IVariant[] = [];
      groupVariant &&
        Object.entries(groupVariant).forEach((x, index: number) => {
          const newData = {
            stock: x[1],
          };
          //@ts-ignore
          groupVariantPlaceHolder.push(newData);
        });
      setVariants(groupVariantPlaceHolder);

      // @ts-ignore
      if (data?.variants?.length > 0) setIsChecked(true);
      // @ts-ignore
      const variantPlaceholder: IVariant[] = [];
      let varaintsLength = data?.variants?.length;
      for (varaintsLength; varaintsLength--;) {
        let length: number;
        if (
          data.variants[varaintsLength]?.variant ===
          data?.variants[varaintsLength - 1]?.variant
        ) {
          length =
            data.variants[varaintsLength]?.stock +
            data?.variants[varaintsLength - 1]?.stock;
        } else {
          length = data?.variants[varaintsLength]?.stock;
        }
        //@ts-ignore
        const { variant, option, price, stock } =
          data?.variants[varaintsLength];
        const newData = {
          length,
          variant,
          option,
          price,
          stock,
        };
        variantPlaceholder.push(newData);
      }
      reset(data);
      setInitialData(data?.photo?.length > 0 ? data.photo[0] : "");
      reset({
        ...getValues(),
        care: data.instruction,
        details: data.shippingDetail,
      });
      setStockQuantity(data?.quantity);
      reset({
        ...getValues(),
        price: Number(data?.price),
        // express:Number((data?.shipping[0].express * rate).toFixed(2)),
        // standard:Number((data?.shipping[0].standard * rate).toFixed(2)),
      });
      setInitialSubCategory(data?.subcategory);

      if (data?.tags) {
        setInitialTags(data?.tags)
      }
      // @ts-ignore
      handleRefetch(data?.category);
      // handleRefetch()
      if (data?.shipping?.length > 0) {
        reset({
          ...getValues(),
          express: Number(data?.shipping[0]?.express.price?.toFixed(2)),
          standard: Number(data?.shipping[0]?.standard.price?.toFixed(2)),
        });
      }
    }
  }, [reset, data, isLoading, isCheck]);

  useEffect(() => {
    const subTags = categoryTags.find((x) => x.key === initialCategory);

    if (subTags) {
      setAllTags(subTags.category);
    }
  }, [initialCategory]);


  const getSelectedCategoryIndices = (categoryArray, selectedCategories) => {
    const indexes = selectedCategories?.map(category => categoryArray.indexOf(category));
    return indexes
  }

  const handleGlobal = useCallback(() => {
    setIsGlobal((prevState) => !prevState);
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"lg"} component={"main"}>
        <Box sx={style} className={"editModal"}>
          <Typography
            variant={"h6"}
            sx={{ justifyContent: "center" }}
            textAlign={"center"}
          >
            {t("edit_modal.edit_product")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {/*{loginLoading && <Loader/>}*/}
            {isLoading && <CircularProgress />}
            <Card
              elevation={1}
              sx={{
                background: "white",
                border: "2px solid #000",
                maxWidth: { xs: "auto", lg: "auto" },
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
                      message: "This field is required",
                    },
                  }}
                  render={({ field: { onChange, onBlur }, fieldState }) => (
                    <Dropzone
                      noClick
                      accept={acceptedFileTypes as unknown as Accept}
                      onDrop={(acceptedFiles) => {
                        setValue(
                          "file",
                          acceptedFiles as unknown as FileList[],
                          {
                            shouldValidate: true,
                          }
                        );
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
                                ? `transparent`
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
                                src={initialData}
                                alt="photo preview"
                                sx={{ width: "200px", height: "200px", mb: 2 }}
                              />
                            )}
                            <div>
                              {fieldState.error && (
                                <span role="alert">
                                  {fieldState.error.message}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<PhotoCamera fontSize="large" />}
                              onClick={open}
                            >
                              {t("edit_modal.btn_upload")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  )}
                />
              </Stack>
            </Card>

            {/* <Controller
              name="title"
              control={control}
              render={({ field, formState: { errors } }) => (
                <TextField
                  error={!!errors?.title}
                  helperText={errors?.title?.message}
                  {...field}
                  id={t("edit_modal.product_title")}
                  name={t("edit_modal.product_title")}
                  label={t("edit_modal.product_title")}
                  autoComplete={t("edit_modal.product_title")}
                  sx={{ bgcolor: "white" }}
                  variant="outlined"
                  color="primary"
                  fullWidth
                />
              )}
            /> */}

            <Controller
              control={control}
              name="description"
              render={({ field, formState: { errors } }) => (
                <TextField
                  error={!!errors?.description}
                  helperText={errors?.description?.message}
                  {...field}
                  id={t("edit_modal.product_description")}
                  label={t("edit_modal.product_description")}
                  name={t("edit_modal.product_description")}
                  autoComplete={t("edit_modal.product_description")}
                  type="text"
                  multiline
                  rows={5}
                  fullWidth
                  sx={{ bgcolor: "white", mt: 2 }}
                />
              )}
            />

            <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"space-between"} gap={2}>
              <Box width={"100%"}>
                <Controller
                  control={control}
                  name="category"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <Autocomplete
                      id="cats-options"
                      value={category}
                      options={categories}
                      getOptionLabel={(cat) => cat && t(`maincategory.${cat}`)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ mt: 2, bgcolor: "white" }}
                          {...params}
                          value={categories[0]}
                          variant="outlined"
                          // required
                          error={!!errors?.category}
                          helperText={errors?.category?.message}
                          label={t("edit_modal.category_title")}
                          fullWidth
                          placeholder={t(
                            "edit_modal.category_title_placeholder"
                          )}
                        />
                      )}
                      onChange={(e, data) => onChange(data)}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <Controller
                  control={control}
                  name="subcategory"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => (
                    <Autocomplete
                      id="sub categories"
                      value={subcategory}
                      options={subCategories}
                      getOptionLabel={(cat) => (cat && t(`subcategory.${cat}`))}
                      noOptionsText={t('subcategory.no_options')}
                      renderInput={(params) => (
                        <TextField
                          sx={{ mt: 2, bgcolor: "white" }}
                          {...params}
                          value={subCategories[0]}
                          variant="outlined"
                          fullWidth
                          // required
                          error={!!errors?.subcategory}
                          helperText={errors?.subcategory?.message}
                          label={t("edit_modal.sub_Category")}
                          placeholder={t(
                            "edit_modal.sub_category_placeholder"
                          )}
                        />
                      )}
                      onChange={(e, data) => onChange(data)}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"space-between"} gap={2}>
              <Controller
                control={control}
                name="price"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    variant={"outlined"}
                    error={!!errors?.price}
                    helperText={errors?.price?.message}
                    {...field}
                    id={"price"}
                    type={"number"}
                    label={`${currency} ${t("edit_modal.price_title")}`}
                    name={"price"}
                    onChange={(e) => {
                      handlePriceChange(e.target.value);
                      field.onChange(e);
                    }}
                    sx={{
                      bgcolor: "white",
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                        '&::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '&::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        }
                      }
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="quantity"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    variant={"outlined"}
                    error={!!errors?.quantity}
                    helperText={errors?.quantity?.message}
                    {...field}
                    id={t("edit_modal.quantity_stock")}
                    type={"number"}
                    label={`${t("edit_modal.quantity_stock")}`}
                    name={"quantity"}
                    onChange={(e) => {
                      setStockQuantity(Number(e.target.value));
                      field.onChange(e);
                    }}
                    sx={{
                      bgcolor: "white",
                      '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                        '&::-webkit-outer-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        },
                        '&::-webkit-inner-spin-button': {
                          '-webkit-appearance': 'none',
                          margin: 0,
                        }
                      }
                    }}
                  />
                )}
              />
            </Box>

            <Controller
              control={control}
              name="tags"
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => (
                <Autocomplete
                  id="tags"
                  options={tags}
                  autoSelect
                  value={tag ?? []}
                  freeSolo
                  multiple={true}
                  // getOptionLabel={(cat) => cat}
                  renderInput={(params) => (
                    <TextField
                      sx={{ mt: 2, bgcolor: "white" }}
                      {...params}
                      variant="outlined"
                      required
                      fullWidth
                      // error={!!errors?.pet}
                      // helperText={errors?.category?.message}
                      label={t("edit_modal.tags_title")}
                      placeholder={t("edit_modal.tags_placeholder")}
                    />
                  )}
                  onChange={(e, data) => onChange(data)}
                />
              )}
            />

            <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"space-between"} gap={2}>
              <Controller
                control={control}
                name="care"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    fullWidth
                    error={!!errors?.care}
                    helperText={errors?.care?.message}
                    {...field}
                    required={true}
                    id={t("edit_modal.care_instruction")}
                    name={t("edit_modal.care_instruction")}
                    label={t("edit_modal.care_instruction")}
                    autoComplete={t("edit_modal.care_instruction")}
                    sx={{ bgcolor: "white", mt: 2 }}
                  />
                )}
              />

              <Controller
                control={control}
                name="details"
                render={({ field, formState: { errors } }) => (
                  <TextField
                    fullWidth
                    error={!!errors?.details}
                    helperText={errors?.details?.message}
                    {...field}
                    required={true}
                    id={t("edit_modal.shipping_details")}
                    name={t("edit_modal.shipping_details")}
                    label={t("edit_modal.shipping_details")}
                    autoComplete={t("edit_modal.shipping_details")}
                    sx={{ bgcolor: "white", mt: 2 }}
                  />
                )}
              />
            </Box>
            {isGlobal && (
              <Card
                elevation={1}
                sx={{
                  background: "#f3f2f2",
                  border: "2px solid black",
                  maxWidth: { xs: "auto", lg: "auto" },
                  my: 2,
                }}
              >
                <TableContainer component={Paper}>
                  <Table
                    sx={{
                      minWidth: "645px",
                      width: "100%",
                      background: "#f3f2f2",
                    }}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Shipping </TableCell>
                        <TableCell align="left">Price</TableCell>
                        {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                        {/*<TableCell align="left">EUROPE</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Africa
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for africa, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="africa"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.africa}
                                required={true}
                                field={field}
                                id="Afirca"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Asia
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for Asia, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="asia"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.asia}
                                required={true}
                                field={field}
                                id="Asia"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          South America
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for South America, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="southAmerica"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.southAmerica}
                                required={true}
                                field={field}
                                id="southAmerica"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          North America
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for North America, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="northAmerica"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.northAmerica}
                                required={true}
                                field={field}
                                id="northAmerica"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Oceania
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for Oceania, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="oceania"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.oceania}
                                required={true}
                                field={field}
                                id="oceania"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Europe
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for Europe, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="europe"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.europe}
                                required={true}
                                field={field}
                                id="Europe"
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Antarctica
                          <Tooltip
                            placement={"top-start"}
                            title={
                              "Enter the shipping amount for North America, for free shipping leave field empty"
                            }
                          >
                            <IconButton aria-label="help">
                              <HelpOutline />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">
                          <Controller
                            control={control}
                            name="antarctica"
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.northAmerica}
                                required={true}
                                field={field}
                                id="antarctica"
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


            {!isGlobal && (
              <Card
                elevation={1}
                sx={{
                  background: "white",
                  maxWidth: { xs: "auto", lg: "auto" },
                  my: 2,
                }}
              >
                <TableContainer component={Paper}>
                  <Table
                    sx={{
                      minWidth: "645px",
                      width: "100%",
                      background: "white",
                    }}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          {t("edit_modal.shipping_title")}
                        </TableCell>
                        <TableCell align="left">
                          {t("edit_modal.price_title")}
                        </TableCell>
                        {/*<TableCell align="left">USA & CANADA</TableCell>*/}
                        {/*<TableCell align="left">EUROPE</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {t("edit_modal.ship_faq2")}
                          <Tooltip
                            placement={"top-start"}
                            title={t("edit_modal.ship_tooltip2")}
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
                                error={!!errors?.standard}
                                helperText={errors?.standard?.message}
                                required={true}
                                {...field}
                                variant="outlined"
                                fullWidth
                                id={`${currency} ${t(
                                  "edit_modal.standard_shipping"
                                )}`}
                                label={`${currency} ${t(
                                  "edit_modal.standard_shipping"
                                )}`}
                                name={`${currency} ${t(
                                  "edit_modal.standard_shipping"
                                )}`}
                                autoComplete={`${currency} ${t(
                                  "edit_modal.standard_shipping"
                                )}`}
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {t("edit_modal.ship_faq1")}
                          <Tooltip
                            placement={"top-start"}
                            title={t("edit_modal.ship_tooltip1")}
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
                                error={!!errors?.express}
                                helperText={errors?.express?.message}
                                fullWidth
                                required={true}
                                {...field}
                                variant="outlined"
                                id={`${currency} ${t(
                                  "edit_modal.express_shipping"
                                )}`}
                                name={`${currency} ${t(
                                  "edit_modal.express_shipping"
                                )}`}
                                label={`${currency} ${t(
                                  "edit_modal.express_shipping"
                                )}`}
                                autoComplete={`${currency} ${t(
                                  "edit_modal.express_shipping"
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
            <Card
              elevation={1}
              sx={{
                background: "white",
                border: "2px solid black",
                maxWidth: { xs: "auto", lg: "auto" },
                my: 2,
              }}
            >
              <Box sx={{ p: 3 }}>
                {variants?.length > 0 && (
                  <>
                    <Typography variant={"h6"}>
                      {t("edit_modal.edit_variant")}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.variant_title")}
                      </Grid>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.price_title")}
                      </Grid>
                      <Grid item xs={4} sm={6} lg={3}>
                        {t("edit_modal.stock_title")}
                      </Grid>
                    </Grid>
                    <Box>
                      {variants.map(({ stock }, index) =>
                        stock?.map(
                          ({ option, price, stock, variant }, id: number) => {
                            const newPrice = Number(price);
                            return (
                              <Box key={index + id}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6} lg={3} mt={3}>
                                    <Typography>
                                      {variant} / {option}
                                    </Typography>
                                    {/* <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.variants`}
                                      defaultValue={`${data.options.name} /  ${name.name}`}
                                      render={({field : {onChange}, formState: {errors}}) => (
                                          <TextField
                                              margin="normal"
                                              required
                                              fullWidth
                                              onChange={(e) =>  onChange(e.target.value)}
                                              value={`${data.options.name} /  ${name.name}`}
                                              variant={'standard'}
                                              error={!!errors?.test?.[index]?.stock?.[id]?.variants}
                                              helperText={errors?.test?.[index]?.stock?.[id]?.variants?.message}
                                              id={'variants'}
                                              type={'text'}
                                              label={'variants'}
                                              name={'variants'}
                                          />
                                      )}
                                    /> */}
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.price`}
                                      defaultValue={price}
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
                                          id={"variants"}
                                          type={"number"}
                                          label={`${currency} ${t(
                                            "edit_modal.price_title"
                                          )}`}
                                          name={"variants"}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6} lg={3}>
                                    <Controller
                                      control={control}
                                      name={`test.${index}.stock.${id}.name`}
                                      defaultValue={stock}
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
                                          label={t("edit_modal.stock_title")}
                                          name={"stock"}
                                        />
                                      )}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                      {validateProductStock(
                                        index,
                                        stockQuantity
                                      )}
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
                        )
                      )}
                      {/*<Button variant={'outlined'} fullWidth type={'submit'}*/}
                      {/*        className={'color'}>Save</Button>*/}
                    </Box>
                  </>
                )}
              </Box>
            </Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                p: 1,
              }}
            >
              {/*<Stack direction={'row'} spacing={2}>*/}
              {/*    <Switch onChange={handleGlobal} checked={isGlobal}  />*/}
              {/*    <Stack spacing={1}>*/}
              {/*        <Box/>*/}
              {/*        <Typography variant={'subtitle2'}>Global</Typography>*/}
              {/*    </Stack>*/}
              {/*</Stack>*/}
              <Button
                // className={"color"}
                // disabled={isLoading}
                type="submit"
                variant="contained"
              >
                {updating && <CircularProgress />}
                {t("edit_modal.btn_update")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
