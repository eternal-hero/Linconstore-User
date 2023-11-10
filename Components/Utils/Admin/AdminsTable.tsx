import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addAdminModalOpen, deleteModalOpen } from "../../../Store/Modal";
import { mutateAdmin, regionList, sectionList } from "../../Admin/Admins";
import { useGetAdminVerifyCode } from "../../../hooks/useDataFetch";
import Cookies from "js-cookie";
import ListItemIcon from "@mui/material/ListItemIcon";
import { getLangPlusCountryCode } from "../../../Helpers/utils";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import ListItemText from "@mui/material/ListItemText";

interface IAdmins {
  admins: mutateAdmin[];
  handleRefetch: () => void;
}
const VerificationTable: React.FC<IAdmins> = ({ admins, handleRefetch }) => {
  const { i18n, t } = useTranslation();
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

  const handleDeleteAdmin = (row: any) => {
    const adminInfo = JSON.parse(Cookies.get("adminInfo"));
    verifyDeleteAdmin({ id: adminInfo._id, user: row })
  }

  const onDeleVerifyCodeSuccess = (user: any) => {
    dispatch(deleteModalOpen({ id: user, type: false }))
  };

  const handleEditAdmin = (row: any) => {
    const adminInfo = JSON.parse(Cookies.get("adminInfo"));
    verifyEditAdmin({ id: adminInfo._id, user: row })
  }

  const onEditVerifyCodeSuccess = (user: any) => {
    dispatch(addAdminModalOpen({ id: user._id }));
  };

  const { mutate: verifyDeleteAdmin, error: verifyDelError, isLoading: initDelLoading, } = useGetAdminVerifyCode(onDeleVerifyCodeSuccess);
  const { mutate: verifyEditAdmin, error: verifyEditError, isLoading: initEditLoading, } = useGetAdminVerifyCode(onEditVerifyCodeSuccess);

  return (
    <>
      <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Section</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Password</TableCell>
              <TableCell align="left">Language</TableCell>
              <TableCell align="left">Region</TableCell>
              <TableCell align="left">Edit</TableCell>
              <TableCell align="left">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => {
                const langPlusCountryCode = getLangPlusCountryCode({ code: row.language ?? "" });
                return <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{sectionList.filter((section) => section.value == row.section)[0]?.label}</TableCell>
                  <TableCell align="left"> {row.email} </TableCell>
                  <TableCell align="left"> xxxxxxxxxxx </TableCell>
                  <TableCell align="left">
                    {row.language && <div style={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon sx={{ maxHeight: "20px" }}>
                        <Flag code={row.language}></Flag>
                      </ListItemIcon>
                      <ListItemText sx={{ ml: 1, '& span': { fontSize: 14 } }}>
                        <b>{t(`language.${langPlusCountryCode}`)}</b>
                      </ListItemText>
                    </div>}
                  </TableCell>
                  <TableCell align="left">{regionList.filter((section) => section.value == row.region)[0]?.label}</TableCell>
                  <TableCell align="left">
                    <Button
                      startIcon={<Edit />}
                      onClick={() => handleEditAdmin(row)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      color="error"
                      startIcon={
                        <DeleteOutline />
                      }
                      onClick={() => handleDeleteAdmin(row)}
                    />
                  </TableCell>
                </TableRow>
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={admins.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default VerificationTable;
