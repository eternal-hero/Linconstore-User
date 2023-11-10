import React, { useEffect } from 'react';
import { Snackbar, Button, useMediaQuery } from '@mui/material';
import { Cookie as CookieIcon } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useSelector ,useDispatch} from 'react-redux';
import { setModalCookie } from '../../Store/Modal';
import { useTranslation } from "react-i18next";

const ConsentBanner = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cookieModal = useSelector((state: any) => state.modal.cookieModal);

  const isSmallScreen = useMediaQuery('(max-width:1050px)');
  const isMobileView = useMediaQuery('(max-width:600px)');
  useEffect(()=>{
    if (Cookies.get("CookiesBannerStatus") === "true") {
      dispatch( setModalCookie(false))
    }
  }, [])
  const handleClose = () => {
    // Perform necessary actions based on user's consent (accept/deny)
    dispatch(setModalCookie(false));
    Cookies.set("CookiesBannerStatus", "true", { expires: 7, secure: true })
  };

  const iconStyle = {
    marginRight: '8px', // Spacing between icon and text
    color: '#0A5D38',
  };

  const innerContainerStyle = {
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row', // Column for small screens, row for larger screens
    alignItems: 'center', // Center the items vertically
    width: '100%',
    // ...(isMobileView && { marginBottom: '40px' }),
  };

  return (
    <Snackbar
      open={cookieModal}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Always keep it as row
        mb: isMobileView && "60px"
      }}
      action={
        <div style={{
            ...innerContainerStyle,
            flexDirection: isSmallScreen ? 'column' : 'row', // Apply column direction for small screens
            gap: "16px"
          }}>
          <div style={{ display: 'flex',color:"#0A5D38", alignItems: 'center', justifyContent: 'space-around', width: '80%',flexDirection:isMobileView?'column':'row', gap: 2 }}>
            <CookieIcon style={iconStyle} />
            <span style={{ width: '90%' }}>
              {t("cookie_policy.alarm")}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="contained" size="large" style={{ borderRadius: '10px', textTransform: "capitalize" }} onClick={() => handleClose()}>
              {t("cookie_policy.decline")}
            </Button>
            <Button             
              variant="contained"
              size="large"
              style={{ borderRadius: '10px', textTransform: "capitalize" }}
              onClick={() => handleClose()}
            >
              {t("cookie_policy.accept")}
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ConsentBanner;
