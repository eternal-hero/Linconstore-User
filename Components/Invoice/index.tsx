import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { reCreateDate } from "../../Helpers/getDate";
import { getCurrencySymbol } from "../../Helpers/Exchange";
import { useRouter } from "next/router";

const Invoice = ({ order, user }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const [currencySymbol, setCurrencySymbol] = useState<string>("$");

    useEffect(() => {
        async function init() {
            const rateRes: any = await getCurrencySymbol(order.productId.owner.currency);
            setCurrencySymbol(rateRes)
        }
        if (order) {
            init()
        } else {
            router.push("/seller/orderplaced")
        }
    }, [order]);

    return (
        <Container>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={'center'} mb={5}>
                <Box display={'flex'} gap={isMobile ? 1 : 2} alignItems={'center'}>
                    <Image
                        width={isMobile ? 30 : 100}
                        height={isMobile ? 30 : 100}
                        style={{ marginTop: isMobile ? 0 : 30, width: "100%", height: "100%", objectFit:"contain" }}
                        placeholder="blur"
                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                        src={order.productId.owner.logo}
                        alt={"linconstore logo"}
                    />
                    <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}>{t("seller.invoice.shipping_invoice")}</Typography>
                </Box>
                <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}>{reCreateDate(order.createdAt)}</Typography>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={isMobile ? 2 : 4}>
                <Box display={'flex'} flexDirection={'column'} gap={10} width={'100%'}>
                    <Box display={'flex'} flexDirection={'column'} gap={isMobile ? 1 : 2}>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}> {t("seller.invoice.Seller")}</Typography>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{order.productId.owner?.name}</Typography>
                        </Box>

                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}>{t("seller.invoice.Return_Address")}</Typography>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{order.productId.owner?.location}</Typography>
                        </Box>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}>{t("seller.invoice.Buyer")}</Typography>
                        <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{user?.firstName + " " + user?.lastName}</Typography>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{user?.state ?? ""}</Typography>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{user?.city ?? ""} {user?.zipCode ?? ""}</Typography>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{user?.country}</Typography>
                        </Box>
                        <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{user?.phoneNumber && ("+" + user?.phoneNumber)}</Typography>
                    </Box>
                </Box>

                <Box display={'flex'} flexDirection={'column'} gap={isMobile ? 5 : 10} width={'100%'}>
                    <Box display={'flex'} flexDirection={'column'} gap={isMobile ? 2 : 4}>
                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                            <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={500}>{t("seller.invoice.Product")}</Typography>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} gap={isMobile ? 1 : 2}>
                                    <Image
                                        width={isMobile ? 20 : 50}
                                        height={isMobile ? 20 : 50}
                                        style={{ marginTop: isMobile ? 0 : 30, width: "100%", height: "100%", objectFit:"contain" }}
                                        placeholder="blur"
                                        blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                                        src={order.productId.photo[0]}
                                        alt={"Product Image"}
                                    />
                                    <Box display={'flex'} flexDirection={'column'}>
                                        <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{order.productId.title}</Typography>
                                        <Typography fontSize={isMobile ? "7px" : "14px"}>{t("seller.invoice.Unit")} - {order.quantity}</Typography>
                                    </Box>
                                </Box>
                                <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{currencySymbol}&nbsp;{Number(order.productId.price * order.quantity)}</Typography>
                            </Box>
                        </Box>

                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{t("seller.invoice.Variant")}</Typography>
                            <Box display={'flex'} flexDirection={'row'} gap={isMobile ? 1 : 3}>
                                {order.variants.map((variant, index) => {
                                    return <Typography fontSize={isMobile ? "7px" : "14px"} key={index}>{variant.variant} : {variant.option}</Typography>
                                })}
                            </Box>
                        </Box>

                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={600}>{t("seller.invoice.Other_Info")}</Typography>
                            <Box display={'flex'} flexDirection={'row'} gap={3}>
                                <Typography fontSize={isMobile ? "7px" : "14px"}>{t("seller.invoice.Condition")}</Typography>
                                <Typography fontSize={isMobile ? "7px" : "14px"}>{order.productId.condition}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={isMobile ? 2 : 5}>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography fontSize={isMobile ? "8px" : "16px"} fontWeight={600}>{t("seller.invoice.Shipping")}</Typography>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={"space-between"}>
                                <Typography fontSize={isMobile ? "7px" : "14px"}>{t("seller.invoice.Shipping")}</Typography>
                                <Typography fontSize={isMobile ? "7px" : "14px"}>{currencySymbol}&nbsp;{Number(order.shippingCost)}</Typography>
                            </Box>
                        </Box>

                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography fontSize={isMobile ? "7px" : "14px"} fontWeight={500}>{t("seller.invoice.Total")}</Typography>
                            <Typography fontSize={isMobile ? "7px" : "14px"}>{currencySymbol}&nbsp;{Number(order.productId.price * order.quantity + order.shippingCost)}</Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Container>
    )
}

export default Invoice