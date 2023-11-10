import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Autocomplete,
  Card, 
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Select,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { postItemDefaultValue } from "../../../Helpers/Types";
import TextField from "@mui/material/TextField";
import {
  HelpOutline,
  BookmarkBorder,
} from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {
  useCreateTemplate,
  useGetAllCategories,
  useUpdateTemplate
} from "../../../hooks/useDataFetch";
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

interface ITemplate {
  location: string;
  selectedTemp: any;
  setOpenTemplate: React.Dispatch<boolean>;
}
const AddTemplate: React.FC<ITemplate> = ({ location, setOpenTemplate, selectedTemp }) => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    template_title: yup.string().required(t("seller.post.add_product.require_msg")).min(4, t("seller.post.add_product.must_be_at_least_4")),
    title: yup.string().required(t("seller.post.add_product.require_msg")).min(4, t("seller.post.add_product.must_be_at_least_4")),
    condition: yup.string().required(t("seller.post.add_product.require_msg")).min(3, t("seller.post.add_product.must_be_at_least_3")),
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
    category: yup.string().required(t("seller.post.add_product.you_must_select_a_category")),
    tags: yup.array().of(yup.string()).nullable(),
    // details: yup.string().required("This is required"),
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
  const rateDispatch: number = useSelector((state: Iutil) => state.util.sellerRate);
  const currency: string = useSelector((state: TCurrency) => state.currency.currency);
  const { data, isLoading: loading } = useGetAllCategories(onCategorySuccess);
  const [subCategories, setSubCategories] = useState([]);

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) return;
    data?.map((value: any) => categories.push(value.title));
  }, [loading]);

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
      template_title: "",
      title: "",
      condition: "",
      category: "",
      subcategory: "",
      price: 0,
      quantity: 0,
      tags: [],
      details: "",
      care: "",
      standard: 0,
      express: 0,
      asia: 0,
      africa: 0,
      europe: 0,
      southAmerica: 0,
      northAmerica: 0,
      oceania: 0,
      antarctica: 0,
    },
  });

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
      setTags(subTags.category.map(tag => `${category}.${tag}`));
    }
  }, [category]);

  useEffect(() => {
    const category = watch("category");
    const filterCategory = data?.filter(
      (categori) => categori.title === category
    );
    if (filterCategory?.length > 0) {
      setSubCategories(filterCategory[0].subcategories.map(subcategory => `${category}.${subcategory}`));
    }
  }, [watch("category")]);
  const [isGlobal, setIsGlobal] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(rateDispatch);
  useEffect(() => {
    if (!rate) {
      const rateExchange = localStorage.getItem("rateSeller");
      setRate(parseInt(rateExchange));
    }
  }, [rateDispatch]);


  //submit the add product form
  const isMobile: boolean = useMediaQuery("(max-width: 600px)");

  const onSuccess = (data: object) => {
    reset();
    setOpenTemplate(false);
  };
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { isLoading, error, mutate, isError } = useCreateTemplate(onSuccess);
  const { mutate: updateMutate } = useUpdateTemplate(onSuccess);

  const onSubmit: SubmitHandler<postItemDefaultValue> = async (data) => {
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

    const createProduct = {
      ...data,
      price: Number(price.toFixed(2)),
      subcategory: data.subcategory,
      shippingDetail: data.details,
      shipping,
      instruction: data.care,
      continents,
    };
    if (selectedTemp) {
      updateMutate({ id: selectedTemp._id, data: createProduct })
    } else {
      mutate(createProduct);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Box boxShadow={"0 2px 12px 0 rgba(0,0,0,0.4)"} width={!isMobile ? "50%" : "100%"} mx={!isMobile ? "25%" : "0"} mb={2}>
          <Controller
            name="template_title"
            control={control}
            render={({ field, formState: { errors } }) => (
              <TextField
                error={!!errors?.template_title}
                helperText={errors?.template_title?.message}
                {...field}
                id="Template name"
                label={t("seller.post.add_product.Template_name")}
                name="Template name"
                autoComplete="Template name"
                sx={{ bgcolor: "white", }}
                variant="outlined"
                color="primary"
                fullWidth
              />
            )}
          />
        </Box>
        <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"space-between"} gap={2}>
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
                  sx={{ bgcolor: "white" }}
                  variant="outlined"
                  color="primary"
                  fullWidth
                />
              )}
            />
          </Box>
          <Box width={"100%"}>
            <FormControl fullWidth sx={{ bgcolor: "white", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)" }}>
              <InputLabel shrink={false}>
                {watch("condition") === "" && t("seller.post.add_product.condition")}
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
                    <MenuItem value={"New"}>{t("seller.post.add_product.new")}</MenuItem>
                    <MenuItem value={"Used"}>{t("seller.post.add_product.used")}</MenuItem>
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

        <Box display={"flex"} gap={!isMobile && 2} justifyContent={"space-between"} flexDirection={isMobile ? "column" : "row"}>
          <Controller
            control={control}
            name="category"
            defaultValue={"Pet"}
            render={({
              field: { onChange, value },
              formState: { errors },
            }) => (
              <Autocomplete
                id="cats-options"
                fullWidth
                value={category}
                options={categories}
                getOptionLabel={(cat) => (cat && t(`maincategory.${cat}`))}
                renderInput={(params) => (
                  <TextField
                    sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", mt: 2 }}
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
            render={({
              field: { onChange, value },
              formState: { errors },
            }) => (
              <Autocomplete
                id="sub categories"
                fullWidth
                value={subcategory}
                options={subCategories}
                getOptionLabel={(cat) => (cat && t(`subcategory.${cat}`))}
                noOptionsText={t('subcategory.no_options')}
                renderInput={(params) => (
                  <TextField
                    sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", mt: 2 }}
                    {...params}
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

        <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} justifyContent={"space-between"} gap={2}>
          <Controller
            control={control}
            name="price"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                  mt: 2,
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
                fullWidth
                error={!!errors?.price}
                helperText={errors?.price?.message}
                {...field}
                label={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
                name={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
                autoComplete={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
                id={`${currency} ${t(
                  "seller.post.add_product.price_title"
                )}`}
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
          render={({
            field: { onChange, value },
            formState: { errors },
          }) => (
            <Autocomplete
              id="tags"
              fullWidth
              options={tags}
              value={tag}
              getOptionLabel={(cat) => (cat && t(`categoryTags.${cat}`))}
              autoSelect
              freeSolo
              multiple={true}
              renderInput={(params) => (
                <TextField
                  sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", mt: 2 }}
                  {...params}
                  fullWidth
                  variant="outlined"
                  required
                  error={!!errors?.tags}
                  helperText={errors?.tags?.message}
                  label={t("seller.post.add_product.tags")}
                  placeholder={t(
                    "seller.post.add_product.tags_placeholder"
                  )}
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
                            sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", }}
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
                            sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", }}
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

        <Box display={"flex"} flexDirection={isMobile ? "column" : "row"} gap={2} >
          <Controller
            control={control}
            name="care"
            render={({ field, formState: { errors } }) => (
              <TextField
                sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", }}
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
                sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", bgcolor: "white", }}
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

        <Box sx={{ p: 1, display:"flex", justifyContent:"space-around"}}>
          <Button
            color="primary"
            fullWidth={isMobile}
            variant="outlined"
            sx={{ width: "fit-content", textTransform: "capitalize" }}
            onClick={() => setOpenTemplate(false)}
          >
            {t("address.cancel")}
          </Button>
          <Button
            color="primary"
            fullWidth={isMobile}
            type="submit"
            variant="outlined"
            sx={{ width: "fit-content", textTransform: "capitalize" }}
          >
            {/* {isLoading || (isUploading && <CircularProgress />)} */}
            <BookmarkBorder />
            {t("seller.post.add_product.Save_template")}
            {/* {isError && t("seller.post.add_product.something_went_wrong")} */}
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default AddTemplate;
