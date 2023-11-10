import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress, Typography } from "@mui/material";
import { Cancel, CheckCircleOutlined, Launch } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { snackBarOpen } from "../../../Store/Utils";
import { TSellerStore } from "../../../Helpers/Types";
import { useUpdateSellerStatus } from "../../../hooks/useDataFetch";
interface IVerify {
  balance: number,
  seller: TSellerStore
}
interface IReviewTable {
  reviews: IVerify[];
  handleRefetch: () => void;
}

const ReviewTable: React.FC<IReviewTable> = ({ reviews, handleRefetch }) => {
  const handleRedirect = (file: string) => {
    window.open(file, "_blank");
  };
  const updateSeller = (id: string, status: string) => {
    const isActive: boolean = status === "true";
    const message: string = isActive ? "Approved" : "Rejected";
    const severity: string = isActive ? "success" : "warning";
    dispatch(
      snackBarOpen({
        message,
        severity,
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
    const data = {
      id,
      active: status,
    };
    updateSellerStatus(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const { mutate: updateSellerStatus, isLoading } =
    useUpdateSellerStatus(onSuccess);
  const dispatch = useDispatch();

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
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Name/Store</TableCell>
              <TableCell align="left">Account type</TableCell>
              <TableCell align="left">Document type</TableCell>
              <TableCell align="left">View</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">Approve</TableCell>
              <TableCell align="left">Reject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map(({seller}, index) => {
                const name = seller?.storeId?.name;
                if (name) {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {seller?.storeId?.name}
                      </TableCell>
                      <TableCell align="left"> {seller?.account} </TableCell>
                      <TableCell align="left"> {seller?.documentType}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant={"contained"}
                          color={"inherit"}
                          sx={{ borderRadius: "20px" }}
                          className={"color"}
                          onClick={() => handleRedirect(seller?.file)}
                        >
                          <Launch/>
                        </Button>
                      </TableCell>
                      <TableCell>{seller.location}</TableCell>
                      <TableCell align="left">
                        <CheckCircleOutlined
                          className={"pointer"}
                          onClick={() => updateSeller(seller?._id, "true")}
                        />
                        {isLoading && <CircularProgress />}
                      </TableCell>
                      <TableCell align="left">
                        <Cancel
                          className={"pointer"}
                          onClick={() => updateSeller(seller?._id, "false")}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={reviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default ReviewTable;
