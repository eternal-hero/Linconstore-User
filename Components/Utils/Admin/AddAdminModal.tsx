import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  addAdminModalClose,
  handleCloseModal,
  modalClose,
  requestModalClose,
  updateModal,
} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextInput from "../../TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useGetAdmin, useUpdateAdmin } from "../../../hooks/useDataFetch";
import { useEffect } from "react";
import { Close } from "@mui/icons-material";
import Cookies from "js-cookie";
import { languages } from "../../../config/i18n";
import { mutateAdmin, regionList, sectionList } from "../../Admin/Admins";
import ListItemIcon from "@mui/material/ListItemIcon";
import { getLangPlusCountryCode } from "../../../Helpers/utils";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import ListItemText from "@mui/material/ListItemText";

interface modal {
  modal: {
    addAdminModal: boolean;
    productId: string;
  };
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  borderRadius: 5,
  p: 1,
};
const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required().min(6),
  section: yup.string().required(),
  language: yup.string().required(),
});
type addAdmin = {
  email: string;
  password: string;
  section: string;
  language: string;
  region: string;
  otp: string;
};
export default function AddAdminModal() {
  const { i18n, t } = useTranslation();
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
      language: "",
      region: "",
      otp: "",
    },
  });
  const onSubmit: SubmitHandler<addAdmin> = async (data) => {
    const adminInfo = JSON.parse(Cookies.get("adminInfo"));
    const { email, section, password, language, region, otp } = data;
    const newData = {
      id: adminInfo._id,
      email,
      section,
      password,
      language,
      region,
      otp,
    };
    updateAdmin(newData);
  };
  const dispatch = useDispatch();
  const open: boolean = useSelector(
    (state: modal) => state.modal.addAdminModal
  );
  const handleClose = () => {
    reset();
    dispatch(addAdminModalClose())
  };
  const onSuccess = (data: addAdmin) => {
    reset(data);
  };
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  }, [open]);
  const onUpdateSuccess = () => {
    reset();
    dispatch(updateModal());
    handleClose();
  };
  const { isLoading, mutate: updateAdmin } = useUpdateAdmin(onUpdateSuccess);
  const { isFetching, refetch } = useGetAdmin(onSuccess);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPad = useMediaQuery("(max-width: 900px)");

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth={"lg"} component={"main"}>
        <Box sx={style}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 3, mx: 2 }}
          >
            <Stack spacing={2}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontWeight={600}>Modify Admin</Typography>
                <Close onClick={handleClose} sx={{ cursor: "pointer" }} />
              </Box>

              <Stack direction={isMobile ? "column" : "row"} gap={5} justifyContent={"space-between"}>
                <Stack gap={1} width={"100%"}>
                  <Typography fontSize={14}>Section</Typography>
                  <FormControl sx={{ minWidth: "100%" }}>
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
                </Stack>
                <Stack gap={1} width={"100%"}>
                  <Typography fontSize={14}>Language</Typography>
                  <FormControl sx={{ minWidth: "100%" }}>
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
                </Stack>
              </Stack>

              <Stack gap={1} width={"100%"}>
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
              </Stack>

              <Stack gap={1} width={"100%"}>
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
              </Stack>

              <Stack direction={isMobile ? "column" : "row"} gap={5} justifyContent={"space-between"}>
                <Stack gap={1} width={"100%"}>
                  <Typography fontSize={14}>Region</Typography>
                  <FormControl sx={{ minWidth: "100%", mt:2 }}>
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
                </Stack>
                <Stack gap={1} width={"100%"}>
                  <Typography fontSize={14}>Enter Verification Code</Typography>
                  <Controller
                    name="otp"
                    control={control}
                    render={({ field, formState: { errors } }) => (
                      <TextInput
                        size="small"
                        data={errors?.otp}
                        variant={true}
                        field={field}
                        id="otp"
                      />
                    )}
                  />
                </Stack>
              </Stack>


              <Box display={"flex"} p={1} justifyContent={'end'}>
                <Button size="small" variant={"contained"} type={"submit"}>
                  Modify
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
}
