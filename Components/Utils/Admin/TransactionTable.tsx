import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { TRefunds } from "../../../Helpers/Types";
import { Loop, MarkChatRead } from "@mui/icons-material";

interface ITransaction {
  transactions: TRefunds[]; //TODO need to update type
}
const TransactionTable: React.FC<ITransaction> = ({ transactions }) => {
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
      <Typography variant={"h6"} my={2}>
        {" "}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Transaction Type</TableCell>
              <TableCell align="center">Transaction ID</TableCell>
              <TableCell align="center">Account</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Method</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                Withdrawal
                </TableCell>
                <TableCell align="center"> QWERRRJO </TableCell>
                <TableCell align="center"> test@email.com</TableCell>
                <TableCell align="center">Seller payout</TableCell>
                <TableCell align="center">Bank Account</TableCell>
                <TableCell align="center"> $1,000</TableCell>
                <TableCell align="center" >
                London
                </TableCell>
                <TableCell align="center" >
                Approved
                </TableCell>
                <TableCell align="center" >
                15 Sep, 23
                </TableCell>
                <TableCell align="center" >
                10.00am
                </TableCell>

            </TableRow>
            {transactions
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Withdrawal
                  </TableCell>
                  <TableCell align="center"> QWERRRJO </TableCell>
                  <TableCell align="center"> test@email.com</TableCell>
                  <TableCell align="center">Seller payout</TableCell>
                  <TableCell align="center">Bank Account</TableCell>
                  <TableCell align="center"> $1,000</TableCell>
                  <TableCell align="center" >
                    London
                  </TableCell>
                  <TableCell align="center" >
                    Approved
                  </TableCell>
                  <TableCell align="center" >
                    15 Sep, 23
                  </TableCell>
                  <TableCell align="center" >
                    10.00am
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default TransactionTable;
