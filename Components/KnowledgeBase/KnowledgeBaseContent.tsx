import { Laptop } from "@mui/icons-material"
import Nav from "../Layouts/Nav"
import ContentHeader from "../Utils/contentHeader"
import Wrapper from "../Wappers/Container"
import { Container } from "@mui/material"
import Footer from "../Layouts/Footer"
import CollapseItem from "../Questions/CollapseItem"
import { useTranslation } from "react-i18next"

type KnowledgeBaseContentProps = {
    slug: string;
}

type ItemType = {
    title: string;
    content: string;
}

const KnowledgeBaseContent: React.FC<KnowledgeBaseContentProps> = ({ slug = "userAccount" }) => {
    const { t } = useTranslation();

    const knowledgeContentItems = {
        userAccount: [
            {
                header: t("helpcenter.KnowledgeBase.User_account"),
                link: t("helpcenter.KnowledgeBase.User_account"),
                title: t("helpcenter.KnowledgeBase.UserAccount.title1"),
                content: [t("helpcenter.KnowledgeBase.UserAccount.title1")],
                youtube: <iframe width="100%" height="315" src="https://www.youtube.com/embed/mAzRJ5bWrwk?si=LAq4ehec_U48u85E&amp;controls=0"
                    title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            },
            {
                header: t("helpcenter.KnowledgeBase.User_account"),
                link: t("helpcenter.KnowledgeBase.User_account"),
                title: t("helpcenter.KnowledgeBase.UserAccount.title2"),
                content: [
                    `${t("helpcenter.KnowledgeBase.UserAccount.content2-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.UserAccount.subtitle2-1")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content2-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.UserAccount.subtitle2-2")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content2-3")}`
                ],
                youtube: <iframe width="100%" height="315" src="https://www.youtube.com/embed/mAzRJ5bWrwk?si=LAq4ehec_U48u85E&amp;controls=0"
                    title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            },
            {
                header: t("helpcenter.KnowledgeBase.User_account"),
                link: t("helpcenter.KnowledgeBase.User_account"),
                title: t("helpcenter.KnowledgeBase.UserAccount.title3"),
                content: [
                    `TITLE:${t("helpcenter.KnowledgeBase.UserAccount.subtitle3-1")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content3-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.UserAccount.subtitle3-2")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content3-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.UserAccount.subtitle3-3")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content3-3")}`
                ],
                youtube: <iframe width="100%" height="315" src="https://www.youtube.com/embed/mAzRJ5bWrwk?si=LAq4ehec_U48u85E&amp;controls=0"
                    title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            },
            {
                header: t("helpcenter.KnowledgeBase.User_account"),
                link: t("helpcenter.KnowledgeBase.User_account"),
                title: t("helpcenter.KnowledgeBase.UserAccount.title4"),
                content: [
                    `${t("helpcenter.KnowledgeBase.UserAccount.content4")}`,
                ],
                youtube: <iframe width="100%" height="315" src="https://www.youtube.com/embed/mAzRJ5bWrwk?si=LAq4ehec_U48u85E&amp;controls=0"
                    title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            },
            {
                header: t("helpcenter.KnowledgeBase.User_account"),
                link: t("helpcenter.KnowledgeBase.User_account"),
                title: t("helpcenter.KnowledgeBase.UserAccount.title5"),
                content: [
                    `${t("helpcenter.KnowledgeBase.UserAccount.content5-1")}`,
                    `${t("helpcenter.KnowledgeBase.UserAccount.content5-2")}`
                ],
                youtube: <iframe width="100%" height="315" src="https://www.youtube.com/embed/mAzRJ5bWrwk?si=LAq4ehec_U48u85E&amp;controls=0"
                    title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
            }
        ],
        linconstoreSell: [
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title1"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content1-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle1-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content1-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle1-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content1-3")}`
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title2"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content2-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle2-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content2-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle2-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content2-3")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle2-3")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content2-4")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title3"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-3")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-3")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-4")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-4")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-5")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-5")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-6")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle3-6")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content3-7")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title4"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content4-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle4-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content4-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle4-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content4-3")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title5"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content5-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle5-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content5-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle5-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content5-3")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title6"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content6-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle6-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content6-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle6-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content6-3")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle6-3")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content6-4")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle6-4")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content6-5")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title7"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content7-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle7-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content7-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle7-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content7-3")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title8"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content8-1")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle8-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content8-2")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle8-2")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content8-3")}`,
                    `TITLE:${t("helpcenter.KnowledgeBase.linconstoreSell.subtitle8-3")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content8-4")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title9"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content9")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                link: t("helpcenter.KnowledgeBase.Seller_on_linconstore"),
                title: t("helpcenter.KnowledgeBase.linconstoreSell.title10"),
                content: [
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content10-1")}`,
                    `${t("helpcenter.KnowledgeBase.linconstoreSell.content10-2")}`,
                ],
            },
        ],
        safetytips: [
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Safety_Measures_for_Buyers_on_Linconstore"),
                content: [
                    t("safetytips.content1-1"),
                    t("safetytips.content1-2"),
                    t("safetytips.content1-3"),
                    t("safetytips.content1-4"),
                ],
            },
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Protective_Steps_for_Sellers_on_Linconstore"),
                content: [
                    t("safetytips.content2-1"),
                    t("safetytips.content2-2"),
                    t("safetytips.content2-3"),
                ],
            },
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Maintaining_Privacy_and_Security_on_Linconstore"),
                content: [
                    t("safetytips.content3-0"),
                    t("safetytips.content3-1"),
                    t("safetytips.content3-2"),
                    t("safetytips.content3-3"),
                ],
            },
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Recognizing_and_Avoiding_Scams_on_Linconstore"),
                content: [
                    t("safetytips.content4-1"),
                    t("safetytips.content4-2"),
                    t("safetytips.content4-3"),
                    t("safetytips.content4-4"),
                ],
            },
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Safe_Payment_Methods_on_Linconstore"),
                content: [
                    t("safetytips.content5-0"),
                ],
            },
            {
                header: t("safetytips.Safety_tips"),
                link: t("safetytips.Safety_tips"),
                title: t("safetytips.Reporting_Issues_and_Concerns_to_Linconstore"),
                content: [
                    t("safetytips.content6-0"),
                ],
            }
        ],
        sellerTools: [
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title1"),
                content: [`${t("helpcenter.KnowledgeBase.sellerTools.content1")}`],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title2"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content2-1")}`,
                    `${t("helpcenter.KnowledgeBase.sellerTools.content2-2")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title3"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content3-1")}`,
                    `${t("helpcenter.KnowledgeBase.sellerTools.content3-2")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title4"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content4-1")}`,
                    `${t("helpcenter.KnowledgeBase.sellerTools.content4-2")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title5"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content5")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title6"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content6-1")}`,
                    `${t("helpcenter.KnowledgeBase.sellerTools.content6-2")}`,
                    `${t("helpcenter.KnowledgeBase.sellerTools.content6-3")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title7"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content7")}`,
                ],
            },
            {
                header: t("helpcenter.KnowledgeBase.Seller_tools"),
                link: t("helpcenter.KnowledgeBase.Seller_tools"),
                title: t("helpcenter.KnowledgeBase.sellerTools.title8"),
                content: [
                    `${t("helpcenter.KnowledgeBase.sellerTools.content8")}`,
                ],
            }
        ],
        community: [
            {
                header: t("helpcenter.KnowledgeBase.Community_header"),
                link: t("helpcenter.KnowledgeBase.Community_header"),
                title: t("helpcenter.KnowledgeBase.Community.title"),
                content: [
                    `${t("helpcenter.KnowledgeBase.Community.content1")}`,
                    `${t("helpcenter.KnowledgeBase.Community.content2")}`,
                    `${t("helpcenter.KnowledgeBase.Community.content3")}`,
                ],
            }
        ],
        sellerPayout: [
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Available_payout_methods"),
                content: [
                    t("sellerPayout.content1-1"),
                    t("sellerPayout.content1-2"),
                    t("sellerPayout.content1-3"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.When_you_get_paid"),
                content: [
                    t("sellerPayout.content2-1"),
                    t("sellerPayout.content2-2"),
                    t("sellerPayout.content2-3"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Pending_payout"),
                content: [
                    t("sellerPayout.content3-1"),
                    t("sellerPayout.content3-2"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Adding_payout_account"),
                content: [
                    t("sellerPayout.content4-1"),
                    t("sellerPayout.content4-2"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Using_bank_transfer"),
                content: [
                    t("sellerPayout.content5-1"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Using_PayPal_as_a_payout_method"),
                content: [
                    t("sellerPayout.content6-1"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Understanding_Fees_and_Commissions"),
                content: [
                    t("sellerPayout.content7-1"),
                    t("sellerPayout.content7-2"),
                    t("sellerPayout.content7-3"),
                    t("sellerPayout.content7-4"),
                ],
            },
            {
                header: t("sellerPayout.Seller_Payout"),
                link: t("sellerPayout.Seller_Payout"),
                title: t("sellerPayout.Troubleshooting_Payment_Issues"),
                content: [
                    t("sellerPayout.content8-0"),
                    t("sellerPayout.content8-1"),
                    t("sellerPayout.content8-2"),
                    t("sellerPayout.content8-3"),
                    t("sellerPayout.content8-4"),
                ],
            }
        ],
        promotingStore: [
            {
                header: `Promoting store guide`,
                link: `Promoting Store`,
                title: `Store Promotion Guide`,
                content: [
                    `Promoting your store is essential for driving traffic and increasing sales to your 
                    store. Several strategies can be utilized to effectively promote your store and 
                    attract customers.`,
                    `One effective strategy is to engage with the community forum. By actively 
                    participating in the community forum, sellers can establish themselves as 
                    knowledgeable and trustworthy experts in their field and this can lead to 
                    increased visibility and credibility for your store.`,
                    `Another strategy is to promote your products directly from your dashboard. 
                    This allows sellers to showcase their products to potential customers who are 
                    already browsing on the platform.`,
                    `Also, sellers can take advantage of social media platforms to further promote 
                    their stores. By posting your store link on your social media pages, you can 
                    reach a wider audience and drive traffic to your store.`,
                    `One other way is through paid advertising. Paid advertising can be a powerful 
                    tool for promoting your store. By utilizing platforms like Facebook, Google, or 
                    Instagram, sellers can reach a targeted audience and increase brand visibility.`,
                    `And finally, Customer recommendations and positive reviews play a crucial role 
                    in promoting your store. They build trust and credibility among potential 
                    customers, encouraging them to make a purchase.`,
                ],
            },
        ],
    }

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
                    title={`${knowledgeContentItems[slug][0].header}`}
                    paths={[t("helpcenter.title"), t("helpcenter.Knowledge_base"), `${knowledgeContentItems[slug][0].link}`]}
                    iconComponent={<Laptop sx={{ color: "var(--primary)" }} />}
                    routePath="/help-center/knowledgeBase"
                />

                <Container component={"main"} maxWidth={"lg"} sx={{ my: 10 }}>
                    {
                        knowledgeContentItems[slug].map((item, index) => {
                            return (
                                <CollapseItem key={index} title={item.title} content={item.content} youtube={item.youtube} />
                            )
                        })
                    }
                </Container>
                <Footer />
            </Wrapper>
        </>
    )
}

export default KnowledgeBaseContent