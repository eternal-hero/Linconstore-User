import { AccountBox, Inventory, Laptop, Paid, SafetyCheck, Savings, Sell } from "@mui/icons-material"
import Nav from "../Layouts/Nav"
import ContentHeader from "../Utils/contentHeader"
import Wrapper from "../Wappers/Container"
import KnowledgeItem from "./KnowledgeItem"
import { Container, Grid } from "@mui/material"
import Footer from "../Layouts/Footer"
import { useTranslation } from "react-i18next"

const KnowledgeBase = () => {
    const { t } = useTranslation();

    const knowledgeItem = [
        {
            content: t("helpcenter.KnowledgeBase.User_account"),
            amount: 5,
            link: 'userAccount',
            icon: <AccountBox sx={{color: "var(--primary)"}} fontSize="large" />
        },
        {
            content: t("helpcenter.KnowledgeBase.Sell_on_linconstore"),
            amount: 10,
            link: 'linconstoreSell',
            icon: <Sell sx={{color: "var(--primary)"}} fontSize="large"/>
        },
        {
            content: t("helpcenter.KnowledgeBase.Safety_tips"),
            amount: 6,
            link: 'safetytips',
            icon: <SafetyCheck sx={{color: "var(--primary)"}} fontSize="large"/>
        },
        {
            content: t("helpcenter.KnowledgeBase.Seller_tools"),
            amount: 8,
            link: 'sellerTools',
            icon: <Inventory sx={{color: "var(--primary)"}} fontSize="large"/>
        },
        {
            content: t("helpcenter.KnowledgeBase.Community_header"),
            amount: 1,
            link: 'community',
            icon: <Savings sx={{color: "var(--primary)"}} fontSize="large"/>
        },
        {
            content: t("helpcenter.KnowledgeBase.Seller_Payout"),
            amount: 8,
            link: 'sellerPayout',
            icon: <Paid sx={{color: "var(--primary)"}} fontSize="large"/>
        },
    ]

    return (
        <>
            <Nav />
            <Wrapper
                title={t("pagetitle.knowledge_base")}
                description={
                "knowledge base on Linconstore"
                }
                content={"knowledge base | linconstore"}
            >
                <ContentHeader 
                    title={t("helpcenter.Knowledge_base")}
                    paths={[t("helpcenter.title"), t("helpcenter.Knowledge_base")]}
                    iconComponent={<Laptop sx={{color: "var(--primary)"}} />}
                    routePath="/help-center"
                />

                <Container component={"main"} maxWidth={"md"} sx={{my: 10}}>
                    <Grid container spacing={4}>
                        {
                            knowledgeItem.map((item) => {
                                return (
                                    <>
                                        <Grid item md={4} sm={6} xs={12}>
                                            <KnowledgeItem 
                                                content={item.content} 
                                                amount={item.amount} 
                                                link={item.link} 
                                                icon={item.icon}
                                            />
                                        </Grid>
                                    </>
                                )
                            })
                        }
                    </Grid>
                </Container>

                <Footer />
            </Wrapper>
        </>
    )
}

export default KnowledgeBase