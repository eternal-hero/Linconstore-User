import React, { useContext, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress, Switch, Typography } from "@mui/material";
import { AddTaskOutlined, DeleteOutline, Launch } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteModalOpen, requestModalOpen } from "../../../Store/Modal";
import { TSellerStore } from "../../../Helpers/Types";
import { useUpdateSellerVerification } from "../../../hooks/useDataFetch";
import Button from "@mui/material/Button"
import seller from "../../../pages/seller";
import ContextApi from "../../../Store/context/ContextApi";
interface IVerify {
  balance: number,
  seller: TSellerStore
}
interface IVerifyTable {
  requests: IVerify[];
  handleRefetch: () => void;
}
const VerificationTable: React.FC<IVerifyTable> = ({
  requests,
  handleRefetch,
}) => {
  const dispatch = useDispatch();
  const handleUpdate = (id: string) => {
    const data = {
      id,
    };
    updateSeller(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const { mutate: updateSeller, isLoading } =
    useUpdateSellerVerification(onSuccess);

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
  const handleRedirect = (file: string) => {
    window.open(file, "_blank");
  };

  const handleUpdateSellerId = useContext(ContextApi).handleUpdateSellerId;

  const handleRequest = (seller: any) => {
    handleUpdateSellerId(seller)
    dispatch(requestModalOpen())
  }
  return (
    <>
      <Typography variant={"h6"} my={2}>
        {" "}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Name/Store</TableCell>
              <TableCell>Account Type</TableCell>
              <TableCell>URL</TableCell>
              <TableCell align="left">Document type</TableCell>
              <TableCell align="left">View</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">Document ID</TableCell>
              <TableCell align="right">Status</TableCell>
              {/* <TableCell align="right">Delete</TableCell> */}
              <TableCell align="right">Request</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map(({ seller }, index) => {
                const name = seller?.storeId?.name;
                if (name) {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {seller.storeId?.name}
                      </TableCell>
                      <TableCell align="left"> {seller?.account}</TableCell>
                      <TableCell align="left"> <a href={`https://${seller?.websiteUrl}`} target="_blank" rel="noreferrer">{seller?.websiteUrl}</a></TableCell>
                      <TableCell align="left"> {seller?.documentType}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant={"contained"}
                          color={"primary"}
                          sx={{ borderRadius: "10px", fontSize: 12 }}
                          size="small"
                          onClick={() => handleRedirect(seller?.file)}
                        >
                          <Launch />
                        </Button>
                      </TableCell>
                      <TableCell>{seller.location}</TableCell>

                      {/* TODO need to change to document ID, not type */}
                      <TableCell>
                        {seller.documentId}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <Switch
                          checked={seller.isVerified}
                          onChange={() => handleUpdate(seller._id)}
                        />{" "}
                        {isLoading && <CircularProgress />}{" "}
                      </TableCell>
                      {/* <TableCell align="right">
                        {" "}
                        <DeleteOutline
                          onClick={() =>
                            dispatch(
                              deleteModalOpen({ seller, type: true })
                            )
                          }
                        />{" "}
                      </TableCell> */}
                      <TableCell align="right">
                        <AddTaskOutlined
                          className={"pointer"}
                          onClick={() => handleRequest(seller)}
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
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default VerificationTable;
