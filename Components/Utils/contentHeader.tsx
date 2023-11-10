import { Box, Divider, IconButton, InputBase, Link, Paper, Typography, useMediaQuery } from "@mui/material"
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { Search, Menu, Directions } from "@mui/icons-material"
import { useTranslation } from "react-i18next";

interface IContentHeader {
    title: string;
    paths?: string[];
    iconComponent?: React.ReactNode;
    routePath?: string;
    fontSize?: string;
    variant?: 'primary' | 'black';
    search?: boolean;
    helpText?: string | null;
}

const ContentHeader: React.FC<IContentHeader> = ({
    title,
    paths = [],
    iconComponent,
    routePath,
    variant = 'primary',
    search = false,
    helpText = null,
    fontSize
}) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const router = useRouter();
    
    const dynamicFontSize = fontSize ? fontSize : (!isMobile ? "36px" : "24px")

    return (
        <Box px={5} className="test" bgcolor={"rgba(11, 166, 89, 0.08)"}>
            <Box display={"flex"} flexDirection={"column"} py={10} textAlign={"center"}>
                <Typography 
                    color={variant==="primary" ? "var(--primary)" : "black"} 
                    textAlign={"center"}
                    fontSize={dynamicFontSize}
                    fontWeight={700}
                    mb={3}
                >
                    {title}
                </Typography>
                {
                    !!helpText && (
                        <Typography mb={3}>{helpText}</Typography>
                    )
                }
                {
                    search && (
                        <Box display={"flex"} justifyContent={"center"}>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                            >
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <Search />
                                </IconButton>
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder={t("helpcenter.search_here")}
                                    inputProps={{ 'aria-label': 'search here' }}
                                />
                            </Paper>
                        </Box>
                    )
                }
            </Box>
            {
                paths.length > 0 && (
                    <Box display={"flex"} flexDirection={"row"} pb={2} onClick={() => router.push(routePath)} sx={{textDecoration: "none", color: "black"}}>
                        {
                            paths.map((path, index) => {
                                if(index === 0) {
                                    return <Typography fontSize={14} sx={{cursor: "pointer"}}>{path}</Typography>
                                }
                                if(index === 1) {
                                    return <>
                                        \
                                        {iconComponent}                              
                                        <Typography fontSize={14} sx={{cursor: "pointer", color: paths.length === 2 && "var(--primary)"}}>&nbsp;{path}</Typography>
                                    </>
                                } else {
                                    return <Typography fontSize={14} sx={{cursor: "pointer", color: paths.length - 1 === index && "var(--primary)"}}>\ &nbsp;{path}</Typography>
                                }
                            })
                        }
                        
                    </Box>
                )
            }
        </Box>
    )
}

export default ContentHeader