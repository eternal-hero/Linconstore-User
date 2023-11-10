import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import AdminsTable from "../Utils/Admin/AdminsTable";
import { useCreateAdmins, useGetAdmins } from "../../hooks/useDataFetch";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import { getLangPlusCountryCode } from "../../Helpers/utils";
import { languages } from "../../config/i18n";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import ListItemText from "@mui/material/ListItemText";

export const sectionList = [
  { value: "store", label: "Store Admin" },
  { value: "analysis", label: "Analysis Admin" },
  { value: "cs-support", label: "Cs-Support Admin" },
  { value: "marketing", label: "Marketing Admin" },
  { value: "finance", label: "Finance Admin" },
  { value: "fraud", label: "Fraud Prevention" },
  { value: "root", label: "Root Admin" },
]

export const regionList = [
  { value: "all", label: "All" },
  { value: "oceania", label: "Oceania" },
  { value: "south_america", label: "South America" },
  { value: "north_america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "africa", label: "Africa" },
  { value: "asia", label: "Asia" },
]

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  section: yup.string().required(),
});
type IModal = {
  modal: {
    isUpdating: boolean;
  };
};
type addAdmin = {
  email: string;
  password: string;
  section: string;
  language: string;
  region: string;
};
let isFirst = false
export type mutateAdmin = {
  email: string;
  password: string;
  section: string;
  language: string;
  region: string;
  _id: string;
};
const Admin: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [admins, setAdmins] = useState<mutateAdmin[]>([]);
  const [filterAdmins, setFilterAdmins] = useState<mutateAdmin[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setSearch(value);

    const newAdmins = data?.filter((admin) => admin.email?.includes(value));
    setAdmins(newAdmins);
  };
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<addAdmin>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      section: "",
      region: "",
      language: "",
    },
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      isFirst = true
    }, 300)
    return () => clearTimeout(timeout)
  },

    []);
  const onSubmit: SubmitHandler<addAdmin> = async (data) => {
    const newData = {
      ...data,
    };
    createAdmin(newData);
  };
  const dispatch = useDispatch();
  const isUpdating = useSelector((state: IModal) => state.modal.isUpdating);

  useEffect(() => {
    if (isFirst) refetch();
  }, [isUpdating]);


  const searchFields = ['Section', 'Email', 'Region']

  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterAdmins(admins)
    } else {
      let filter = admins;
      if (searchOption.field === searchFields[0]) {
        filter = admins.filter(s => s?.section.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filter = admins.filter(s => s?.email.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[2]) {
        filter = admins.filter(s => s?.region?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterAdmins(filter)
    }
  }, [searchOption, admins])

  const onAdminSuccess = () => {
    reset();
    refetch();
    dispatch(
      snackBarOpen({
        message: "Admin was Successfully created",
        snackbarOpen: true,
        severity: "success",
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const { mutate: createAdmin, isLoading } = useCreateAdmins(onAdminSuccess);
  const onSuccess = (data: mutateAdmin[]) => {
    setAdmins(data);
  };
  const { isFetched, refetch, data, isFetching } = useGetAdmins(onSuccess);
  useTokenRefetch(refetch)
  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  return (
    <>
      <Header
        title="Admin"
        searchFields={searchFields}
        totalAmount={admins.length}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />
      <Card
        elevation={0}
        sx={{ background: "white", mt: 1, p: 2, minHeight: "90vh" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {isFetching && (
            <Typography variant={"h6"} textAlign={"center"}>
              <CircularProgress />
            </Typography>
          )}
          {isFetched && filterAdmins.length > 0 && (
            <AdminsTable admins={filterAdmins} handleRefetch={handleRefetch} />
          )}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 5 }}
          >
            <Typography fontSize={14}>Insert Admin</Typography>
            <Grid container spacing={2}>
              <Grid item sm={3}>
                <FormControl sx={{ minWidth: "100%", mt: 2 }}>
                  <InputLabel id="demo-simple-select-label" shrink={false}>
                    {watch("section") === "" && "Select admin section"}
                  </InputLabel>
                  <Controller
                    name="section"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...field}
                        variant={"outlined"}
                        size="small"
                        className={"sortButton"}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "black",
                          },
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      >
                        {sectionList.map((section, index) => {
                          return <MenuItem value={section.value} key={index}>{section.label}</MenuItem>
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.section?.message}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={2}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      size="small"
                      data={errors?.email}
                      variant={true}
                      field={field}
                      id="email"
                    />
                  )}
                />
              </Grid>
              <Grid item sm={2}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <TextInput
                      size="small"
                      data={errors?.password}
                      variant={true}
                      type={"password"}
                      field={field}
                      id="Password"
                    />
                  )}
                />
              </Grid>
              <Grid item sm={2}>
                <FormControl sx={{ minWidth: "100%", mt: 2 }}>
                  <InputLabel id="new-admin-language" shrink={false}>
                    {watch("language") === "" && "Language"}
                  </InputLabel>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <Select
                        labelId="new-admin-language"
                        id="demo-simple-select"
                        {...field}
                        variant={"outlined"}
                        size="small"
                        className={"sortButton"}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "black",
                          },
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      >
                        {languages.map((language, index) => {
                          const { code, country } = language;
                          const langPlusCountryCode = getLangPlusCountryCode(language);
                          return (
                            <MenuItem key={langPlusCountryCode} value={langPlusCountryCode}>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <ListItemIcon sx={{ maxHeight: "20px" }}>
                                  <Flag code={country ?? code}></Flag>
                                </ListItemIcon>
                                <ListItemText sx={{ ml: 1, '& span': { fontSize: 14 } }}>
                                  <b>{t(`language.${langPlusCountryCode}`)}</b>
                                </ListItemText>
                              </div>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.language?.message}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={2}>
                <FormControl sx={{ minWidth: "100%", mt: 2 }}>
                  <InputLabel id="new-admin-region" shrink={false}>
                    {watch("region") === "" && "Region"}
                  </InputLabel>
                  <Controller
                    name="region"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <Select
                        labelId="new-admin-region"
                        id="demo-simple-select"
                        {...field}
                        variant={"outlined"}
                        size="small"
                        className={"sortButton"}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "black",
                          },
                        }}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      >
                        {regionList.map((section, index) => {
                          return <MenuItem value={section.value} key={index}>{section.label}</MenuItem>
                        })}
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "red" }}>
                    {errors?.region?.message}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sm={1}>
                <Button
                  sx={{ mt: 2, }}
                  variant={"contained"}
                  fullWidth
                  type={"submit"}
                  disabled={isLoading}
                >
                  {isLoading && <CircularProgress />} Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
};
export default Admin;
