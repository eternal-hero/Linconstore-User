import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Rating, Typography } from "@mui/material";
import {TProducts, TSellerStore} from "../../../Helpers/Types";

type TRating = {
  name : string,
  rate : number,
  description : string,
  owner : TSellerStore,
  productId: TProducts
}
interface IRating {
  ratings: TRating[];
}
const RatingTable: React.FC<IRating> = ({ ratings }) => {
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
              <TableCell>Product</TableCell>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Comment</TableCell>
              <TableCell align="left">Stars</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.productId?.title}
                  </TableCell>
                  <TableCell align="left"> {row.name} </TableCell>
                  <TableCell align="left"> {row.description}</TableCell>
                  <TableCell align="left">
                    <Rating
                      name="product_rating"
                      size={"small"}
                      value={row.rate}
                      readOnly
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={ratings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default RatingTable;
