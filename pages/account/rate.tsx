import { NextPage } from "next";
import RateExperience from "../../Components/user/Rate";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useVerifyUserPayment } from "../../hooks/useDataFetch";
import { CircularProgress, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { INotification, insertNewNotifications } from "../../Store/Notification";
import socket, { SOCKET_CHANNELS, USER_ROLE } from "../../Helpers/socket";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const RatePage: NextPage = () => {
    const { t } = useTranslation();
    const [userInfo, setUserInfo] = useState(null)
    const router = useRouter();
    const [isVerified, setIsVerified] = useState<Boolean>(false);
    const dispatch = useDispatch();
    const address = localStorage.getItem("address");

    useEffect(() => {
        // const user = JSON.parse(localStorage.getItem("userInfo"));

        const userString = Cookies.get("userInfo");
        // alert(`userInfo------------------------------------: ${userString}`);
        if (userString) {
            const user = JSON.parse(userString);
            setUserInfo(user)
        } else {
            // alert(address)
            router.push("/")
        }

        const receiveNotification = (notification: INotification) => {
            dispatch(insertNewNotifications(notification))
        }

        socket.on(SOCKET_CHANNELS.RECEIVE_NOTIFICATION, receiveNotification)
        return () => {
            socket.off(SOCKET_CHANNELS.RECEIVE_NOTIFICATION, receiveNotification)
        }
    }, [])

    const onSuccess = () => {
        localStorage.removeItem("donesticShipping");
        setIsVerified(true);
        addNotification()
    }

    const addNotification = () => {
        const selectedRole = userInfo?.role === 'user' ? USER_ROLE.BUYER :
            userInfo?.role === 'seller' ? USER_ROLE.SELLER : USER_ROLE.ADMIN;

        const notificationContent = {
            content: 'Order has been placed',
            toRoom: selectedRole
        }

        const notification: INotification = {
            from: `${userInfo?.role}-${userInfo?._id}`,
            to: notificationContent.toRoom, // event name
            title: 'Notification Alert',
            senderRole: selectedRole,
            content: notificationContent.content,
            isRead: false,
            createdAt: new Date()
        }

        socket.emit(SOCKET_CHANNELS.SEND_NOTIFICATION, notification)
    }

    const { isLoading, mutate: verify, isError, data } = useVerifyUserPayment(onSuccess);

    useEffect(() => {
        if (localStorage.getItem("address")) {
            setTimeout(() => {
                verify(localStorage.getItem("address"))
            }, 1000)
        } else {
            router.push("/")
        }
    }, [address, router, verify])

    const retryVerification = () => {
        if (address) {
            verify(address)
        } else {
            router.push("/")
        }
    }

    return (
        <div style={{ width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            {!isVerified && <Typography variant={'h6'} textAlign={'center'}>{t("verify.Verifying")} {isLoading && <CircularProgress />}</Typography>}
            {isVerified && <RateExperience />}

            {isError && <Stack direction={'row'}>
                <Typography variant={'subtitle1'}>{t("verify.Sorry_we_could_not_verify_your_payment")}</Typography>
                <Button size={'small'} onClick={retryVerification}>{t("verify.Retry")}</Button>
            </Stack>}
        </div>
    )
}
export default RatePage;
