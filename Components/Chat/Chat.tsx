import React, { ChangeEvent, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { CircularProgress, FormHelperText, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import {
    AttachmentOutlined,
    HighlightOffOutlined,
    SendOutlined,
} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import socket, { CHATROOM_STATUS, CHAT_TYPE, SOCKET_CHANNELS, USER_ROLE } from "../../Helpers/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/Index";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import { IChatRoom, TProduct } from "../../Store/ChatRoom";
import { IMessage, insertNewMessage, updateMessages } from "../../Store/Message";
import { getHourMinute } from "../../Helpers/getDate";
import { setChatRole } from "../../Store/ChatRoom";
import { createNewChatRoom } from "../../hooks/useDataFetch";
import Image from "next/image";
import Cookies from "js-cookie";

const schema = yup.object().shape({
    message: yup.string().required().min(4),
    attachment: yup
        .mixed()
        .test("fileSize", "File Size is too large", (value) => {
            if (value) {
                return value.size <= 2000000;
            } else {
                return true;
            }
        })
        .test("fileType", "Unsupported File Format", (value) => {
            if (value) {
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }
            return true;
        }),
});
type Chat = {
    message: string;
    attachment: File | null;
};
const Chat: React.FC = () => {
    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Chat>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            message: "",
            attachment: null,
        },
    });

    const dispatch = useDispatch();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 600px)");

    let userInfo;
    if (typeof window !== 'undefined') {
        userInfo = JSON.parse(Cookies.get('userInfo'))
        // userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }

    // const currentChat = useSelector((state: RootState) => state.chat.normalChat.currentChat) 
    const { chatRooms, chatRole } = useSelector((state: RootState) => state.ChatRoom);


    const [currentChatRoomName, setCurrentChatRoomName] = useState('')
    const [currentChat, setCurrentChat] = useState<IChatRoom>()
    const [imageData, setImageData] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        dispatch(updateMessages([]))
        const chatRoomName = localStorage.getItem('currentChatRoomName');
        if (chatRoomName) {
            setCurrentChatRoomName(() => chatRoomName);
            getProductDetail()
        } else {
            router.back()
        }
    }, [])

    useEffect(() => {
        if (currentChatRoomName) {
            onJoiningRoom()
            // getConversation();
        }
    }, [currentChatRoomName])

    const onJoiningRoom = async () => {
        const { owner, id } = JSON.parse(localStorage.getItem('product_detail'));
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userInfo = JSON.parse(Cookies.get("userInfo"));
        // const roomName = localStorage.getItem('currentChatRoomName')
        const chatRoom: IChatRoom = {
            roomName: currentChatRoomName,
            userName: userInfo?.firstName + ' ' + userInfo?.lastName,
            type: CHAT_TYPE.NORMAL_CHAT,
            isAdminJoined: false,
            status: CHATROOM_STATUS.OPENED,
            sellerId: owner,
            buyerId: userInfo?._id,
            productId: id,
        };
        const result = await createNewChatRoom(chatRoom)(dispatch);
        if (result === 201 || result === 200) {
            socket.emit(SOCKET_CHANNELS.JOIN_CHAT, chatRoom.roomName);
        } else {
            alert("error while create new normal chat");
        }
    }

    const getConversation = async () => {
        const userInfo = JSON.parse(Cookies.get("userInfo"));
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const chatRoomName = localStorage.getItem('currentChatRoomName');
        const token = Cookies.get('token')
        // const token = localStorage.getItem('token')
        try {
            const resp = await axios.get(`${baseUrl}/user/room/messages/${chatRoomName}?role=${chatRole === 'BUYER' ? 'user' : 'seller'}&sellerId=${chatRole === 'SELLER' ? userInfo?.sellerId : null}&buyerId=${chatRole === 'BUYER' ? userInfo?._id : null}`, {
                headers: {
                    Authorization: token
                }
            })
            if (resp.data) {
                dispatch(updateMessages(resp.data))
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (chatRooms && currentChatRoomName) {
            const currentChatRoom = chatRooms?.filter((chat) => chat.roomName === currentChatRoomName)[0]
            setCurrentChat(() => currentChatRoom)
        }
    }, [chatRooms])


    useEffect(() => {
        if (currentChat) {
            handleUserRole()
            // getProductDetail()
        }

    }, [currentChat])

    const handleUserRole = () => {
        const userInfo = JSON.parse(Cookies.get("userInfo"));
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const selectedRole = userInfo.role === 'user' ? USER_ROLE.BUYER :
            userInfo.role === 'seller' ? getSellerRole(userInfo) : USER_ROLE.ADMIN;
        dispatch(setChatRole(selectedRole));

    }

    const getSellerRole = (userInfo) => {
        if (userInfo?.sellerId === currentChat?.sellerId) {
            return USER_ROLE.SELLER
        } else {
            return USER_ROLE.BUYER
        }

    }

    useEffect(() => {
        chatRole && getConversation();
    }, [chatRole])


    const getProductDetail = async () => {
        const { id } = JSON.parse(localStorage.getItem('product_detail'));
        const response = await axios.get(`${baseUrl}/product/${id}`)
        setProduct(() => response.data.product)
    }

    const messages = useSelector((state: RootState) => state.Message.messages);


    useEffect(() => {
        if (messages) {
            const messageBoxHeight = document.querySelector('.msger-chat')
            messageBoxHeight.scrollTop = messageBoxHeight.scrollHeight;
        }
    }, [messages])


    const [product, setProduct] = useState<TProduct>();
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        const handleReceiveMessage = (message: IMessage) => {
            dispatch(insertNewMessage(message));
        }
        socket.on(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);

        return () => {
            socket.off(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);
        }
    }, [dispatch])

    const uploadImage = async (image) => {

        const data = new FormData();

        if (image) {
            setIsLoadingImage(true);

            data.append('file', image as unknown as string);
            data.append("upload_preset", "linconstore");
            data.append("cloud_name", "linconstore-cloud")

            try {
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/linconstore-cloud/image/upload",
                    data,
                    {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    }
                );
                setImageData(() => response.data);
            } catch (e) {
                console.log(e);
            }
        }
        setIsLoadingImage(false);
    }

    const onSubmit: SubmitHandler<Chat> = async ({ message, attachment }) => {
        const newMessage: IMessage = {
            from: userInfo?._id,
            roomName: currentChatRoomName,
            userName: userInfo?.firstName + ' ' + userInfo?.lastName,
            senderRole: chatRole,
            type: CHAT_TYPE.NORMAL_CHAT,
            content: message,
            isRead: false,
            image: imageData?.secure_url
        };
        reset({ message: '' });
        setImageData(null);
        socket.emit(SOCKET_CHANNELS.SEND_MESSAGE, newMessage);
    };


    return (
        <Container maxWidth={"lg"}>
            <Box sx={{ display: "flex", flexDirection: "column", my: 3, height: isMobile ? "calc(100vh - 85px)" : "calc(100vh - 48px)" }}>
                <Box
                    sx={{
                        display: "flex",
                        p: 2,
                        borderTopLeftRadius: "8px",
                        color: "#fff",
                        borderTopRightRadius: "8px",
                        backgroundColor: "#00a859",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack sx={{ width: "90%", }}>
                        <Typography gutterBottom variant={"body2"}>
                            {product && product?.owner?.name}
                        </Typography>
                        <Typography gutterBottom variant={"h6"} whiteSpace='nowrap' overflow='hidden' textOverflow="ellipsis">
                            {product && product?.title}
                        </Typography>
                        {/* <Typography gutterBottom variant={"body2"}>
                        Brand/Item specifics
                        </Typography> */}
                    </Stack>
                    <HighlightOffOutlined className={"pointer"} onClick={() => router.back()} />
                </Box>
                <Box className="msger-chat">
                    {isLoading ? <Box sx={{ width: 'max-content', margin: '0 auto' }}><CircularProgress /></Box> : <>
                        {messages.length ? messages.map((message, index) => {
                            if (message.from === userInfo?._id) {
                                return (
                                    <div className="msg right-msg" key={index}>
                                        <div className="msg-bubble">
                                            <div className="msg-info">
                                                <div className="msg-info-name">
                                                    {message.userName}
                                                </div>
                                                <div className="msg-info-time">{getHourMinute(message?.createdAt)}</div>
                                            </div>
                                            {message?.image &&
                                                <div>
                                                    <Image
                                                        width={350}
                                                        height={250}
                                                        style={{
                                                            marginTop: 30,
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                        placeholder="blur"
                                                        blurDataURL={
                                                            "https://via.placeholder.com/300.png/09f/fff"
                                                        }
                                                        src={message?.image}
                                                        alt={"product image"}
                                                    />
                                                </div>
                                            }
                                            <div className="msg-text">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="msg left-msg" key={index}>
                                        <div className="msg-bubble">
                                            <div className="msg-info">
                                                <div className="msg-info-name">
                                                    {
                                                        message.userName
                                                    }
                                                </div>
                                                <div className="msg-info-time">{getHourMinute(message?.createdAt)}</div>
                                            </div>
                                            {message?.image &&
                                                <div>
                                                    <Image
                                                        width={350}
                                                        height={250}
                                                        style={{
                                                            marginTop: 30,
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                        placeholder="blur"
                                                        blurDataURL={
                                                            "https://via.placeholder.com/300.png/09f/fff"
                                                        }
                                                        src={message?.image}
                                                        alt={"product image"}
                                                    />
                                                </div>
                                            }
                                            <div className="msg-text">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        }) : <p style={{ textAlign: 'center', fontWeight: 'light', color: 'silver' }}>No messages here</p>
                        }
                    </>}
                </Box>

                <Box
                    sx={{
                        "& .MuiTextField-root": { m: 1 },
                    }}
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <FormHelperText sx={{ color: "red" }}>
                        {errors?.attachment?.message}
                    </FormHelperText>
                    <Box sx={{ display: "flex", alignItems: 'center' }}>
                        {isLoadingImage ? <Box sx={{
                            width: '61px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}><CircularProgress /></Box> :
                            <Controller
                                name="attachment"
                                control={control}
                                render={({ field: { onChange }, formState: { errors } }) => (
                                    <IconButton
                                        color="primary"
                                        aria-label="attachment"
                                        component="label"
                                    >
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                // setValue(
                                                //     "attachment",
                                                //     e.target.files && e.target.files[0]
                                                // );
                                                uploadImage(e.target.files.length && e.target.files[0])
                                            }}
                                        />
                                        <AttachmentOutlined color={"success"} />
                                    </IconButton>
                                )}
                            />
                        }
                        <Box position={'relative'} width={'100%'} marginRight={'10px'}>
                            <Controller
                                name="message"
                                control={control}
                                render={({
                                    field: { onChange, value },
                                    formState: { errors },
                                }) => (
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        fullWidth
                                        size={"small"}
                                        sx={{
                                            minHeight: 45,
                                            border: "2px solid #00a866",
                                            borderRadius: "29px",
                                            "& fieldset": {
                                                border: "none !important",
                                                outline: "none !important",
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: { color: "#00a859", marginTop: 3 },
                                        }}
                                        multiline
                                        onChange={onChange}
                                        value={value}
                                        error={!!errors?.message}
                                        helperText={errors?.message?.message}
                                        variant={"outlined"}
                                        required
                                        maxRows={4}
                                    />
                                )}
                            />
                            {/* {imageData &&  */}
                            <Box className="upload-img-box" sx={{
                                bottom: '100%',
                                height: imageData ? '41px' : '0px',
                                opacity: imageData ? 1 : 0,
                                zIndex: imageData ? 10 : '-10',
                            }}>
                                <Box sx={{ flexShrink: 0, height: '27px', border: '1px solid white' }}>
                                    <Image
                                        height={27}
                                        width={30}
                                        src={imageData?.secure_url}
                                        placeholder="blur"
                                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                                        alt="product-icon"
                                        style={{ borderRadius: '3px' }}
                                    />
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '8px',
                                    width: '100%'
                                }}>
                                    <Typography className="upload-img-text text-ellipsis">{imageData?.original_filename}</Typography>
                                    <HighlightOffOutlined className={"pointer"} onClick={() => setImageData(null)} />
                                </Box>
                            </Box>
                            {/* } */}
                        </Box>
                        <IconButton
                            type={isLoadingImage ? "button" : "submit"}
                            color="success"
                            aria-label="message seller"
                            style={{ position: "relative" }}
                        >
                            {/*<FontAwesomeIcon style={{color: '#00a859'}} icon={faComment}/>*/}
                            <SendOutlined />
                            {isLoadingImage && <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: '100%',
                                zIndex: 30,
                                backgroundColor: 'white',
                                opacity: '.6'
                            }}></Box>}
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};
export default Chat;
