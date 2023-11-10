import * as React from 'react';
import Button from '@mui/material/Button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CircularProgress,
    FormControl, FormHelperText,
    Grid,
    InputLabel, Select,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import Holder from "../Wappers/Holder";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import { usePostUserRefunds } from "../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import slug from "slug";

type reset = {
    reason: string;
};
export default function Refund() {
    const isMobile: boolean = useMediaQuery((('(max-width : 600px)')));

    const { t } = useTranslation();
    const schema = yup.object().shape({
        reason: yup.string().required(t("account.refund.reason_is_a_required_field")),
    });
    const { handleSubmit, control, getValues, reset, watch, formState: { errors } } = useForm<reset>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            reason: '',
        }
    });
    const router = useRouter();
    const { q } = router.query;
    const [title, setTitle] = useState<string>('');
    const [product, setProduct] = useState(null)
    const handleFetchProduct = async (id: string) => {
        const response = await axios.get(`${baseUrl}/product/${id}`);
        const data = response.data;
        setProduct(data.product)
        setTitle(data.product.title)
    }
    useEffect(() => {
        if (q) {
            handleFetchProduct(q as string)
        }
    }, [q])

    const onSubmit: SubmitHandler<reset> = async (data) => {
        const { reason } = data;
        const newData = {
            productId: product._id,
            reason
        }
        postRefund(newData)
    };
    const dispatch = useDispatch();
    const onSuccess = () => {
        dispatch(snackBarOpen({
            message: 'refund created successfully', severity: 'success', snackbarOpen: true, rate: 0,
            sellerRate: 0
        }))
        router.push("/account/pastorders");
    }

    const [verifyEmail, setVerifyEmail] = React.useState<boolean>(false);
    const { isLoading, mutate: postRefund, isError } = usePostUserRefunds(onSuccess)
    useEffect(() => {
        if (isError) {
            dispatch(snackBarOpen({
                message: 'something went wrong ', severity: 'warning', snackbarOpen: true, rate: 0,
                sellerRate: 0
            }))
        }
    }, [isError])
    return (
        <>
            {!verifyEmail &&
                <Holder>
                    <Grid container mt={4} height={isMobile ? "calc(100vh - 138px)" : "calc(100vh - 82px)"}>
                        <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                            <Stack component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                                <Stack direction={'row'} spacing={3}>
                                    <Typography variant={'h6'}>{t("account.refund.selected_item")} :</Typography>
                                    <Typography variant={'h6'}>{title}</Typography>
                                </Stack>
                                <Toolbar />
                                <Stack spacing={4} direction={'row'}>
                                    <Typography variant={'h5'}>{t("account.refund.refund_reason")}</Typography>
                                    <FormControl sx={{ minWidth: 170 }}  >
                                        <InputLabel id="demo-simple-select-label" shrink={false}>{watch('reason') === '' && t("account.refund.select_a_reason")}</InputLabel>
                                        <Controller
                                            name='reason'
                                            control={control}
                                            render={({ field, formState: { errors } }) => (
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    {...field}
                                                    variant={'outlined'}
                                                    className={'sortButton'}
                                                    sx={{
                                                        bgcolor: '#fff', height: 45, color: '#000', border: '2px solid black',
                                                        "& .MuiSvgIcon-root": {
                                                            color: "black",
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value={"Item does not match description"}>{t("account.refund.item_does_not_match_description")}</MenuItem>
                                                    <MenuItem value={"Item was damaged upon arrival"}>{t("account.refund.item_was_damaged_upon_arrival")}</MenuItem>
                                                    <MenuItem value={"Seller shipped a wrong item"}>{t("account.refund.seller_shipped_a_wrong_item")}</MenuItem>
                                                    <MenuItem value={"Item arrived late"}>{t("account.refund.item_arrived_late")}</MenuItem>
                                                    <MenuItem value={"Item is of poor value"}>{t("account.refund.item_is_of_poor_value")}</MenuItem>
                                                    <MenuItem value={"Item doesn't fit (wrong size)"}>{t("account.refund.item_doesnt_fit_wrong_size")}</MenuItem>
                                                </Select>
                                            )}
                                        />
                                        <FormHelperText sx={{ color: 'red' }}>{errors?.reason?.message} </FormHelperText>
                                    </FormControl>
                                </Stack>
                                <Stack my={2}>
                                    <Typography variant={'body1'}>
                                        {t("account.refund.the_seller_of_this_product_will_get_back_to_you_within_24_hours_when_you_submit_your_request")}
                                    </Typography>
                                    <Typography variant={'body1'}>
                                        {t("account.refund.contact_us_after_24_hours_of_no_response_from_the_seller")}
                                        <br />
                                        <u><Link href={'/contact'}>{t("account.refund.contact_us")}</Link></u>
                                    </Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    <Button
                                        disabled={isLoading}
                                        className={'buttonClass'}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2, backgroundColor: '#00a859' }}
                                    >
                                        {isLoading && <CircularProgress />}
                                        {t("account.refund.request_refund")}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Holder>
            }
        </>
    );
}