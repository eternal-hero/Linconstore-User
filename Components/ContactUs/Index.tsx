import React, { useContext, useEffect, useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Avatar,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  SendOutlined,
  HighlightOffOutlined,
  SmsOutlined,
  Toll,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { contactUsDefaultValue } from "../../Helpers/Types";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../TextInput";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { createNewChatRoom, useCreateContact } from "../../hooks/useDataFetch";
import { useDispatch, useSelector } from "react-redux";
import { snackBarOpen } from "../../Store/Utils";
import { useTranslation } from "react-i18next";
import socket, { CHATROOM_STATUS, CHAT_TYPE, SOCKET_CHANNELS, USER_ROLE } from "../../Helpers/socket";
// import { ChatRole, buyerFinishAdminChat, buyerInitiateAdminChat, insertBuyerSideAdminChatMessage } from "../../Store/chat";
import { RootState } from "../../Store/Index";
import { getHourMinute } from "../../Helpers/getDate";
import { IChatRoom, setChatRole } from "../../Store/ChatRoom";
import { IMessage, insertNewMessage, updateMessages } from "../../Store/Message";
import ContextApi from "../../Store/context/ContextApi";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import ContentHeader from "../Utils/contentHeader";
import Cookies from "js-cookie";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required().min(4),
  message: yup.string().required("This is required").min(4),
  phone: yup.string().required("Must be a number").min(11),
});

const Contact: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const isLoggedIn = useContext(ContextApi).isLoggedIn;

  const [isClient, setIsClient] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [showCloseAdminChatConfirm, setShowCloseAdminChatConfirm] = useState<boolean>(false);
  const [isJoinedAdminChat, setIsJoinedAdminChat] = useState<boolean>(false);
  const [adminChatMessage, setAdminChatMessage] = useState<string>("");
  // @ts-ignore
  const { handleSubmit, control, getValues, reset } =
    useForm<contactUsDefaultValue>({
      resolver: yupResolver(schema),
      mode: "onBlur",
      defaultValues: {
        email: "",
        name: "",
        phone: "",
        message: "",
      },
    });
  const onSubmit: SubmitHandler<contactUsDefaultValue> = async (data) => {
    const contact = {
      ...data,
    };
    contactUs(contact);
  };
  const currentChat = useSelector((state: RootState) => state.ChatRoom.chatRooms).filter((chat) => chat?.type === CHAT_TYPE.ADMIN_CHAT && chat?.buyerId === userInfo?._id)[0];
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const onSuccess = () => {
    reset();
    dispatch(
      snackBarOpen({
        message: "message was successfully sent",
        severity: "success",
        snackbarOpen: true,
        rate: 0,
        sellerRate: 0,
      })
    );
  };
  const {
    isLoading,
    isError,
    error,
    mutate: contactUs,
  } = useCreateContact(onSuccess);
  const getUserInfoFromCookies = () => {
    const userInfoData = Cookies.get('userInfo');
    if (userInfoData) {
      return JSON.parse(userInfoData);
    }
    return null;
  };
  useEffect(() => {
    if (error instanceof Error) {
      // @ts-ignore
      setErrorMessage(error?.response.data?.status);
    }
  }, [isError]);

  useEffect(() => {
    setIsClient(true);

    if (isError) {
      dispatch(
        snackBarOpen({
          message: "something went wrong, please try again",
          severity: "error",
          snackbarOpen: true,
          rate: 0,
          sellerRate: 0,
        })
      );
    }

    userInfo && getChatMessages()
  }, []);

  const getChatMessages = async () => {
    const token = Cookies.get('token');
    // const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: token
      }
    }
    try {
      const resp = await axios.get(`${baseUrl}/buyerChatRoomForAdmin?roomName=${currentChat ? currentChat?.roomName : `adminChat:${userInfo._id}`}`, config)
      if (resp?.data?.length) {
        dispatch(updateMessages(resp?.data));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isMatches = useMediaQuery("(max-width: 700px)");
  let userInfo;
  if (typeof window !== 'undefined') {
    userInfo = getUserInfoFromCookies();
    // userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }

  // const messageItems = useSelector((state: RootState) => state.adminChat.buyerSideAdminChatMessage);
  const messages = useSelector((state: RootState) => state.Message.messages);
  const { chatRooms, chatRole } = useSelector((state: RootState) => state.ChatRoom);

  // useEffect(() => {
  //   if(currentChat) {
  //     setIsJoinedAdminChat(true)
  //   } else {
  //     setIsJoinedAdminChat(false);
  //   }
  // }, [currentChat])

  useEffect(() => {
    isChatOpen && handleChatBoxClick()
  }, [isChatOpen])


  const handleChatBoxClick = async () => {

    // if(!isLoggedIn) {

    // } else {

    const userName = userInfo?.firstName + ' ' + userInfo?.lastName
    // if(!isJoinedAdminChat) {
    //   socket.emit(SOCKET_CHANNELS.JOIN_ADMIN_CHAT, {buyerInfo: userInfo, isAdmin: false})
    //   dispatch(buyerInitiateAdminChat());
    // }
    const chatRoom: IChatRoom = {
      roomName: `adminChat:${userInfo._id}`,
      userName,
      type: CHAT_TYPE.ADMIN_CHAT,
      isAdminJoined: false,
      status: CHATROOM_STATUS.OPENED,
      buyerId: userInfo?._id,
    }
    const result = await createNewChatRoom(chatRoom)(dispatch)
    if (result === 201 || result === 200) {
      const userInfo = JSON.parse(Cookies.get("userInfo"));
      // const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const selectedRole = userInfo.role === 'user' ? USER_ROLE.BUYER :
        userInfo.role === 'seller' ? USER_ROLE.SELLER : USER_ROLE.ADMIN;

      dispatch(setChatRole(selectedRole))
      socket.emit(SOCKET_CHANNELS.JOIN_CHAT, chatRoom.roomName)
      // setShowCloseAdminChatConfirm(false)
      // setIsJoinedAdminChat(joined => !joined)
    } else {
      alert('Error while creating new chat')
    }
    // } else {
    //   setIsJoinedAdminChat(joined => !joined)
    //   setIsChatOpen(open => !open)
    // }
    // }
  }

  const getUserId = (role) => {
    if (currentChat) {
      return role === USER_ROLE.BUYER ? currentChat?.buyerId : currentChat?.sellerId
    } else {
      return userInfo?.role === 'user' ? userInfo?._id : userInfo?.sellerId
    }
  }

  const sendMessage = () => {
    const selectedRole = userInfo.role === 'user' ? USER_ROLE.BUYER :
      userInfo.role === 'seller' ? USER_ROLE.SELLER : USER_ROLE.ADMIN;

    const newMessage: IMessage = {
      from: getUserId(selectedRole),
      roomName: currentChat ? currentChat?.roomName : `adminChat:${userInfo._id}`,
      userName: userInfo?.firstName + ' ' + userInfo?.lastName,
      senderRole: selectedRole,
      type: CHAT_TYPE.ADMIN_CHAT,
      content: adminChatMessage,
      isRead: false,
    }

    socket.emit(SOCKET_CHANNELS.SEND_MESSAGE, newMessage);
    setAdminChatMessage('')
  }

  useEffect(() => {
    const handleReceiveMessage = (message: IMessage) => {
      dispatch(insertNewMessage(message));
    };

    socket.on(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      socket.off(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);
    }
  }, [dispatch])

  const handleCloseAdminChat = () => {
    // if(!isJoinedAdminChat) return null
    // socket.emit(SOCKET_CHANNELS.FINISH_ADMIN_CHAT, {buyerInfo: userInfo, role: ChatRole.BUYER})
    // dispatch(buyerFinishAdminChat());
    setShowCloseAdminChatConfirm(false)
    setIsChatOpen(opened => !opened)
    removeChat()
  }

  const removeChat = async () => {
    const userInfo = getUserInfoFromCookies()
    const token = Cookies.get('token');
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // const token = localStorage.getItem('adminToken');
    const roomName = currentChat ? currentChat?.roomName : `adminChat:${userInfo._id}`
    const params = userInfo?.role === 'user' ? `user&buyerId=${userInfo?._id}` : `seller&sellerId=${userInfo?.sellerId}`
    const config = {
      headers: {
        Authorization: token
      }
    }
    try {
      const resp = await axios.delete(`${baseUrl}/deleteChatRoom?roomId=${roomName}&role=${params}`, config)
      dispatch(updateMessages([]));
    } catch (error) {
    }
  }

  useEffect(() => {
    if (isClient) {
      const element = document.querySelector('.msger-chat');
      element.scrollTop = element.scrollHeight;
    }
  }, [messages, isChatOpen])

  return (
    isClient ? <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={t("pagetitle.Talk_to_Support")}
          description={"Reach out to support for help"}
          content={"Enquire about questions, orders and how to sell on Linconstore"}
        >
          <ContentHeader
            title={t("helpcenter.Submit_request")}
            paths={[t("helpcenter.title"), t("helpcenter.Submit_request")]}
            routePath="/help-center"
            iconComponent={<Toll sx={{ color: "var(--primary)" }} />}
          />
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack spacing={2}>
              <Container maxWidth={"lg"} component={"main"}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={isMatches ? 1 : 2}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          p: isMatches ? 1 : 2,
                        }}
                      >
                        <Stack spacing={2}>
                          <Typography variant={isMobile ? "body1" : "h6"}>
                            <b>{t("contact.Livechat")}</b>
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            {t("contact.chatDescription")}
                          </Typography>
                        </Stack>
                        <Stack spacing={0} my={2}>
                          <Typography variant={isMobile ? "body1" : "h6"}>
                            <b>{t("contact.email")}</b>
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            Complaints@linconstore.com
                          </Typography>
                          <Typography
                            variant={isMobile ? "subtitle1" : "body1"}
                          >
                            Enquiries@linconstore.com
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          p: 2,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component={"form"}
                          onSubmit={handleSubmit(onSubmit)}
                          noValidate
                        >
                          <Controller
                            name="name"
                            control={control}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.name}
                                field={field}
                                id={t("helpcenter.name")}
                                variant="outlined"
                              />
                            )}
                          />
                          <Controller
                            name="email"
                            control={control}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.email}
                                field={field}
                                id={t("helpcenter.email")}
                                type={"email"}
                                variant="outlined"
                              />
                            )}
                          />
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field, formState: { errors } }) => (
                              <TextInput
                                data={errors?.phone}
                                field={field}
                                id={t("helpcenter.phone")}
                                variant="outlined"
                                type={"number"}
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
                                id={t("helpcenter.message")}
                                variant="outlined"
                                multiple={true}
                              />
                            )}
                          />
                          {isError && (
                            <FormHelperText sx={{ color: "red" }}>
                              {errorMessage}
                            </FormHelperText>
                          )}
                          <Button
                            variant={"contained"}
                            type={"submit"}
                            disabled={isLoading}
                            fullWidth
                            sx={{ mt: 2 }}
                          >
                            {isLoading && <CircularProgress />} {t("helpcenter.send")}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Container>
            </Stack>
          </Box>
          <Box position='fixed' bottom={isMobile ? '3.5rem' : '2rem'} right='2rem' zIndex={10}>
            <Box
              sx={{
                display: "flex",
                alignSelf: "flex-end",
                my: 2,
                transition: "0.2s",
                bgcolor: '#00a859',
                width: isMobile ? '3rem' : '4rem',
                height: isMobile ? '3rem' : '4rem',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                ":active": { transform: "scale(0.9)" },
                cursor: 'pointer',
              }}
              onClick={() => !isLoggedIn ? router.push('/login') : setIsChatOpen(prev => !prev)}
            >
              {/* <Forum className={"pointer"} fontSize={"large"} /> */}
              <SmsOutlined fontSize={isMobile ? "medium" : "large"} />
            </Box>
            <Box className="chatbox-message-wrapper" sx={{
              position: 'absolute',
              right: isMobile ? '-5vw' : 0,
              bottom: "calc(100% + 1rem)",
              width: isMobile ? "90vw" : "420px",
              borderRadius: "0.5rem",
              overflow: "hidden",
              boxShadow: "0 0 2rem rgba(0, 0, 0, 0.5)",
              transform: isChatOpen ? "scale(1)" : "scale(0)",
              transformOrigin: "bottom right",
              transition: "0.2s",
            }}>
              <Box className="chatbox-message-header"
                sx={{
                  bgcolor: "#00a859",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: '0.75rem',
                  py: '1.5rem',
                }}
              >
                <Box className="chatbox-message-profile" display='flex' alignItems='center' sx={{ gridGap: "0.5rem" }}>
                  <Avatar alt="Admin avatar" src="/assets/img/custom_avatar.png" sx={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: "50%",
                  }} />
                  <Box>
                    <Typography fontSize="1.125rem" fontWeight={600}> {t("chat.admin")} </Typography>
                    <Typography fontSize="0.875rem" color="#fff" > {t("chat.we_typically_reply_within_24_hours")} </Typography>
                  </Box>
                </Box>

                <Box className="chatbox-message-dropdown">
                  <HighlightOffOutlined sx={{ cursor: 'pointer' }} onClick={() => setShowCloseAdminChatConfirm(true)} />
                </Box>
              </Box>
              <Box className="msger-chat"
                sx={{
                  bgcolor: "#F5F5F5",
                  p: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gridRowGap: "1rem",
                  maxHeight: "300px",
                  overflowY: 'auto',
                }}
              >
                {
                  showCloseAdminChatConfirm &&
                  <>
                    <Typography>{t("chat.will_you_leave_chat")}</Typography>
                    <Box display='flex' justifyContent='space-evenly'>
                      <Button onClick={() => setShowCloseAdminChatConfirm(false)} variant="outlined" color="success">{t("button.cancel")}</Button>
                      <Button onClick={handleCloseAdminChat} variant="contained" color="success">{t("button.leave")}</Button>
                    </Box>
                  </>
                }

                {!showCloseAdminChatConfirm && messages.length === 0 &&
                  <Typography>{t("chat.how_can_we_help")}</Typography>
                }
                {
                  !showCloseAdminChatConfirm && messages.length > 0 && messages.map((message, index) => {
                    if (message.senderRole === USER_ROLE.BUYER || (message.type == CHAT_TYPE.ADMIN_CHAT && message.senderRole === USER_ROLE.SELLER)) {
                      return (
                        <Box key={index} className="chatbox-message-item sent"
                          sx={{
                            px: '1rem',
                            py: '0.5rem',
                            alignSelf: 'flex-end',
                            bgcolor: "#00a859",
                            color: 'white',
                            borderRadius: "0.75rem 0 0.75rem 0.75rem",
                          }}
                        >
                          <Typography className="chatbox-message-item-text">{message.content}</Typography>
                          <Typography className="chatbox-message-item-time" sx={{
                            float: 'right',
                            fontSize: '0.75rem',
                            display: 'inline-block'
                          }}>{getHourMinute(message?.createdAt)}</Typography>
                        </Box>
                      )
                    } else {
                      return (
                        <Box key={index} className="chatbox-message-item received"
                          sx={{
                            px: '1rem',
                            py: '0.5rem',
                            alignSelf: 'flex-start',
                            bgcolor: "#ffffff",
                            color: '#00a859',
                            border: "solid 1px #00a859",
                            borderRadius: "0 0.75rem 0.75rem 0.75rem",
                            boxShadow: "0.25rem 0.25rem 1.5rem rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          <Typography className="chatbox-message-item-text">{message.content}</Typography>
                          <Typography className="chatbox-message-item-time" sx={{
                            float: 'right',
                            fontSize: '0.75rem',
                            display: 'inline-block'
                          }}>{getHourMinute(message?.createdAt)}</Typography>
                        </Box>
                      )
                    }
                  })
                }
              </Box>
              <Box className="chatbox-message-bottom">
                <Box className="chatbox-message-form" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#00a859',
                  borderRadius: '0.5rem',
                }}>
                  <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
                    <OutlinedInput
                      type='text'
                      fullWidth
                      size="small"
                      placeholder={t("placeholder.type_message")}
                      name="adminChatMessage"
                      value={adminChatMessage}
                      onChange={(e) => setAdminChatMessage(e.target.value)}
                      sx={{
                        "& fieldset": { border: 'none' },
                        p: 0,
                      }}
                      endAdornment={
                        <Button className="chatbox-message-submit" color="success" onClick={sendMessage} >
                          <SendOutlined
                            sx={{
                              fontSize: "1.25rem",
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          />
                        </Button>
                      }
                    />
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </> : <></>
  );
};
export default Contact;
