import React, { useCallback, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress, Typography } from "@mui/material";
import { getCurrencySymbol } from "../../../Helpers/Exchange";
import { reCreateDate, getHourMinute } from "../../../Helpers/getDate";
import Truncate from "../../../Helpers/Truncate";
import { CancelOutlined } from "@mui/icons-material";
import { useDeleteAdminOrder } from "../../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../../Store/Utils";

type TOrders = {
    _id: string,
    name: string,
    price: number,
    quantity: number,
    shippingCost: number,
    productId: any,
    createdAt: any,
    status: string
}
interface IOrders {
    orders: TOrders[],
    rate: number,
    handleRefresh: () => void
}
const DashboardOrders: React.FC<IOrders> = ({ orders, handleRefresh, rate }) => {
    const [currentId, setCurrentId] = useState<string>('');
    const handleDeleteOrder = useCallback((id: string) => {
        confirm("Do you want to remove this item?");
        setCurrentId(id)
        const data = {
            id
        }
        deleteOrder(data)
    }, []);
    const dispatch = useDispatch();
    const onSuccess = () => {
        dispatch(snackBarOpen({
            message: 'Order Cancelled Successfully', rate: 0, severity: "success", snackbarOpen: true,
            sellerRate: 0
        }))
        handleRefresh()
    }
    const { mutate: deleteOrder, isLoading } = useDeleteAdminOrder(onSuccess)
    return <>
        <Typography variant={'h6'} my={2}> </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table sx={{ minWidth: 350 }} aria-label="stats table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell align="left">Product</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="left">Fee</TableCell>
                        <TableCell align="left">Amount</TableCell>
                        <TableCell align="left">Cancel</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row._id}
                            </TableCell>
                            <TableCell align="left"> {Truncate(row.name, 30)} </TableCell>
                            <TableCell align="center" >{row.createdAt && (reCreateDate(row.createdAt) + "," + getHourMinute(row.createdAt))}</TableCell>
                            <TableCell align="left"> {row.quantity} </TableCell>
                            <TableCell align="left"> {getCurrencySymbol(row.productId.owner?.currency)} {row.shippingCost} </TableCell>
                            <TableCell align="left"> {getCurrencySymbol(row.productId.owner?.currency)} {row.price}</TableCell>
                            <TableCell align="left">  {isLoading && currentId === row._id && <CircularProgress />}    {row.status === 'placed' && <CancelOutlined onClick={() => handleDeleteOrder(row._id)} className={'pointer'} />}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}
export default DashboardOrders;
