import React, {useEffect, useState} from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Button, Card, CircularProgress, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Message from "../Utils/Message";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Index";
import { CHAT_TYPE } from "../../Helpers/socket";
import { updateChatRooms } from "../../Store/ChatRoom";
import Cookies from "js-cookie";
import Image from 'next/image';
// import { getChatRooms } from "../Utils/InitSocket";

const Messages: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [normalChatRooms, setNormalChatRooms] = useState([])

  const { chatRooms } = useSelector((state: RootState) => state.ChatRoom);
  const [isLoadingChat, setIsLoadingChat] = useState(true)

  useEffect(() => {
    dispatch(updateChatRooms([]));
    if(Cookies.get('userInfo')){
      const userInfo = JSON.parse(Cookies.get('userInfo'))
      // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      userInfo && getChatRooms({url: `buyerChatRoom?buyerId=${userInfo?._id}`})
    }else{
      router.push("/")
    }
  }, [])

  const getChatRooms = async ({url = '', buyerId = null, sellerId = null, isAdminLoggedIn = false}) => {

    const response = await axios.get(`${baseUrl}/${url}`);
    if(response.status === 200) {

        dispatch(updateChatRooms(response.data))
        setIsLoadingChat(false)
    }
}

  useEffect(() => {
    const rooms = chatRooms.map(({ roomName }) => roomName);
    const filteredRooms = chatRooms.filter(({ roomName }, index) =>
    !rooms.includes(roomName, index + 1));
    
    const filterChatRooms = filteredRooms.filter(chatRoom => chatRoom.type === CHAT_TYPE.NORMAL_CHAT)
    setNormalChatRooms(() => filterChatRooms)
  }, [chatRooms])

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px", minHeight: "calc(100vh - 307px)" }}>
        <Wrapper title={t("pagetitle.Messages")} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography
                  variant={"h5"}
                  fontSize={15}
                  textAlign={"center"}
                >
                  {t("account.messages.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container component={"article"} maxWidth={"lg"}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  justifyContent: "center",
                }}
              >
                {isLoadingChat ? <CircularProgress sx={{ margin : '0 auto' }} /> :  <>
                  {normalChatRooms?.length === 0 ? 
                    <>
                      <Grid container spacing={2} height={ isMobile ? "calc(100vh - 160px)" : "calc(100vh - 363px)"}>
                        <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                          <Image
                            width={isMobile ? 250 : 350}
                            height={isMobile ? 250 : 350}
                            style={{ marginTop: 30, width: "100%", height: "100%" }}
                            placeholder="blur"
                            blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                            src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/ix9c4kduwp2avxbergry"}
                            alt={"image of Happy"}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} display={"flex"} alignItems={"center"} justifyContent={"center"} px={2}>
                          <Stack textAlign={"center"} gap={3}>
                            <Typography variant={"body1"}>
                              {t("account.messages.no_msg")}
                            </Typography>
                            <Button variant="contained" onClick={() => router.push('/')}>
                              No Messages
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>                    
                    </>
                :
                // normalChatRooms?.map((data, index) => (
                  <Message getChatRooms={getChatRooms} normalChatRooms={normalChatRooms} />
                // ))
              }
                </>}
                
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Messages;
