import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Grid, Modal, Stack, Switch, Typography, useMediaQuery } from "@mui/material";
import { Close, DeleteOutlined, Layers, OpenInNew } from "@mui/icons-material";
import { TAdminUser } from "../../../Helpers/Types";
import {
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "../../../hooks/useDataFetch";
import Image from "next/image";
import slug from "slug";

interface IAdminUsers {
  users: TAdminUser,
  no: number,
  lastOrders: any,
}

interface IAdminUser {
  users: IAdminUsers[];
  handleRefetch: () => void;
}
const UserTable: React.FC<IAdminUser> = ({ users, handleRefetch }) => {
  const handleUpdate = (id: string) => {
    const data = {
      id,
    };
    updateUser(data);
  };
  const handleDelete = (id: string) => {
    const data = {
      id,
    };
    deleteUser(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const { mutate: updateUser } = useUpdateAdminUser(onSuccess);
  const { mutate: deleteUser } = useDeleteAdminUser(onSuccess);


  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPad = useMediaQuery("(max-width: 900px)");


  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUsers | null>(null);
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

  const handleOpenModal = (item: IAdminUsers) => {
    setOpenModal(true);
    setSelectedUser(item);

  }
  return (
    <>
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Email Address</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">No of orders</TableCell>
              <TableCell align="right">View</TableCell>
              {/* <TableCell align="right">Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => {
                if (!row.users?.isClosed) {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.users.firstName + " " + row.users.lastName}
                      </TableCell>
                      <TableCell align="left"> {row.users.phone} </TableCell>
                      <TableCell align="left">
                        {row.users.email}
                      </TableCell>
                      <TableCell align="left">
                        {row.users.country}
                      </TableCell>
                      <TableCell align="right">
                        <Switch
                          checked={row.users.isVerified}
                          onChange={() => handleUpdate(row.users._id)}
                        />
                      </TableCell>
                      <TableCell align="right"> {row.users.orders} </TableCell>
                      <TableCell align="right">
                        <Layers
                          onClick={() => handleOpenModal(row)}
                          className={"pointer"}
                        />
                      </TableCell>
                      {/* <TableCell align="right">
                        <DeleteOutlined
                          onClick={() => handleDelete(row.users._id)}
                          className={"pointer"}
                        />
                      </TableCell> */}
                    </TableRow>
                  )
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          bottom: isMobile ? 50 : 0,
        }}
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
              top: !isMobile ? "50%" : "70%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isPad ? "95vw" : 500,
              bgcolor: "background.paper",
              borderRadius: "20px",
              boxShadow: 24,
              p: 3,
              pb: !isMobile ? 3 : 10,
            }}
          >
            <Stack spacing={2}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontWeight={600}>User Info</Typography>
                <Close onClick={() => setOpenModal(false)} sx={{ cursor: "pointer" }} />
              </Box>

              <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                  <Stack>
                    <Typography fontSize={14}>{selectedUser?.users.firstName + selectedUser?.users.lastName}</Typography>
                    <Typography fontSize={14}>{selectedUser?.users.country}</Typography>
                    <Typography fontSize={14}>{selectedUser?.users.email}</Typography>
                    <Typography fontSize={14}>{selectedUser?.users.phone}</Typography>
                  </Stack>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Stack>
                    <Typography fontSize={14}>No of Orders</Typography>
                    <Typography fontSize={14}>{selectedUser?.users.orders}</Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Stack spacing={2}>
                <Typography fontSize={14}>Last {selectedUser?.lastOrders.length} orders</Typography>
              </Stack>

              {
                selectedUser?.lastOrders.map((order, index) => {
                  return (
                    <Stack direction={"row"} spacing={2} key={index} sx={{ marginTop: 5, alignItems: "center" }}>
                      <Image
                        width={50}
                        height={50}
                        style={{ marginTop: 30, width: "100%", height: "100%" }}
                        placeholder="blur"
                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                        src={order.productId?.photo[0]}
                        alt={"image of Happy"}
                      />
                      <Stack>
                        <Typography fontSize={12}>ID: {order.productId?._id}</Typography>
                        <Typography fontSize={12}>{order.productId?.title}</Typography>
                      </Stack>
                      <a target="_blank" rel="terms_link" href={`/product/${slug(order.productId?.title)}-${order.productId?._id}`}>
                        <OpenInNew />
                      </a>
                    </Stack>
                  )
                })
              }
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default UserTable;
