import React from 'react';
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
interface Holder {
    children: React.ReactNode
}
const MainHolder : React.JSXElementConstructor<Holder> = ({children}) => {
    return(
            <Container component="main" maxWidth="xl">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        marginBottom: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        // height: 600,
                        justifyContent: 'center'
                    }}
                >
                    {children}
                </Box>
            </Container>
    )
}

export default MainHolder;