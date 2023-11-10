import React, { useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Grid, Modal, Stack, Switch, Typography, useMediaQuery } from "@mui/material";
import { numberWithCommas } from "../../../Helpers/utils";
import { Close, DeleteOutlined, Layers, OpenInNew } from "@mui/icons-material";
import { TAdminSeller } from "../../../Helpers/Types";
import {
  useDeleteAdminSeller,
  useUpdateAdminSellers,
} from "../../../hooks/useDataFetch";
import { useDispatch } from "react-redux";
import { deleteModalOpen } from "../../../Store/Modal";
import { ExchangeCurrency } from "../../../Helpers/Exchange";
import Image from "next/image";
import slug from "slug";

interface IAdminSeller1 {
  store: TAdminSeller,
  length: number,
  lastProducts: any,
}
interface IAdminSeller {
  sellers: IAdminSeller1[];
  handleRefetch: () => void;
}
const SellersTable: React.FC<IAdminSeller> = ({ sellers, handleRefetch }) => {
  const handleUpdate = (id: string) => {
    const data = {
      id,
    };
    updateSeller(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };
  const dispatch = useDispatch();
  const handleDelete = (id: any) => {
    dispatch(deleteModalOpen({ id, type: true }));
  };
  const [selectedSeller, setSelectedSeller] = useState<IAdminSeller1 | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPad = useMediaQuery("(max-width: 900px)");

  const handleOpenModal = (store: TAdminSeller, lastProducts: any, length: number) => {
    setSelectedSeller({ store, lastProducts, length })
    setOpenModal(true)
  }

  const getCurrency = useCallback((label: string) => {
    const currency = ExchangeCurrency.find((x) => x.value === label);
    return currency?.symbol;
  }, []);
  const { mutate: updateSeller } = useUpdateAdminSellers(onSuccess);
  const { mutate: deleteAdmin } = useDeleteAdminSeller(onSuccess);

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
              <TableCell>Store Name</TableCell>
              <TableCell align="left">Store Email</TableCell>
              <TableCell align="left">Phone No</TableCell>
              <TableCell align="left">Country</TableCell>
              <TableCell align="left">Plan</TableCell>
              <TableCell align="left">Store balance</TableCell>
              {/* <TableCell align="right">Status</TableCell> */}
              <TableCell align="right">Listing</TableCell>
              {/* <TableCell align="right">Delete</TableCell> */}
              <TableCell align="right">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map(({ length, store, lastProducts }, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {store.name}
                  </TableCell>
                  <TableCell align="left"> {store.owner.owner?.email} </TableCell>
                  <TableCell align="left"> {store.owner.owner?.phone} </TableCell>
                  <TableCell align="left"> {store.owner.owner?.country} </TableCell>
                  <TableCell align="left"> {store.owner.package} </TableCell>
                  <TableCell align="left">
                    {getCurrency(store.currency)}
                    {numberWithCommas(store.balance)}
                  </TableCell>
                  {/* <TableCell align="right">
                    <Switch
                      checked={store.isVerified}
                      onChange={() => handleUpdate(store._id)}
                    />
                  </TableCell> */}
                  <TableCell align="right"> {length} </TableCell>
                  {/* <TableCell align="right">
                    <DeleteOutlined
                      onClick={() => handleDelete(store)}
                      color="error"
                      className={"pointer"}
                    />
                  </TableCell> */}
                  <TableCell align="right">
                    <Layers
                      onClick={() => handleOpenModal(store, lastProducts, length)}
                      className={"pointer"}
                      sx={{ color: "var(--primary)" }}
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
        count={sellers.length}
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
            <Box display={"flex"} justifyContent={"end"}>
              <Close onClick={() => setOpenModal(false)} sx={{ cursor: "pointer" }} />
            </Box>

            <Grid container mb={2}>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography fontSize={14} fontWeight={600}>Seller Info</Typography>
                  <Stack>
                    <Typography fontSize={14}>{selectedSeller?.store.owner.owner.firstName + " " + selectedSeller?.store.owner.owner.lastName}</Typography>
                    <Typography fontSize={14}>{selectedSeller?.store.owner.owner.country}</Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography fontSize={14} fontWeight={600}>Account Type</Typography>
                  <Typography fontSize={14}>{selectedSeller?.store.account}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography fontSize={14}>{selectedSeller?.store.owner.owner.email}</Typography>
                  <Typography fontSize={14}>{selectedSeller?.store.owner.owner.phone}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <Typography fontSize={14} fontWeight={600}>Store Balance</Typography>
                  <Typography fontSize={14}>{getCurrency(selectedSeller?.store.currency) + " " + selectedSeller?.store.balance.toFixed(2)}</Typography>
                </Stack>
              </Grid>
            </Grid>

            <Stack spacing={2}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography fontSize={14} fontWeight={600}>Last {selectedSeller?.lastProducts.length} orders</Typography>
              </Stack>
              <Box sx={{ overflowY: "scroll" }} height={160}>
                {selectedSeller?.lastProducts.map((product, index) => {
                  return (
                    <Stack direction={"row"} spacing={2} key={index} sx={{ marginTop: 5, alignItems:"center"}}>
                      <Image
                        width={50}
                        height={50}
                        style={{ marginTop: 30, width: "100%", height: "100%" }}
                        placeholder="blur"
                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                        src={product.photo[0]}
                        alt={"image of Happy"}
                      />
                      <Stack>
                        <Typography fontSize={12}>ID: {product._id}</Typography>
                        <Typography fontSize={12}>{product.title}</Typography>
                      </Stack>
                      <a target="_blank" rel="terms_link" href={`/product/${slug(product.title)}-${product._id}`}>
                        <OpenInNew />
                      </a>
                    </Stack>
                  )
                })}
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default SellersTable;
