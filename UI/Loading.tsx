import { Container } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import styles from './Loading.module.css';
export default function Loader (){
  return (
    <Container maxWidth='xs' component='main' >
      <Box sx={{alignItems: 'center', display: 'flex', flexDirection:'column'}}>
    <div className={styles.spinner}></div>
      </Box>
    </Container>
  )};
