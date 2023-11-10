import React, { useEffect, useState } from "react";
import { Card, Divider, FormControl, InputLabel, List, ListItemButton, ListItemText, MenuItem, Select, Stack, styled, useMediaQuery } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { ArrowBack, Delete } from "@mui/icons-material";
import { useRouter } from "next/router";
import socket, { SOCKET_CHANNELS, NOTIFICATION_TARGET, USER_ROLE } from "../../Helpers/socket";
import { INotification } from "../../Store/Notification";
import { regionList } from "./Admins";
import { getLangPlusCountryCode } from "../../Helpers/utils";
import { languages } from "../../config/i18n";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";
import { baseUrl } from "../../Helpers/baseUrl";
import axios from "axios";
import Cookies from "js-cookie";
import Header, { SearchOptionType } from "./Header";
import AdminChat from "../AdminChat/AdminChat";

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

const Messages: React.FC = () => {
    const { i18n, t } = useTranslation();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const router = useRouter()
    const [activeAdminChats, setActiveAdminChats] = useState([])
    const [selectedChat, setSelectedChat] = useState<number>(-1)

    const searchFields = ['name',]

    const [searchOption, setSearchOption] = useState<SearchOptionType>({
        field: searchFields[0],
        keyword: '',
    });


    useEffect(() => {
    }, [searchOption])


    const [broadCastContent, setBroadCastContent] = useState({
        content: '',
        toRoom: NOTIFICATION_TARGET.All,
        region: 'all',
        language: 'en',
    })

    useEffect(() => {
        getAdminChats()
    }, [])

    const getAdminChats = async () => {
        const token = Cookies.get('adminToken')
        const config = {
            headers: {
                Authorization: token
            }
        }
        try {
            const resp = await axios.get(`${baseUrl}/adminChatRoom`, config);
            setActiveAdminChats(resp?.data);
        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (e) => {
        const temp = { ...broadCastContent, [e.target.name]: e.target.value };
        setBroadCastContent(temp)
    }

    const handleBroadCast = (content) => {
        const notification: INotification = {
            from: USER_ROLE.ADMIN,
            to: broadCastContent.toRoom,
            region: broadCastContent.region,
            language: broadCastContent.language,
            title: 'Broadcast',
            senderRole: USER_ROLE.ADMIN,
            content: content,
            isRead: false,
            createdAt: new Date()
        }
        socket.emit(SOCKET_CHANNELS.SEND_NOTIFICATION, notification)
    }

    const enterChat = (index: number) => {
        setSelectedChat(index)
    }

    const removeChat = async (e, chat) => {
        e.stopPropagation()

        const token = Cookies.get('adminToken');
        const config = {
            headers: {
                Authorization: token
            }
        }
        try {
            const resp = await axios.delete(`${baseUrl}/deleteAdminChatRoom?roomId=${chat.roomName}&role=admin`, config)
            resp?.data?.acknowledged && getAdminChats()
        } catch (error) {

        }
    }

    return (
        <>
            <Header
                title="Users"
                searchFields={searchFields}
                totalAmount={activeAdminChats.length}
                searchOption={searchOption}
                setSearchOption={setSearchOption}
            />
            <Card elevation={0} sx={{ background: 'transparent', mt: 1, height: 'calc(100vh - 130px)' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    {isMobile && <ArrowBack onClick={() => router.back()} className={'pointer'} />}
                </Box>
                <Stack direction={"row"} gap={2} sx={{ height: "100%" }}>
                    <Drawer variant="permanent" open sx={{ height: "100%" }}>
                        <Divider />
                        <List component="nav">
                            <ListItemButton
                                onClick={() => enterChat(-1)}
                                selected={selectedChat === -1}
                                sx={{ display: "flex", gap: 2 }}
                            >
                                <ListItemText primary={"Send Broadcast"} sx={{ "& span": { fontSize: 14 } }} />
                            </ListItemButton>
                            {activeAdminChats.map((item, index) => (
                                <ListItemButton
                                    onClick={() => enterChat(index)}
                                    selected={index === selectedChat}
                                    key={index}
                                    sx={{ display: "flex", gap: 2 }}
                                >
                                    <ListItemText primary={item?.buyerDetails?.firstName + " " + item?.buyerDetails?.lastName} sx={{ "& span": { fontSize: 14 } }} />
                                    {index === selectedChat &&
                                        <Delete onClick={(e) => removeChat(e, item)} />
                                    }
                                </ListItemButton>
                            ))}
                        </List>
                    </Drawer>

                    <Stack height={"100%"} width={"100%"}>
                        {
                            selectedChat === -1 && (
                                <Stack gap={2} direction={"row"} bgcolor={"white"}>
                                    <FormControl sx={{ m: 1, minWidth: 240 }}>
                                        <InputLabel id="broadcast-message">To</InputLabel>
                                        <Select
                                            labelId="broadcast-message"
                                            value={broadCastContent.toRoom}
                                            onChange={handleChange}
                                            name="toRoom"
                                            size="small"
                                            label="To"
                                            defaultValue={NOTIFICATION_TARGET.All}
                                        >
                                            <MenuItem value={NOTIFICATION_TARGET.All}>Users</MenuItem>
                                            <MenuItem value={NOTIFICATION_TARGET.SELLER}>Sellers</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ m: 1, minWidth: 240 }}>
                                        <InputLabel id="broadcast-message">Region</InputLabel>
                                        <Select
                                            labelId="new-admin-region"
                                            id="demo-simple-select"
                                            name="region"
                                            value={broadCastContent.region}
                                            onChange={handleChange}
                                            variant={"outlined"}
                                            size="small"
                                            className={"sortButton"}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    color: "black",
                                                },
                                            }}
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                        >
                                            {regionList.map((section, index) => {
                                                return <MenuItem value={section.value} key={index}>{section.label}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ m: 1, minWidth: 240 }}>
                                        <InputLabel id="broadcast-message">Language</InputLabel>
                                        <Select
                                            name="language"
                                            value={broadCastContent.language}
                                            onChange={handleChange}
                                            labelId="new-admin-language"
                                            id="demo-simple-select"
                                            variant={"outlined"}
                                            size="small"
                                            className={"sortButton"}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    color: "black",
                                                },
                                            }}
                                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                                        >
                                            {languages.map((language, index) => {
                                                const { code, country } = language;
                                                const langPlusCountryCode = getLangPlusCountryCode(language);
                                                return (
                                                    <MenuItem key={langPlusCountryCode} value={langPlusCountryCode}>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <ListItemIcon sx={{ maxHeight: "20px" }}>
                                                                <Flag code={country ?? code}></Flag>
                                                            </ListItemIcon>
                                                            <ListItemText sx={{ ml: 1, '& span': { fontSize: 14 } }}>
                                                                <b>{t(`language.${langPlusCountryCode}`)}</b>
                                                            </ListItemText>
                                                        </div>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                </Stack>
                            )
                        }
                        <AdminChat
                            handleBroadCast={handleBroadCast}
                            adminChat={activeAdminChats.filter((chat, index) => index === selectedChat)[0]}
                            isBroadCast={selectedChat === -1}
                        />
                    </Stack>

                </Stack>


            </Card>
        </>
    )


}
export default Messages;