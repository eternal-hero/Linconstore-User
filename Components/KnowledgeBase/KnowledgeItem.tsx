import { Box, Typography } from "@mui/material"
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type KnowlegdeItemProps = {
    content: string;
    amount: number;
    link: string;
    icon: React.ReactNode
}

const KnowledgeItem: React.FC<KnowlegdeItemProps> = ({content, amount, link, icon}) => {
    const { t } = useTranslation();
    const router = useRouter();
    return (
        <>
            <Box 
                display={'flex'} 
                flexDirection={'column'} 
                // maxWidth={300} 
                p={3} 
                gap={3} 
                boxShadow={"0 0 16px rgba(0, 0, 0, 0.2)"}
                onClick={() => router.push(`knowledgeBase/${link}`)}
                sx={{cursor: "pointer"}}
            >
                <Box display={'flex'} gap={3} alignItems={'center'}>
                    {icon}
                    <Typography>{amount} {t("helpcenter.KnowledgeBase.items")}</Typography>
                </Box>
                <Box display={"flex"} justifyContent={'center'}>
                    <Typography fontSize={18} fontWeight={700}>{content}</Typography>
                </Box>
            </Box>
        </>
    )
}

export default KnowledgeItem