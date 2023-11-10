import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CircularProgress, Divider, List, ListItemButton, ListItemText, Stack, Typography, styled, useMediaQuery, Box } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { ArrowBack, Loop } from "@mui/icons-material";
import { useRouter } from "next/router";
import RefundTable from "../Utils/Admin/RefundTable";
import { useFetchRefunds, useAdminModifyRefund } from "../../hooks/useDataFetch";
import { CHAT_TYPE } from "../../Helpers/socket";
import { TRefunds } from "../../Helpers/Types";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import AdminChat from "../AdminChat/AdminChat";
import { getCurrencySymbol } from "../../Helpers/Exchange";

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Refund: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const router = useRouter();
  const [refunds, setRefunds] = useState<any[]>([])
  const [filterRefunds, setFilterRefunds] = useState<any[]>([])
  const [openChat, setOpenChat] = useState<boolean>(false)
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [adminChat, setAdminChat] = useState(null)
  const onSuccess = (data: TRefunds[]) => {
    setRefunds(data)
  }
  const searchFields = ['store', 'email', 'reason', 'productName', 'status']

  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterRefunds(refunds)
    } else {
      let filter = refunds;
      if (searchOption.field === searchFields[0]) {
        filter = refunds.filter(u => (u.storeId?.name).toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filter = refunds.filter(u => u.userId.email.toString().includes(searchOption.keyword))
      } else if (searchOption.field === searchFields[2]) {
        filter = refunds.filter(u => u.reason?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[3]) {
        filter = refunds.filter(u => u.reason?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else {
        filter = refunds.filter(u => u.status?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterRefunds(filter)
    }
  }, [searchOption, refunds])

  const { isFetched, isLoading, refetch } = useFetchRefunds(onSuccess);
  useTokenRefetch(refetch)

  const enterChat = (index: number) => {
    setSelectedChat(index)
    const refund: any = refunds[index];
    const roomName = `refund:${refund.productId.owner?.owner?._id}:${refund._id}`;
    setAdminChat({ roomName: roomName, buyerInfo: refund.userId._id, type: CHAT_TYPE.REFUND_CHAT })
  }

  const handleResovle = (index: number) => {
    const refund: any = refunds[index];
    if (refund.status == "RF-initiated") {
      updateRefund({ id: refund._id, status: "resolved" })
      setSelectedChat(index)
    }
  }

  const onRefundSuccess = () => {

  }
  const { isLoading: isUpdating, mutate: updateRefund } = useAdminModifyRefund(onRefundSuccess)

  return (
    <>
      {
        !openChat && (
          <>
            <Header
              title="Refund"
              searchFields={searchFields}
              totalAmount={refunds.length}
              searchOption={searchOption}
              setSearchOption={setSearchOption}
            />
            <Card elevation={0} sx={{ background: 'white', mt: 1, p: 2, minHeight: '90vh' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {isMobile && <ArrowBack onClick={() => router.back()} className={'pointer'} />}
              </Box>

              <Box>
                {isLoading && <Typography textAlign={'center'}> {<CircularProgress />}</Typography>}
                {isFetched && filterRefunds.length === 0 && <Typography textAlign={'center'}>Such Empty !</Typography>}
                {isFetched && filterRefunds.length > 0 &&
                  <RefundTable refunds={filterRefunds} setOpenChat={setOpenChat} refetch={refetch} />
                }
              </Box>
            </Card>
          </>
        )
      }
      {
        openChat && (
          <Card elevation={0} sx={{ background: 'transparent', mt: 1, p: 2, height: 'calc(100vh - 88px)' }}>
            <Stack spacing={2} direction={"row"} my={2}>
              <ArrowBack onClick={() => setOpenChat(false)} />
              <Typography>Back to refund</Typography>
            </Stack>
            <Stack direction={"row"} gap={2} sx={{ height: "calc(100% - 50px)" }}>
              <Drawer variant="permanent" open sx={{ height: "100%" }}>
                <Divider />
                <List component="nav">
                  {refunds.map((item: any, index) => (
                    <ListItemButton
                      selected={index === selectedChat}
                      key={index}
                      sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
                    >
                      <div onClick={() => enterChat(index)}>
                        <ListItemText primary={item?.productId?.owner.owner.owner.firstName + " " + item?.productId?.owner.owner.owner.lastName} sx={{ "& span": { fontSize: 14 } }} />
                        <ListItemText primary={item?.userId?.firstName + " " + item?.userId?.lastName} sx={{ "& span": { fontSize: 14 } }} />
                      </div>
                      {index === selectedChat && item?.status === "RF-initiated" &&
                        <Loop onClick={() => handleResovle(index)} />
                      }
                    </ListItemButton>
                  ))}
                </List>
              </Drawer>

              <Stack height={"100%"} width={"100%"}>
                {selectedChat !== null && <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <Image
                    width={50}
                    height={50}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={refunds[selectedChat]?.productId.photo[0]}
                    alt={"Product Image"}
                  />
                  <Box sx={{ ml: "16px" }}>
                    {refunds[selectedChat]?.productId.title}
                    <Box> {getCurrencySymbol(refunds[selectedChat]?.productId.owner.currency)} {refunds[selectedChat]?.productId.price} </Box>
                  </Box>
                </Box>
                }

                <AdminChat isBroadCast={false} handleBroadCast={(message) => { }} adminChat={adminChat} />

              </Stack>

            </Stack>
          </Card>
        )
      }
    </>
  )
}
export default Refund;