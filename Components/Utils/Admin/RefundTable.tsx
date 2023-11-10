import React, { Dispatch, SetStateAction, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { TRefunds } from "../../../Helpers/Types";
import { Close, Loop, MarkChatRead } from "@mui/icons-material";
import Image from "next/image";
import { useAdminModifyRefund } from "../../../hooks/useDataFetch";
import { getCurrencySymbol } from "../../../Helpers/Exchange";

interface IRefundTable {
  refunds: TRefunds[];
  refetch: any;
  setOpenChat: Dispatch<SetStateAction<boolean>>;
}
const RefundTable: React.FC<IRefundTable> = ({ refunds, refetch, setOpenChat }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRefund = () => {
    if (selectedRefund.status == "RF-initiated") {
      updateRefund({ id: selectedRefund._id, status: "refunded" })
    }
  }

  const onRefundSuccess = () => {
    setOpenModal(false);
    setSelectedRefund(null)
    refetch()
  }

  const { isLoading: isUpdating, mutate: updateRefund } = useAdminModifyRefund(onRefundSuccess)

  return (
    <>
      <Typography variant={"h6"} my={2}>
        {" "}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Store Name</TableCell>
              <TableCell align="center">User Email</TableCell>
              <TableCell align="center">Reason</TableCell>
              <TableCell align="center">Product Name</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Chat</TableCell>
              <TableCell align="center">Issue Refund</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row: any, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.storeId?.name}
                  </TableCell>
                  <TableCell align="center"> {row.userId.email} </TableCell>
                  <TableCell align="center"> {row.reason}</TableCell>
                  <TableCell align="center"> {row.productId.title} </TableCell>
                  <TableCell align="center"> {getCurrencySymbol(row.productId.owner.currency)} {row.productId.price} </TableCell>
                  <TableCell align="center"> {row.status}</TableCell>
                  <TableCell align="center" >
                    <MarkChatRead onClick={() => setOpenChat(true)} sx={{ ":hover": { cursor: "pointer" }, color: "var(--primary)" }} />
                  </TableCell>
                  <TableCell align="center" >
                    <Button disabled={row.status !== "RF-initiated"} onClick={() => { setOpenModal(true); setSelectedRefund(row) }}>
                      <Loop sx={{ ":hover": { cursor: "pointer" } }} />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={refunds.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        open={openModal}
        onClose={() => { setOpenModal(false); setSelectedRefund(null) }}
      >
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            top: "100",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "1000",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: "20px",
              boxShadow: 24,
              p: 3,
              pb: 3,
            }}
          >
            <Stack spacing={2}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontWeight={600}>Issue Refund</Typography>
                <Close onClick={() => setOpenModal(false)} sx={{ cursor: "pointer" }} />
              </Box>

              <Stack spacing={2}>
                <Stack direction={"row"} spacing={2}>
                  <Image
                    width={50}
                    height={35}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={selectedRefund?.productId.photo[0]}
                    alt={"image of Happy"}
                  />
                  <Stack>
                    <Typography fontSize={12}>ID: {selectedRefund?.productId._id}</Typography>
                    <Typography fontSize={12}> {selectedRefund?.productId.title} </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack spacing={2} textAlign={"center"}>
                <Typography fontSize={14}> {getCurrencySymbol(selectedRefund?.productId.owner.currency)} {selectedRefund?.productId.price} </Typography>
                <Stack direction={"row"} spacing={2}>
                  <TextField
                    size="small"
                    fullWidth
                  />
                  <Button size="small" variant="contained" color="error" sx={{ minWidth: 130 }} onClick={() => handleRefund()} disabled={isUpdating || selectedRefund?.status !== "RF-initiated"}>Issue Refund</Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Modal>

    </>
  );
};
export default RefundTable;
