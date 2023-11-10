import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Card,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { baseUrl } from "../../Helpers/baseUrl";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFetchAllOrders, useSendDeliveredOrders } from "../../hooks/useDataFetch";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import DashboardOrders from "../Utils/Admin/DashboardOrders";
import ContextApi from "../../Store/context/ContextApi";
import { key } from "../../Helpers/Exchange";
import axios from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Orders: React.FC = () => {

    type TOrders = {
        _id: string,
        name: string,
        price: number,
        status: string,
        quantity: number,
        createdAt: any,
        productId: any,
        shippingCost: number
    }

    type Itype = {
        type: string
    }


    const schema = yup.object().shape({
        type: yup.string().min(3)
    })

    const isMobile = useMediaQuery("(max-width: 600px)");
    const router = useRouter();

    const searchFields = ['ID', 'Product', 'Quantity', 'Amount',]

    const { handleSubmit, control, getValues, setValue, reset, watch, formState: { errors } } = useForm<Itype>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            type: 'All',
        }
    })

    const [searchOption, setSearchOption] = useState<SearchOptionType>({
        field: searchFields[0],
        keyword: '',
    });

    const [orders, setOrders] = useState<TOrders[]>([]);
    const [filterOrders, setFilterOrders] = useState<TOrders[]>([]);
    const [rate, setRate] = useState<number>(0)
    const handleAdminRate = useContext(ContextApi).handleAdminRate;

    useEffect(() => {
        const handleRateChange = async () => {
            const response = await axios.patch(
                `${baseUrl}/rate/${'Pounds'}`,
                {}
            );
            const data = response.data.rate;
            setRate(data)
            handleAdminRate(data)
        }
        handleRateChange()
    }, []);

    useEffect(() => {
        if (searchOption.keyword === '') {
            setFilterOrders(orders)
        } else {
            let filter = orders;
            if (searchOption.field === searchFields[0]) {
                filter = orders.filter(s => s._id.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[1]) {
                filter = orders.filter(s => s.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[2]) {
                filter = orders.filter(s => s.quantity === Number(searchOption.keyword))
            } else if (searchOption.field === searchFields[3]) {
                filter = orders.filter(s => s.price === Number(searchOption.keyword))
            }
            setFilterOrders(filter)
        }
    }, [searchOption, orders])

    const onSuccess = (data: TOrders[]) => {
        setOrders(data)
    }

    const { refetch, isFetched, isFetching, data: ordersData } = useFetchAllOrders(onSuccess);

    useTokenRefetch(refetch)
    const handleRefresh = () => {
        refetch()
    }

    const onSubmit: SubmitHandler<Itype> = async (data) => {
        reset()
    };

    const onSendDeliveredOrderSuccess = () => {
        refetch()
        setValue('type', 'All')
    }

    const { isLoading: isSending, mutate: sendOrder, isSuccess } = useSendDeliveredOrders(onSendDeliveredOrderSuccess);

    const type = watch('type');
    useEffect(() => {
        const type = watch('type');
        if (type !== 'All') {
            const newOrders = ordersData?.filter(order => order.status === type.toLowerCase());
            return setOrders(newOrders)
        }
        setOrders(ordersData)

    }, [watch('type')])

    const handleSendOrder = () => {
        sendOrder()
    }
    return (
        <>
            <Header
                title="Orders"
                searchFields={searchFields}
                totalAmount={orders?.length}
                searchOption={searchOption}
                setSearchOption={setSearchOption}
            />
            <Card
                elevation={0}
                sx={{ background: "white", mt: 1, px: 2, minHeight: "90vh" }}
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
                <Stack direction={'row'} spacing={2} alignItems={"center"} justifyContent={"space-between"}>
                    <Stack direction={'row'} spacing={2} alignItems={"center"}>
                        <Typography fontSize={14}> Orders</Typography>
                        <Box component={'form'} onSubmit={handleSubmit(onSubmit)} noValidate>
                            <FormControl sx={{ minWidth: 170 }}  >
                                <InputLabel id="demo-simple-select-label" shrink={false}>
                                    {watch('type') === 'All' && 'All'}</InputLabel>
                                <Controller
                                    name='type'
                                    control={control}
                                    render={({ field, formState: { errors } }) => (
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            {...field}
                                            variant={'outlined'}
                                            sx={{
                                                bgcolor: 'transparent !important', textTransform: 'none', color: '#000',
                                                "& .MuiSvgIcon-root": {
                                                    color: "black",
                                                },
                                                '& fieldset': {
                                                    border: '0px !important',
                                                    outline: 'none !important'
                                                },
                                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    border: "0px !important",
                                                    borderRadius: "0px !important"
                                                },
                                                '& ..MuiOutlinedInput-notchedOutline:hover': {
                                                    border: '0px !important',
                                                    outline: 'none !important'
                                                }
                                            }}
                                        >
                                            <MenuItem value={"All"}>All </MenuItem>
                                            <MenuItem value={'Placed'}>Placed </MenuItem>
                                            <MenuItem value={'Processed'}>Processed</MenuItem>
                                            <MenuItem value={'Shipped'}>Shipped</MenuItem>
                                            <MenuItem value={'delivered'}>Delivered</MenuItem>
                                        </Select>
                                    )
                                    }
                                />
                            </FormControl>
                        </Box>
                    </Stack>
                    {type === 'Shipped' &&
                        <Button
                            disabled={isSending}
                            onClick={handleSendOrder}
                            sx={{ width: 'auto', height: '40px', my: 4, display: 'flex' }} variant={'contained'}>
                            {isSending && <CircularProgress />} Send Email
                        </Button>
                    }
                </Stack>
                <Box>
                    {isFetching && <CircularProgress />}
                    {isFetched && filterOrders?.length > 0 && (
                        <DashboardOrders handleRefresh={handleRefresh} orders={filterOrders} rate={rate} />
                    )}
                </Box>

            </Card>
        </>
    );
};
export default Orders;
