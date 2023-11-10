import React, { useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Switch, Typography } from "@mui/material";
import { numberWithCommas } from "../../../Helpers/utils";
import { DeleteOutlined } from "@mui/icons-material";
import { TAdminSeller } from "../../../Helpers/Types";
import {
  useDeleteAdminSeller,
  useUpdateAdminSellers,
} from "../../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { deleteModalOpen } from "../../../Store/Modal";
import { currencies } from "../../Layouts/Seller/Dashboard";
interface IAdminSeller1 {
  store: any,
  length: number
}
interface IAdminSeller {
  reports: any[];
  handleRefetch: () => void;
}
const ReportTable: React.FC<IAdminSeller> = ({ reports, handleRefetch }) => {
  // const onSuccess = () => {
  //   handleRefetch();
  // };

  localStorage.setItem('ssssssssssssssssssssssssssss', JSON.stringify(reports))
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Store name</TableCell>
              <TableCell align="left">Store Contact</TableCell>
              <TableCell align="left">Product</TableCell>
              <TableCell align="left">Reason</TableCell>
              <TableCell align="left">Reported Times</TableCell>
              <TableCell align="left">Unit Sold</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((report, index) => {
                return <>
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {report.productId.owner.name}
                      </TableCell>
                      <TableCell>{report.productId.owner.owner.owner.email}</TableCell>
                      <TableCell>{report.productId.title}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.reportAmount}</TableCell>
                      <TableCell>{report.productId.orders}</TableCell>
                    </TableRow>
                </>
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={reports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default ReportTable;
