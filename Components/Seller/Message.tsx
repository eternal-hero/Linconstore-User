import React from "react";
import { Button, Card, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Index";
import socket, { CHAT_TYPE, SOCKET_CHANNELS, USER_ROLE } from "../../Helpers/socket";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { updateChatRooms } from "../../Store/ChatRoom";
import Cookies from "js-cookie";
// import { ChatRole, setCurrentChat } from "../../Store/chat";

const Message: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // const allMessages = useSelector((state: RootState) => state.chat.normalChat.fromBuyers);
  const allChatRooms = useSelector((state: RootState) => state.ChatRoom.chatRooms);
  // Removing duplicates from allChatRooms
  const rooms = allChatRooms.map(({ roomName }) => roomName);
  const filteredRooms = allChatRooms.filter(({ roomName }, index) =>
    !rooms.includes(roomName, index + 1));

  const normalChatRooms = filteredRooms.filter(chatRoom => chatRoom.type === CHAT_TYPE.NORMAL_CHAT)

  const joinChat = (chatRoom) => {
    const productDetail = {
      owner: chatRoom?.sellerId,
      id: chatRoom?.productId
    }
    localStorage.setItem('product_detail', JSON.stringify(productDetail))
    localStorage.setItem('currentChatRoomName', chatRoom.roomName)
    router.push('/chat')
  }

  const getChatRooms = async ({ url = '', buyerId = null, sellerId = null, isAdminLoggedIn = false }) => {

    const response = await axios.get(`${baseUrl}/${url}`);
    if (response.status === 200) {
      dispatch(updateChatRooms(response.data))
    }
  }
  const removeChat = async (e, chat) => {
    e.stopPropagation()
    const userInfo = JSON.parse(Cookies.get('userInfo'))
    const token = Cookies.get('token');
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token
      }
    }
    try {
      const resp = await axios.delete(`${baseUrl}/deleteChatRoom?roomId=${chat.roomName}&role=seller&sellerId=${chat?.sellerId}`, config)
      resp?.data?.acknowledged && getChatRooms({ url: `sellerChatRoom?sellerId=${userInfo.sellerId}` })
    } catch (error) {

    }
  }
  return (
    <>
      <Head>
        <title>{t("pagetitle.Message")}</title>
        <meta name={"Messages"} content={"These are Messages"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ bgcolor: "transparent", mt: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
        </Box>
        <Box display='flex' flexDirection='column'>
          {
            normalChatRooms.length === 0 ?
              (
                <Typography variant={"body1"} mt={3}>
                  No messages here
                </Typography>
              ) : (
                normalChatRooms.map((chatRoom) => (
                  <Button key={chatRoom.roomName} variant="outlined" onClick={() => joinChat(chatRoom)} className="seller-chatbox">
                    <Typography mt={2} mb={2} className="chatroom-card" >
                      <p className="user-name">{chatRoom?.buyerDetails?.firstName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography className="product-name" width={isMobile ? "100px" : "200px"}>{`${chatRoom?.productDetails?.title}`}</Typography>
                        <DeleteTwoToneIcon sx={{ color: 'black' }} onClick={e => removeChat(e, chatRoom)} />
                      </div>
                    </Typography>
                  </Button>
                ))
              )
          }
        </Box>
      </Card>
    </>
  );
};
export default Message;
