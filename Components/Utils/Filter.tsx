import { Cancel, FilterAlt } from '@mui/icons-material';
import { Box, Button, FormControl, FormControlLabel, FormHelperText, InputLabel, Radio, RadioGroup, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Index';
import { setOpenCloseFilter } from '../../Store/filter';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

type filterOptionType = {
  pricing: string;
  condition: string;
  itemOrder: string;
  discount: string;
}

type FilterPropsType = {
  onFilter: (data) => void;
}
const schema = yup.object().shape({
  pricing: yup.string().required(),
  condition: yup.string().required(),
  itemOrder: yup.string().required(),
  discount: yup.string().required(),
});

const Filter: React.FC<FilterPropsType> = ({ onFilter }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { openFilter } = useSelector((state: RootState) => state.Filter);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<filterOptionType>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      pricing: "",
      condition: "",
      itemOrder: "",
      discount: "",
    },
  });

  const onSubmit: SubmitHandler<filterOptionType> = async (data) => {
    onFilter(data);
    dispatch(setOpenCloseFilter(false))
  }

  const clearHandler = async () => {
    onFilter(null);
    dispatch(setOpenCloseFilter(false))
  }

  return (
    <>
      <Box position='fixed' bottom={isMobile ? '3.5rem' : '2rem'} right='2rem' zIndex={10}>
        <Box
          sx={{
            display: "flex",
            alignSelf: "flex-end",
            my: 2,
            transition: "0.2s",
            color: '#00a859',
            width: isMobile ? '3rem' : '4rem',
            height: isMobile ? '3rem' : '4rem',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            ":active": { transform: "scale(0.9)" },
            cursor: 'pointer',
          }}
          onClick={() => dispatch(setOpenCloseFilter(true))}
        >
          <FilterAlt fontSize={isMobile ? "medium" : "large"} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            className="chatbox-message-wrapper"
            sx={{
              position: 'absolute',
              right: isMobile ? '-5vw' : 0,
              bottom: "100%",
              width: isMobile ? "90vw" : "420px",
              borderRadius: "0.5rem",
              bgcolor: "white",
              overflow: "hidden",
              boxShadow: "0 0 2rem rgba(0, 0, 0, 0.5)",
              transform: openFilter ? "scale(1)" : "scale(0)",
              transformOrigin: "bottom right",
              transition: "0.2s",
            }}
          >
            <Box className="chatbox-message-header"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: '1rem',
                py: '1.5rem',
              }}
            >
              <Typography color={"var(--primary)"} fontSize={14}>
                {t("FilterItems.Filter_Items")}
              </Typography>
              <Cancel
                sx={{ color: "var(--primary)", cursor: "pointer" }}
                onClick={() => dispatch(setOpenCloseFilter(false))}
              />
            </Box>
            <Box className="msger-chat"
              sx={{
                px: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gridRowGap: "4px",
              }}
            >
              <FormControl sx={{ minWidth: "100%", }}>
                <Typography color={"var(--primary)"}>{t("FilterItems.Pricing")}</Typography>
                <Controller
                  name="pricing"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: 2, '& .MuiRadio-root': { p: 0, pr: 1 } }}
                    >
                      <FormControlLabel value="lowest" control={<Radio size='small' />} label={t("FilterItems.Lowest")} />
                      <FormControlLabel value="highest" control={<Radio size='small' />} label={t("FilterItems.Highest")} />
                    </RadioGroup>
                  )}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors?.pricing?.message}{" "}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ minWidth: "100%", }}>
                <Typography color={"var(--primary)"}>{t("FilterItems.Condition")}</Typography>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: 2, '& .MuiRadio-root': { p: 0, pr: 1 } }}
                    >
                      <FormControlLabel value="New" control={<Radio size='small' />} label={t("FilterItems.New")} />
                      <FormControlLabel value="Used" control={<Radio size='small' />} label={t("FilterItems.Used")} />
                    </RadioGroup>
                  )}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors?.condition?.message}{" "}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ minWidth: "100%", }}>
                <Typography color={"var(--primary)"}>{t("FilterItems.Item_Order")}</Typography>
                <Controller
                  name="itemOrder"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: 2, '& .MuiRadio-root': { p: 0, pr: 1 } }}
                    >
                      <FormControlLabel value="newListing" control={<Radio size='small' />} label={t("FilterItems.New_Listing")} />
                      <FormControlLabel value="allListing" control={<Radio size='small' />} label={t("FilterItems.All_Listing")} />
                    </RadioGroup>
                  )}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors?.itemOrder?.message}{" "}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ minWidth: "100%", }}>
                <Typography color={"var(--primary)"}>{t("FilterItems.Discount")}</Typography>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field, formState: { errors } }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ pl: 2, '& .MuiRadio-root': { p: 0, pr: 1 } }}
                    >
                      <FormControlLabel value="discount" control={<Radio size='small' />} label={t("FilterItems.Discount")} />
                      <FormControlLabel value="noDiscount" control={<Radio size='small' />} label={t("FilterItems.No_Discount")} />
                      <FormControlLabel value="all" control={<Radio size='small' />} label={t("FilterItems.All")} />
                    </RadioGroup>
                  )}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {errors?.itemOrder?.message}{" "}
                </FormHelperText>
              </FormControl>

            </Box>
            <Box display={"flex"} gap={2} px={"1.5rem"} pb={"1.5rem"}>
              <Button variant='outlined' color='error' onClick={clearHandler}>
                {t("FilterItems.Clear")}
              </Button>
              <Button
                variant='outlined'
                type="submit"
              >
                {t("FilterItems.Apply")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Filter