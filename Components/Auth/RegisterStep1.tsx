import React, { useEffect} from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { createUserStepOneDefaultValue } from "../../Helpers/Types";
import * as yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneNumberInput from "../Form/PhoneNumberInput";
import { FormHelperText } from "@mui/material";
import { Button, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import CountrySelect from "../../Components/CountrySelect";
import { CountryCodes } from "../../Data/CountryCodes";
import Cookies from "js-cookie";
export default function RegisterStepOne({ onCompleted }) {
  const { t } = useTranslation();
  const countryList = [
    { shortCode: t("seller.verify.countryListByShortCode.australia"), label: t("seller.verify.countryList.australia") },
    { shortCode: t("seller.verify.countryListByShortCode.austria"), label: t("seller.verify.countryList.austria") },
    { shortCode: t("seller.verify.countryListByShortCode.belgium"), label: t("seller.verify.countryList.belgium") },
    { shortCode: t("seller.verify.countryListByShortCode.bulgaria"), label: t("seller.verify.countryList.bulgaria") },
    { shortCode: t("seller.verify.countryListByShortCode.canada"), label: t("seller.verify.countryList.canada") },
    { shortCode: t("seller.verify.countryListByShortCode.croatia"), label: t("seller.verify.countryList.croatia") },
    { shortCode: t("seller.verify.countryListByShortCode.cyprus"), label: t("seller.verify.countryList.cyprus") },
    { shortCode: t("seller.verify.countryListByShortCode.czech"), label: t("seller.verify.countryList.czech") },
    { shortCode: t("seller.verify.countryListByShortCode.denmark"), label: t("seller.verify.countryList.denmark") },
    { shortCode: t("seller.verify.countryListByShortCode.estonia"), label: t("seller.verify.countryList.estonia") },
    { shortCode: t("seller.verify.countryListByShortCode.finland"), label: t("seller.verify.countryList.finland") },
    { shortCode: t("seller.verify.countryListByShortCode.france"), label: t("seller.verify.countryList.france") },
    { shortCode: t("seller.verify.countryListByShortCode.germany"), label: t("seller.verify.countryList.germany") },
    { shortCode: t("seller.verify.countryListByShortCode.greece"), label: t("seller.verify.countryList.greece") },
    { shortCode: t("seller.verify.countryListByShortCode.hungary"), label: t("seller.verify.countryList.hungary") },
    { shortCode: t("seller.verify.countryListByShortCode.ireland"), label: t("seller.verify.countryList.ireland") },
    { shortCode: t("seller.verify.countryListByShortCode.italy"), label: t("seller.verify.countryList.italy") },
    { shortCode: t("seller.verify.countryListByShortCode.lithuania"), label: t("seller.verify.countryList.lithuania") },
    { shortCode: t("seller.verify.countryListByShortCode.luxembourg"), label: t("seller.verify.countryList.luxembourg") },
    { shortCode: t("seller.verify.countryListByShortCode.mexico"), label: t("seller.verify.countryList.mexico") },
    { shortCode: t("seller.verify.countryListByShortCode.netherland"), label: t("seller.verify.countryList.netherland") },
    { shortCode: t("seller.verify.countryListByShortCode.newZealand"), label: t("seller.verify.countryList.newZealand") },
    { shortCode: t("seller.verify.countryListByShortCode.norway"), label: t("seller.verify.countryList.norway") },
    { shortCode: t("seller.verify.countryListByShortCode.poland"), label: t("seller.verify.countryList.poland") },
    { shortCode: t("seller.verify.countryListByShortCode.portugal"), label: t("seller.verify.countryList.portugal") },
    { shortCode: t("seller.verify.countryListByShortCode.spain"), label: t("seller.verify.countryList.spain") },
    { shortCode: t("seller.verify.countryListByShortCode.sweden"), label: t("seller.verify.countryList.sweden") },
    { shortCode: t("seller.verify.countryListByShortCode.switzerland"), label: t("seller.verify.countryList.switzerland") },
    { shortCode: t("seller.verify.countryListByShortCode.unitedKingdom"), label: t("seller.verify.countryList.unitedKingdom") },
    { shortCode: t("seller.verify.countryListByShortCode.unitedStates"), label: t("seller.verify.countryList.unitedStates") },
    { shortCode: t("seller.verify.countryListByShortCode.others"), label: t("seller.verify.countryList.others") },
  ];

  const schema = yup.object().shape({
    country: yup.string().required(t("register.country_is_a_required_field")).min(1)
      .test("is-country-not-none", t("register.country_is_a_required_field"), (value) => {
        return value !== "none";
      }),
    phone: yup
      .mixed()
      .optional()
      .test("is-valid-phone", t("register.phone_number_is_not_valid"), (value) => {
        if (value) {
          return isValidPhoneNumber(value);
        }
        return false;
      })
      .notRequired(),
    terms: yup.bool().oneOf([true], t("register.you_must_accept_terms_and_condition")),
  });

  const { handleSubmit, control, getValues, reset, setValue, formState: { errors } } = useForm<createUserStepOneDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      country: t("seller.verify.countryListByShortCode.others"),
      phone: "+",
    },
  });

  useEffect(() => {
    async function fetchIpAddress() {
      const response = await fetch('https://ipapi.co/json/');
      const data: any = await response.json();
      if (data) {
        const res: any = await fetch(`https://ipinfo.io/${data.ip}?token=6c18281e43a4a1`);
        const locData: any = await res.json();
        const selCountry = countryList.find((value) => value.shortCode === locData?.country);
        if (selCountry) {
          setValue("country", selCountry.shortCode);
          localStorage.setItem("userIpCountry", selCountry.shortCode);
          Cookies.set("country", selCountry.shortCode, { expires: 7, secure: true  });
        }
      }
    }
    if(localStorage.getItem("userIpCountry")) {
      setValue("country", localStorage.getItem("userIpCountry"));
    } else {
      fetchIpAddress()
    }
    
  }, []);

  const onSubmit: SubmitHandler<createUserStepOneDefaultValue> = async (data) => {
    onCompleted(data);
  };

  const handleChange = (event) => {
    const keyword = event.target.value;
    const item = CountryCodes.find(c => keyword.includes(c.code));
    Cookies.set("country", keyword, { expires: 7, secure: true  });
    if (item) {
      const phone_code = item.dial_code
      setValue("phone", phone_code);
    }
  }

  return (
    <>
      <Grid item xs={12} sm={7} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate width={"100%"} maxWidth={"500px"}>
          <Typography variant={"h5"}>{t("register.title")}</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "repeat(1,1fr)",
              gap: 1,
            }}
          >

            <Box mt={4}>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <CountrySelect field={field} countryList={countryList} onChange={handleChange}></CountrySelect>
                )}
              />
              {errors.country && (
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errors?.country?.message}
                </FormHelperText>
              )}
            </Box>


            <PhoneNumberInput
              control={control}
              label={t("register.phone_number")}
              name="phone"
              isActive={"true"}
              error={errors?.phone?.message}
            />
          </Box>

          <Button
            className={"buttonClass"}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#00a859" }}
          >
            Continue
          </Button>
        </Box>
      </Grid>
    </>
  );
}
