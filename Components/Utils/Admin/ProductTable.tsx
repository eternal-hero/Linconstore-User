import React, { useCallback, useContext, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { IAdminProducts } from "../../../Helpers/Types";
import { useRouter } from "next/router";
import {
  useDeleteAdminProduct,
  useUpdateAdminProducts,
  useGetAllCategories,
} from "../../../hooks/useDataFetch";
import ContextApi from "../../../Store/context/ContextApi";
import { useCurrency } from "../../../hooks/useCurrency";
import ProductRow from "./ProductRow";

interface IProducts {
  products: IAdminProducts[];
  handleRefetch: () => void;
}
const ProductTable: React.FC<IProducts> = ({ products, handleRefetch }) => {
  const handleChange = (id: string) => {
    const data = {
      id,
    };
    updateProduct(data);
  };
  const onSuccess = () => {
    handleRefetch();
  };

  const onCategorySuccess = () => { };
  const { data, isLoading: loading } = useGetAllCategories(onCategorySuccess);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) return;
    data?.map((value: any) => categories.push(value.title));
  }, [loading]);

  const currency = useCurrency();
  const { mutate: updateProduct } = useUpdateAdminProducts(onSuccess);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>("");
  const [currentId, setCurrentId] = useState<string>("");
  const handleDeleteProduct = useCallback((id: string) => {
    setCurrentId(id);
    const data = { id };
    deleteProduct(data);
  }, []);
  const onDeleteSuccess = () => {
    handleRefetch();
  };
  const { mutate: deleteProduct, isLoading: isDeleting } =
    useDeleteAdminProduct(onDeleteSuccess);

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
  const adminRate: number = useContext(ContextApi).adminRate;

  return (
    <>
      <Typography variant={"h6"} my={2}></Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "white" }}>
        <Table sx={{ minWidth: 350 }} aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Store</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Sub Category</TableCell>
              <TableCell align="center">{isEditing ? "Save" : "Edit"} </TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">View</TableCell>
              <TableCell align="right">Published</TableCell>
              {/* <TableCell align="right">Delete</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <ProductRow key={index} row={row} handleChange={handleChange} isEditing={isEditing} setIsEditing={setIsEditing}
                editId={editId} setEditId={setEditId} categories={categories} data={data}/>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
export default ProductTable;
