import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { baseUrl } from '../../Helpers/baseUrl';
import {
    Card,
    CircularProgress,
    Stack,
    Typography
} from "@mui/material";
import { numberWithCommas } from "../../Helpers/utils";
import Stats from "../Utils/Admin/Stats";
import ChartComponent from "../Utils/Admin/Charts";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    useFetchAllOrders,
    useGetAppStats,
    useGetOrdersMonthly2,
    useGetOrdersStats, useSendDeliveredOrders
} from "../../hooks/useDataFetch";
import { IYearlyStats } from "../../Helpers/Types";
import { key } from "../../Helpers/Exchange";
import ContextApi from "../../Store/context/ContextApi";
import axios from "axios";
import { useTokenRefetch } from "../../hooks/useRefresh";

type data = {
    title: string,
    amount: number,
    percent: number,
    color: string
}

interface IAppStats {
    userStats: number,
    userNext: number,
    sellerStats: number,
    sellerNext: number,
    orderStats: number,
    orderNext: number,
    usersByCountry: any,
    sellersByCountry: any,
    userSign: boolean,
    sellerSign: boolean,
    orderSign: boolean
}
interface IOrders {
    totalSales: number,
    totalOrders: number
}
type TOrders = {
    _id: string,
    name: string,
    price: number,
    status: string,
    quantity: number,
    shippingCost: number
}

const schema = yup.object().shape({
    type: yup.string().min(3)
})
type Itype = {
    type: string
}
const DashboardAdmin: React.FC = () => {
    const { handleSubmit, control, getValues, setValue, reset, watch, formState: { errors } } = useForm<Itype>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            type: 'All',
        }
    })
    const handleRate = useContext(ContextApi).handleRateChange;
    const [orders, setOrders] = useState<TOrders[]>([]);
    const [usersByCountry, setUsersByCountry] = useState<any>([]);
    const [sellersByCountry, setSellersByCountry] = useState<any>([]);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const onSuccess = (data: TOrders[]) => {
        setOrders(data)
    }
    const { refetch, data: ordersData } = useFetchAllOrders(onSuccess);
    const handleAdminRate = useContext(ContextApi).handleAdminRate;
    useTokenRefetch(refetch)
    const [rate, setRate] = useState<number>(0)
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

    const [stats, setStats] = useState<data[]>([])
    const onOrderStatSuccess = async (data: IOrders) => {
        setTotalOrders(data.totalOrders)
        setTotalSales(data.totalSales);
    }
    const onAppStatsSuccess = (data: IAppStats) => {
        const stats: data[] = [
            {
                title: 'Users',
                amount: data.userNext,
                percent: data.userStats,
                color: data.userSign ? 'green' : 'red'
            },
            {
                title: 'Sellers',
                amount: data.sellerNext,
                percent: data.sellerStats,
                color: data?.sellerSign ? 'green' : 'red'
            },
            {
                title: 'Sales',
                amount: data?.orderNext,
                percent: data?.orderStats,
                color: data.orderSign ? 'green' : 'red'
            },
        ];
        setUsersByCountry(data.usersByCountry)
        setSellersByCountry(data.sellersByCountry)
        setStats(stats)
    }
    const { isLoading, refetch: appRefetch } = useGetAppStats(onAppStatsSuccess)
    useTokenRefetch(appRefetch)
    const { refetch: statRefetch } = useGetOrdersStats(onOrderStatSuccess);
    useTokenRefetch(statRefetch)


    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [monthlyStats, setMonthlyStats] = useState<number[]>([]);
    const onYearlySuccess = useCallback((data: IYearlyStats) => {
    }, [isUpdated])
    const onYearly2Success = (data: number[]) => {
        setMonthlyStats(data);
    }
    const onSendDeliveredOrderSuccess = () => {
        refetch()
        setValue('type', 'All')
    }

    const { isLoading: isSending, mutate: sendOrder, isSuccess } = useSendDeliveredOrders(onSendDeliveredOrderSuccess);

    const handleSendOrder = () => {
        sendOrder()
    }
    const { isLoading: isFetching, refetch: orderRefetch } = useGetOrdersMonthly2(onYearly2Success)
    useTokenRefetch(orderRefetch)
    const onSubmit: SubmitHandler<Itype> = async (data) => {
        reset()
    };
    const type = watch('type');
    useEffect(() => {
        const type = watch('type');
        if (type !== 'All') {
            const newOrders = ordersData?.filter(order => order.status === type.toLowerCase());
            return setOrders(newOrders)
        }
        setOrders(ordersData)

    }, [watch('type')])

    const handleFix = (value: number) => value.toFixed(2)
    const handleRefresh = () => {
        refetch()
    }

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Box height={"calc(100vh - 60px)"}>
            <Grid container height={"100%"} spacing={1}>
                <Grid item xs={8} height={"100%"}>
                    <Grid container spacing={1} height={"100%"}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    bgcolor: 'white',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                            >
                                {isFetching && <Typography textAlign={'center'}> <CircularProgress /></Typography>}
                                {monthlyStats.length > 0 && <ChartComponent rate={rate} chart={monthlyStats} />}
                            </Paper>
                        </Grid>
                        {stats?.length > 0 && stats.map((data, index) => (
                            <Grid key={index} item md={6}>
                                <Stats title={data.title} amount={data.amount} percent={data.percent} color={data.color} />
                            </Grid>
                        ))}
                        <Grid item md={6}>
                            <Card sx={{ bgcolor: 'white', borderRadius: '7px', height: "100%", display: "flex", alignItems: "center" }}>
                                <Stack px={2} py={"7px"}>
                                    <Stack spacing={0}>
                                        <Typography fontSize={14}>Gross Sales</Typography>
                                        <Typography pl={1} fontSize={14}>$ {handleFix(totalSales * rate)}</Typography>
                                    </Stack>
                                    <Stack spacing={0}>
                                        <Typography fontSize={14}>Unit Sold</Typography>
                                        <Typography pl={1} fontSize={14}># {numberWithCommas(totalOrders)}</Typography>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} height={"100%"}>
                    <Grid container spacing={1} height={"100%"}>
                        <Grid item xs={12} height={"50%"}>
                            <Card sx={{ height: "100%", p: 2 }}>
                                <Stack spacing={1}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <Typography fontSize={14} fontWeight={600}>Users By Country</Typography>
                                        <Typography fontSize={14} fontWeight={600}>{usersByCountry.reduce((total, item) => total + item.userCount, 0)}</Typography>
                                    </Stack>
                                    {usersByCountry.map((user, index) => {
                                        return (
                                            <Stack direction={"row"} justifyContent={"space-between"} key={index}>
                                                <Typography fontSize={14}>{user._id}</Typography>
                                                <Typography fontSize={14}>{user.userCount}</Typography>
                                            </Stack>

                                        )
                                    })}
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} height={"50%"}>
                            <Card sx={{ height: "100%", p: 2 }}>
                                <Stack spacing={1}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <Typography fontSize={14} fontWeight={600}>Sellers By Country</Typography>
                                        <Typography fontSize={14} fontWeight={600}>{sellersByCountry.reduce((total, item) => total + item.userCount, 0)}</Typography>
                                    </Stack>
                                    {sellersByCountry.map((seller, index) => {
                                        return (
                                            <Stack direction={"row"} justifyContent={"space-between"} key={index}>
                                                <Typography fontSize={14}>{seller._id}</Typography>
                                                <Typography fontSize={14}>{seller.userCount}</Typography>
                                            </Stack>

                                        )
                                    })}
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}
export default DashboardAdmin;