import React, { ChangeEvent, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { FormHelperText, IconButton } from "@mui/material";
import {
    AttachmentOutlined,
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
import { getHourMinute, reCreateDate } from "../../Helpers/getDate";
import { IChatRoom } from "../../Store/ChatRoom";
import { createNewChatRoom } from "../../hooks/useDataFetch";
import { IMessage, insertNewAdminMessage, updateAdminMessages } from "../../Store/Message";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import { useTranslation } from "react-i18next";
import { regionList } from "../Admin/Admins";
import Cookies from "js-cookie";
import { INotification } from "../../Store/Notification";
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

type AdminChatPropType = {
    handleBroadCast: (message: string) => void;
    adminChat: any;
    isBroadCast: boolean;
}

const AdminChat: React.FC<AdminChatPropType> = ({ handleBroadCast, adminChat, isBroadCast }) => {
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

    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();
    const [broadCastMessage, setBroadCastMessage] = useState([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isBroadCast) {
                onJoiningRoom()
                getConversation()
            } else {
                getBroadCastConversation()
            }
        }
    }, [adminChat, isBroadCast])

    const onJoiningRoom = async () => {
        if (Cookies.get("adminInfo")) {
            const adminInfo = JSON.parse(Cookies.get("adminInfo"));
            const chatRoom: IChatRoom = {
                roomName: adminChat?.roomName,
                userName: adminInfo?.username,
                type: adminChat?.type,
                isAdminJoined: false,
                status: CHATROOM_STATUS.OPENED,
                buyerId: adminInfo?._id,
            };
            const result = await createNewChatRoom(chatRoom)(dispatch);
            if (result === 201 || result === 200) {
                socket.emit(SOCKET_CHANNELS.JOIN_CHAT, chatRoom.roomName);
            } else {
                alert("error while create new normal chat");
            }
        } else {
            router.push("/admin/login");
        }
    }

    const getConversation = async () => {
        const roomName = adminChat?.roomName
        const token = Cookies.get('adminToken')
        try {
            const resp = await axios.get(`${baseUrl}/admin/messages/${roomName}`, {
                headers: {
                    Authorization: token
                }
            })
            if (resp.data) {
                dispatch(updateAdminMessages(resp?.data))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getBroadCastConversation = async () => {
        const token = Cookies.get('adminToken')
        try {
            const resp = await axios.get(`${baseUrl}/admin/broadCast`, {
                headers: {
                    Authorization: token
                }
            })
            if (resp.data) {
                setBroadCastMessage(resp?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const messages = useSelector((state: RootState) => state.Message.adminMessages);

    useEffect(() => {
        const handleReceiveMessage = (messageItem: IMessage) => {
            dispatch(insertNewAdminMessage(messageItem))
        }
        socket.on(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);

        return () => {
            socket.off(SOCKET_CHANNELS.RECEIVE_MESSAGE, handleReceiveMessage);
        }
    }, [dispatch])


    const onSubmit: SubmitHandler<Chat> = ({ message, attachment }) => {
        if (isBroadCast) {
            handleBroadCast(message);
            reset()
            return;
        }
        const { roomName, buyerId } = adminChat;
        const messageItem = {
            content: message,
            roomName,
            userName: "Admin",
            type: CHAT_TYPE.ADMIN_CHAT,
            senderRole: USER_ROLE.ADMIN,
            time: new Date()
        }
        socket.emit(SOCKET_CHANNELS.SEND_MESSAGE, messageItem)
        const notification: INotification = {
            from: USER_ROLE.ADMIN,
            to: buyerId,
            title: 'New Message',
            senderRole: USER_ROLE.ADMIN,
            content: "You have a new message",
            isRead: false,
            createdAt: new Date()
        }
        socket.emit(SOCKET_CHANNELS.SEND_NOTIFICATION, notification)
        reset()
    };

    useEffect(() => {
        const element = document.querySelector('.msger-chat');
        element.scrollTop = element.scrollHeight;
    }, [messages, broadCastMessage])

    return (
        <Container maxWidth="xl" sx={{ height: "100%", p: "0px !important", m: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
                <Box className="msger-chat">
                    {isBroadCast ?
                        broadCastMessage.map((message, index) => {
                            return (
                                <div className="msg right-msg" key={index}>
                                    <div className="msg-bubble">
                                        <div className="msg-info">
                                            <div className="msg-info-name">
                                                Admin
                                            </div>
                                            <div className="msg-info-time">{reCreateDate(message?.createdAt)} {getHourMinute(message?.createdAt)}</div>
                                        </div>
                                        <div className="msg-info">
                                            <div className="msg-info-name">
                                                {message.language && t(`language.${message.language}`)}
                                            </div>
                                            <div className="msg-info-time">{message.region && regionList.filter((section) => section.value == message.region)[0]?.label}</div>
                                        </div>

                                        <div className="msg-text">
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            )
                        }) :
                        (messages.map((message, index) => {
                            if (message.senderRole === USER_ROLE.ADMIN) {
                                return (
                                    <div className="msg right-msg" key={index}>
                                        <div className="msg-bubble">
                                            <div className="msg-info">
                                                <div className="msg-info-name">
                                                    Admin
                                                </div>
                                                <div className="msg-info-time">{reCreateDate(message?.createdAt)} {getHourMinute(message?.createdAt)}</div>
                                            </div>

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
                                                <div className="msg-info-name">{message.userName}</div>
                                                <div className="msg-info-time">{reCreateDate(message?.createdAt)} {getHourMinute(message.createdAt)}</div>
                                            </div>

                                            <div className="msg-text">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        )}
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
                    <Box sx={{ display: "flex" }}>
                        <Controller
                            name="attachment"
                            control={control}
                            render={({ field: { onChange }, formState: { errors } }) => (
                                <IconButton
                                    color="primary"
                                    aria-label="attachment"
                                    component="label"
                                    disabled={isBroadCast}
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            setValue(
                                                "attachment",
                                                e.target.files && e.target.files[0]
                                            );
                                        }}
                                    />
                                    <AttachmentOutlined color={"success"} />
                                </IconButton>
                            )}
                        />
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
                        <IconButton
                            type={"submit"}
                            color="success"
                            aria-label="message seller"
                        >
                            <SendOutlined />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};
export default AdminChat;
