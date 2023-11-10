import Head from "next/head";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Card,
  CircularProgress,
  SelectChangeEvent,
  Stack,
  Switch,
  IconButton,
  useMediaQuery,
  Menu,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ArrowBack, Download, ReceiptLong, BookmarkBorder, Upload, InsertLink } from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Image from "next/image";
import Checkbox from "@mui/material/Checkbox";
import AddProduct from "./AddProduct";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { addProductId, editModal } from "../../../Store/Modal";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
  useDeleteSellerProducts,
  useGeStoreProducts,
  useGetSellerInfo,
  useGetAllTemplates,
  useUpdateTemplate,
  useUpdateSellerProductActive,
} from "../../../hooks/useDataFetch";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTokenRefetch } from "../../../hooks/useRefresh";
import ContextApi from "../../../Store/context/ContextApi";
import AddTemplate from "./AddTemplate";
import DownloadComponent from '../../Download';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Cookies from "js-cookie";

let isFirst = false;
function createData(
  photos: string,
  product: string,
  category: string,
  stock: number,
  checked: boolean
) {
  return { photos, product, category, stock, checked };
}

interface IStore {
  location: string;
  isVerified: boolean;
}
interface IModal {
  modal: {
    modal: boolean;
  };
}
const PostItem: React.JSXElementConstructor<any> = () => {
  const [search, setSearch] = React.useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [initialData, setInitialData] = useState([]);
  const [check, setCheck] = useState(false);
  const isChecked: boolean = initialData.some((data) => data.isActive);
  const allChecked: boolean = initialData.every((data) => data.isActive);
  const [stepper, setStepper] = useState(false);
  const [sort, setSort] = useState("Recent");
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);
  const [openTemplate, setOpenTemplate] = React.useState(false);
  const [selectedId, setId] = React.useState("");
  const [selectedTemp, setSelectedTemplate] = React.useState<any>(null);

  const handleSort = useCallback(
    (event: SelectChangeEvent) => {
      setSort(event.target.value as string);
      // const sorted = initialData.sort((a : any,b : any)  => sort ? b.product.localeCompare(a.product) :   a.product.localeCompare(b.product));
      // setInitialData(sorted)
    },
    [sort, initialData]
  );
  const onStoreSuccess = (data: any) => {
    const sorted = data.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    );

    setInitialData(sorted);
  };
  const isUpdatingProduct: boolean = useSelector(
    (state: IModal) => state.modal.modal
  );

  const { refetch, isFetching } = useGeStoreProducts(onStoreSuccess);
  useTokenRefetch(refetch);
  const handleChange = (_id: string) => {
    const data: any = initialData?.find((row) => row._id === _id);
    data.isActive = !data.isActive;
    const filteredData: any = initialData?.filter((row) => row._id !== _id);
    filteredData.push(data);
    const sorted = filteredData.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    );
    setInitialData(sorted);
  };
  const dispatch = useDispatch();
  const handleCheckAll = () => {
    setCheck((prevState) => !prevState);
    const newData: any = [];
    if (allChecked) {
      initialData.forEach((data) => {
        data.isActive = false;
        newData.push(data);
      });
    } else {
      initialData.forEach((data) => {
        data.isActive = true;
        newData.push(data);
      });
    }
  };
  const onDeleteHandler = (id: string, orders: number, quantity: number) => {
    if (orders > 0) return;
    if (quantity === 0) return;
    // const filter = initialData.filter((row) => row.isActive);
    // filter.forEach((row) => {
    //   deleteIds.push(row._id);
    // });
    setId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNext = () => {
    const deleteIds: string[] = [];
    deleteIds.push(selectedId);
    const data = {
      ids: deleteIds,
    };
    deleteProduct(data);
    setOpen(false);
  };
  const onDeleteSuccess = () => {
    refetch();
  };
  const { mutate: deleteProduct, isLoading: isDeleting } =
    useDeleteSellerProducts(onDeleteSuccess);
  useEffect(() => {
    const timeout = setTimeout(() => {
      isFirst = true;
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (isFirst) {
      refetch();
    }
  }, [isUpdatingProduct]);
  const updateProduct = (id: string) => {
    const data = {
      id,
    };
    // @ts-ignore
    dispatch(addProductId(data));
    dispatch(editModal());
  };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const onStatusSuccess = () => {
    refetch();
  };
  const [currentId, setCurrentId] = useState<string>("");
  const handleChangeStatus = (id: string) => {
    const data = {
      id,
    };
    setCurrentId(id);
    updateStatus(data);
  };
  const [location, setLocation] = useState<string>("");
  const onSuccess = (data: IStore) => {
    if (data.isVerified) {
      setLocation(data.location);
    }
  };
  const handleRefetch = useCallback(() => {
    refetch();
  }, [isUpdatingProduct]);

  const { refetch: refresh } = useGetSellerInfo(onSuccess);
  useTokenRefetch(refresh);
  const { mutate: updateStatus, isLoading: isUpdating } =
    useUpdateSellerProductActive(onStatusSuccess);

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
  const sellerIsActive = useContext(ContextApi).sellerIsActive;

  interface DownloadCheckedState {
    inStock: boolean;
    outOfStock: boolean;
  }

  const [openDownloadAnchorEl, setOpenDownloadAnchorEl] = useState<null | HTMLElement>(null);
  const [downloadOrders, setDownloadOrders] = useState([]);
  const [downloadChecked, setDownloadChecked] = React.useState<DownloadCheckedState>({ inStock: false, outOfStock: false });

  const handleDownloadModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenDownloadAnchorEl(e.currentTarget);
  }

  const handleClickDownload = () => {
    if (downloadOrders.length > 0) {
      const userString = Cookies.get("userInfo");
      const userInfo = JSON.parse(userString);
      const input = document.getElementById("divToPrint");
      html2canvas(input, {
        onclone: function (clonedDoc) {
          clonedDoc.getElementById('divToPrint').style.display = 'block';
        }
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "JPEG", 10, 20, 180, 0);
        pdf.save(`${userInfo.firstName ?? "Seller"}-${userInfo.lastName ?? "name"}.pdf`);
      });
    } else {
      alert("There are no products to download.");
    }
  }

  const handleCloseDownload = () => {
    setOpenDownloadAnchorEl(null);
  }

  const handleDownloadCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadChecked({ ...downloadChecked, [e.target.name]: e.target.checked });
  }

  useEffect(() => {
    let selectedOrders = initialData
    if (downloadChecked.inStock && !downloadChecked.outOfStock) {
      selectedOrders = initialData?.filter((row) => row.quantity > 0);
    } else if (!downloadChecked.inStock && downloadChecked.outOfStock) {
      selectedOrders = initialData?.filter((row) => row.quantity == 0);
    }
    setDownloadOrders(selectedOrders)
  }, [downloadChecked, initialData]);

  enum BulkUploadCheckedState {
    CSV = 'CSV',
    Excel = 'Excel'
  }

  const [openBulkUploadAnchorEl, setOpenBulkUploadAnchorEl] = useState<null | HTMLElement>(null);
  const [bulkUploadChecked, setBulkUploadChecked] = React.useState<string>(BulkUploadCheckedState.CSV);

  const handleClickBulkUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenBulkUploadAnchorEl(e.currentTarget);
  }

  const handleCloseBulkUpload = () => {
    setOpenBulkUploadAnchorEl(null);
  }

  const handleBulkUploadCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkUploadChecked(e.target.value);
  }

  const [openCreateTemplateAnchorEl, setOpenCreateTemplateAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickCreateTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenCreateTemplateAnchorEl(e.currentTarget);
  }

  const handleCloseCreateTemplate = () => {
    setOpenCreateTemplateAnchorEl(null);
  }

  const onTemplateSuccess = () => { };
  const { data, refetch: refetchTemp, isLoading: loading } = useGetAllTemplates(onTemplateSuccess);

  const onDeleteTempSuccess = () => {
    refetchTemp();
  };
  const { mutate: deleteTemplate, isLoading } = useUpdateTemplate(onDeleteTempSuccess);
  const onDeleteTemplateHandler = (id: string) => {
    deleteTemplate({ id, data: { active: false } });
    handleCloseCreateTemplate()
  }

  return (
    <>
      <Head>
        <title>{t("pagetitle.Add_Product")}</title>
        <meta name={"Add Product"} content={"These are Add Product"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
        {!stepper && !openTemplate && (
          <Stack>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              {isMobile && (
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
              )}
              <>
                <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadModal} sx={{ textTransform: "capitalize", fontSize: 12 }}>
                  {t("seller.post.btn_download")}
                </Button>
                <Menu
                  anchorEl={openDownloadAnchorEl}
                  keepMounted
                  open={Boolean(openDownloadAnchorEl)}
                  onClose={handleCloseDownload}
                >
                  <MenuItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={downloadChecked.inStock}
                          onChange={handleDownloadCheckChange}
                          name="inStock"
                          color="primary"
                        />
                      }
                      label={t("seller.post.In_Stock")}
                    />
                  </MenuItem>
                  <MenuItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={downloadChecked.outOfStock}
                          onChange={handleDownloadCheckChange}
                          name="outOfStock"
                          color="primary"
                        />
                      }
                      label={t("seller.post.Out_of_Stock")}
                    />
                  </MenuItem>
                  <MenuItem disabled={!downloadChecked.outOfStock && !downloadChecked.inStock} sx={{ justifyContent: "end", gap: 1 }} onClick={handleClickDownload}>
                    <Typography>{t("seller.post.btn_download")}</Typography>
                    <Download />
                  </MenuItem>
                </Menu>

              </>
              <Box display={"flex"} gap={1}>
                {
                  !isMobile && (
                    <>
                      <Button variant="outlined" startIcon={<ReceiptLong />} onClick={handleClickBulkUpload} sx={{ textTransform: "capitalize", fontSize: 12 }}>
                        {t("seller.post.btn_bulk_upload")}
                      </Button>
                      <Menu
                        anchorEl={openBulkUploadAnchorEl}
                        keepMounted
                        open={Boolean(openBulkUploadAnchorEl)}
                        onClose={handleCloseBulkUpload}
                      >
                        <MenuItem>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={bulkUploadChecked === BulkUploadCheckedState.CSV}
                                onChange={handleBulkUploadCheckChange}
                                value={BulkUploadCheckedState.CSV}
                                color="primary"
                              />
                            }
                            label="CSV"
                          />
                        </MenuItem>
                        <MenuItem>
                          <FormControlLabel
                            control={
                              <Radio
                                checked={bulkUploadChecked === BulkUploadCheckedState.Excel}
                                onChange={handleBulkUploadCheckChange}
                                value={BulkUploadCheckedState.Excel}
                                color="primary"
                              />
                            }
                            label="Excel"
                          />
                        </MenuItem>
                        <MenuItem sx={{ justifyContent: "end", gap: 1 }} onClick={() => setOpenUpload(true)} >
                          <Typography>{t("seller.post.upload")}</Typography>
                          <Upload />
                        </MenuItem>
                      </Menu>
                      <Button variant="outlined" startIcon={<BookmarkBorder />} onClick={handleClickCreateTemplate} sx={{ textTransform: "capitalize", fontSize: 12 }}>
                        {t("seller.post.btn_create_template")}
                      </Button>
                      <Menu
                        anchorEl={openCreateTemplateAnchorEl}
                        keepMounted
                        open={Boolean(openCreateTemplateAnchorEl)}
                        onClose={handleCloseCreateTemplate}
                      >
                        <MenuItem onClick={() => {
                          setSelectedTemplate(null)
                          setOpenTemplate(true)
                          handleCloseCreateTemplate()
                        }} sx={{ display: "flex", justifyContent: 'center' }}>
                          <Box display={"flex"} alignItems={"center"}>
                            <Typography sx={{ mr: "16px" }}>{t("seller.post.Add_new")}</Typography>
                          </Box>
                        </MenuItem>
                        {data?.map((item, index) => {
                          return (
                            <Box sx={{ m: "0  16px" }} display={"flex"} justifyContent={"space-around"} alignItems={"center"} key={index}>
                              <Delete sx={{ color: "red", cursor: "pointer" }}
                                onClick={() => onDeleteTemplateHandler(item._id)} />
                              <Typography onClick={() => {
                                setStepper(true)
                                setSelectedTemplate(item)
                                handleCloseCreateTemplate()
                              }} sx={{ m: "0  16px", cursor: "pointer" }}>{t(item.template_title)}</Typography>
                              <Edit onClick={() => {
                                setSelectedTemplate(item)
                                setOpenTemplate(true)
                                handleCloseCreateTemplate()
                              }}
                                sx={{ color: "var(--primary)", cursor: "pointer" }} />
                            </Box>
                          )
                        })}
                      </Menu>
                    </>
                  )
                }
                <Button
                  disabled={!sellerIsActive}
                  variant={"contained"}
                  className={"color"}
                  onClick={() => setStepper(true)}
                  sx={{ textTransform: "capitalize", fontSize: 12 }}
                >
                  {t("seller.post.btn_add")}
                </Button>
              </Box>
            </Box>
            {initialData.length > 0 && (
              <Paper sx={{ width: "100%" }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 350 }}
                    size={"small"}
                    aria-label="stats table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">
                          {t("seller.post.data_field.image")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.product")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.category")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.sub_category")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.stock")}
                        </TableCell>
                        <TableCell align="left">
                          {t("seller.post.data_field.status")}
                        </TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {initialData
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        ?.map((row: any, index: number) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="left">
                              <Image
                                src={row.photo[0]}
                                width={"63px"}
                                height={"46px"}
                                placeholder={"blur"}
                                blurDataURL={row.photo[0]}
                                alt={"icon of menue"}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: "250px",
                                minWidth: "250px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.title}
                            </TableCell>
                            <TableCell align="left">
                              {t(`maincategory.${row.category.title}`)}
                            </TableCell>
                            <TableCell align="left">
                              {t(`subcategory.${row.category.title}.${row.subcategory.replace(row.category.title + ".", "")}`)}
                            </TableCell>
                            <TableCell align="left">{row.quantity}</TableCell>
                            <TableCell align="left">
                              {isUpdating && currentId === row._id && (
                                <CircularProgress />
                              )}
                              <Switch
                                disabled={!sellerIsActive || !row.publish}
                                checked={row.active && row.quantity > 0}
                                onChange={() => handleChangeStatus(row._id)}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                display: "flex",
                                width: "100%",
                                gap: "10px",
                              }}
                            >
                              <Button
                                onClick={() => updateProduct(row._id)}
                                disabled={!sellerIsActive || !row.publish}
                                variant={"outlined"}
                                sx={{ fontSize: 12 }}
                              >

                                {t("seller.post.btn_edit")}
                              </Button>

                              {/* {t("seller.post.btn_remove")} */}
                              <div
                                className="font-icon-wrapper"
                                onClick={() =>
                                  onDeleteHandler(
                                    row._id,
                                    row.orders,
                                    row.quantity
                                  )
                                }
                              >
                                <IconButton
                                  disabled={!sellerIsActive || row.orders > 0 || !row.publish}
                                  aria-label="delete"
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                              {/* {isDeleting && <CircularProgress />} */}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={initialData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </Stack>
        )}
        {stepper && (
          <AddProduct
            handleRefetch={handleRefetch}
            setStepper={setStepper}
            location={location}
            selectedTemp={selectedTemp}
          />
        )}
        {
          openTemplate && (
            <AddTemplate location={location} setOpenTemplate={setOpenTemplate} selectedTemp={selectedTemp} />
          )
        }
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("seller.post.confirm_modal.title")}
          </DialogTitle>
          <DialogContent>
            {" "}
            {t("seller.post.confirm_modal.content")}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {t("seller.post.confirm_modal.btn_cancel")}
            </Button>
            <Button onClick={handleNext} autoFocus>
              {t("seller.post.confirm_modal.btn_ok")}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openUpload}
          onClose={() => setOpenUpload(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {t("seller.post.upload_file", { fileformat: bulkUploadChecked })}
          </DialogTitle>
          <DialogContent>
            <Box px={20} py={10} bgcolor={"var(--green-haze-100)"} display={'flex'} justifyContent={"center"}>
              <InsertLink />
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between" }}>
            <Button sx={{ textTransform: "capitalize", fontWeight: 500 }}>
              {t("seller.post.view_format_example")}
            </Button>
            <Button variant="outlined" sx={{ textTransform: "capitalize" }}>
              <InsertLink />
              <Typography>{t("seller.post.import")}</Typography>
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      <Box id="divToPrint" className="mt4" sx={{ display: "none" }}>
        <DownloadComponent orders={downloadOrders} />
      </Box>
    </>
  );
};
export default React.memo(PostItem);
