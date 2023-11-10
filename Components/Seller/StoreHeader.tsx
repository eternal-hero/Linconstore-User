import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Image from "next/image";
import { reCreateDate } from "../../Helpers/getDate";
type IStore = {
  logo: string;
  title: string;
  summary: string;
  location: string;
  createdAt: Date | string;
};
interface IStorename {
  store: IStore;
}
const StoreHeader: React.JSXElementConstructor<IStore> = ({
  createdAt,
  logo,
  location,
  summary,
  title,
}) => {
  const isMobile = useMediaQuery("(max-width: 500px)");
  return (
    <Card
      elevation={0}
      sx={{
        background: "#f3f2f2",
        maxWidth: { xs: "auto", lg: "auto" },
        mt: 1,
        position: "sticky",
        top: "0",
        zIndex: "10"
      }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "row" }}>
        <Stack sx={{ display: "flex", flexGrow: 1, flexDirection: "row" }}>
          <Image
            width={isMobile ? 150 : "100%"}
            height={isMobile ? 50 : 150}
            className={"storeLogo"}
            placeholder="blur"
            blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
            src={logo}
            alt={"store logo image"}
          />
          <Stack spacing={isMobile ? 0 : 1} sx={{ ml: isMobile ? 1 : 2 }}>
            <Typography
              variant={isMobile ? "h5" : "h5"}
              color={"text.secondary"}
            >
              <b> {title} </b>
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h6"}
              color={"text.secondary"}
            >
              {location}
            </Typography>
            <Typography variant="body2" color={"text.secondary"}>
              {summary}
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          <Typography variant={"body1"}>
            Joined {reCreateDate(createdAt)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
export default StoreHeader;
