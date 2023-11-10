import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { contactReplyDefaultValue } from "../../../Helpers/Types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../../TextInput";
import * as yup from "yup";
import { Box, Button, Grid, Modal, Stack, Typography, useMediaQuery } from "@mui/material";
import { reCreateDate, getHourMinute } from "../../../Helpers/getDate";
import { useDeleteContact, useReplyContact } from "../../../hooks/useDataFetch";
import { Close, Drafts, Reply, DeleteOutline, TextFields, Send } from "@mui/icons-material";

interface ITickets {
  tickets: any; //TODO need to update type
  handleRefetch: () => void;
}

const schema = yup.object().shape({
  title: yup.string().required().min(4),
  message: yup.string().required("This is required").min(4),
});

const TicketTable: React.FC<ITickets> = ({ tickets, handleRefetch }) => {
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


  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);  //TODO need to update type
  const [openReplyModal, setOpenReplyModal] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPad = useMediaQuery("(max-width: 900px)");

  const onDeleteSuccess = () => {
    setOpenModal(false);
    setSelectedTicket(null);
    handleRefetch();
  };
  const { isLoading, mutate: deleteContact } = useDeleteContact(onDeleteSuccess);


  const { handleSubmit, control, getValues, reset } = useForm<contactReplyDefaultValue>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<contactReplyDefaultValue> = async (data) => {
    const contact = {
      ...data,
      contactId: selectedTicket?._id
    };
    contactReply(contact);
  };

  const onReplySuccess = () => {
    reset();
    setOpenReplyModal(false);
    handleRefetch();
    setSelectedTicket(null);
  };

  const {
    isLoading: isReplyLoading,
    isError,
    error,
    mutate: contactReply,
  } = useReplyContact(onReplySuccess);

  return (
    <>
      <Typography variant={"h6"} my={2}>
        {" "}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Mobile No</TableCell>
              {/* <TableCell align="center">Message</TableCell> */}
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row._id}
                  </TableCell>
                  <TableCell align="center"> {row.name} </TableCell>
                  <TableCell align="center"> {row.email}</TableCell>
                  <TableCell align="center"> {row.phone} </TableCell>
                  <TableCell align="center" >{row.createdAt && reCreateDate(row.createdAt)}</TableCell>
                  <TableCell align="center" >{row.createdAt && getHourMinute(row.createdAt)}</TableCell>
                  <TableCell align="center" sx={{ display: "flex", gap: 1, justifyContent: "center" }} >
                    <Drafts sx={{ color: "var(--primary)", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedTicket(row)
                        setOpenModal(true)
                      }} />
                    <Reply sx={{ color: "var(--primary)", cursor: "pointer" }}
                      onClick={() => {
                        setSelectedTicket(row)
                        setOpenReplyModal(true)
                      }} />
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


      <Modal
        open={openModal}
        onClose={() => { setOpenModal(false); setSelectedTicket(null); }}
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
              <Box display={"flex"} justifyContent={"end"}>
                <Close onClick={() => setOpenModal(false)} sx={{ cursor: "pointer" }} />
              </Box>

              <Stack direction={isMobile ? "column" : "row"} gap={2}>
                <Stack gap={1}>
                  <Typography fontSize={14}>Ticket ID: {selectedTicket?._id}</Typography>
                  <Typography fontSize={14}>Name: {selectedTicket?.name}</Typography>
                  <Typography fontSize={14}>Email: {selectedTicket?.email}</Typography>
                </Stack>
                <Stack gap={1}>
                  <Typography fontSize={14}>Phone: +{selectedTicket?.phone}</Typography>
                  <Typography fontSize={14}>Date: {selectedTicket?.createdAt && reCreateDate(selectedTicket.createdAt) + "," + getHourMinute(selectedTicket.createdAt)}</Typography>
                </Stack>
              </Stack>

              <Typography fontSize={14} sx={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)", padding: "10px", borderRadius: "8px" }}>{selectedTicket?.message}</Typography>

              <Box display={"flex"} p={1} justifyContent={'start'}>
                <Button size="small" disabled={isLoading} sx={{ color: "gray" }} startIcon={<DeleteOutline color="error" />} onClick={() => deleteContact({ id: selectedTicket?._id })}>
                  Delete
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openReplyModal}
        onClose={() => { setOpenReplyModal(false); setSelectedTicket(null); }}
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
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
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
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Stack spacing={2}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography fontWeight={600}>Reply</Typography>
                <Close onClick={() => setOpenReplyModal(false)} sx={{ cursor: "pointer" }} />
              </Box>

              <Stack direction={"column"} gap={2}>
                <Stack gap={1} direction={"row"}>
                  <Typography fontSize={14}>Ticket ID</Typography>
                  <Typography fontSize={14}>{selectedTicket?._id}</Typography>
                </Stack>
                <Typography fontSize={14} mr={4}>Name: {selectedTicket?.name}</Typography>
                <Typography fontSize={14}>Reply To: {selectedTicket?.email}</Typography>
              </Stack>

            </Stack>

            <Controller
              name="title"
              control={control}
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.title}
                  field={field}
                  variant="outlined"
                  id="Title"
                />
              )}
            />

            <Controller
              name="message"
              control={control}
              render={({ field, formState: { errors } }) => (
                <TextInput
                  data={errors?.message}
                  field={field}
                  variant="outlined"
                  multiple={true}
                  id="Message"
                />
              )}
            />

            <Button disabled={isReplyLoading} size="small" variant="outlined" endIcon={<Send />} type={"submit"}>
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default TicketTable;
