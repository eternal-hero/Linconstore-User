import React from "react";
import Avatar from "@mui/material/Avatar";

const Logo: React.FC = () => {
  return (
    <Avatar
      variant={"square"}
      sx={{
        width: 270,
        height: 230,
        p: 2,
        m: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
      src={"https://res.cloudinary.com/linconstore-cloud/image/upload/f_auto,q_auto/v1/web-asset/y91radan7dkpnwlicnws"}
      alt={"avatar of bothword-store"}
    />
  );
};

export default Logo;
