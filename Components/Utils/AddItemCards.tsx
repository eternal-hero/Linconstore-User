import Box from "@mui/material/Box";
import { Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { AddBoxOutlined, AddTask } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface IaddItems {
  title: string;
}
const AddItemCards: React.JSXElementConstructor<IaddItems> = ({ title }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 2,
          mt: 2,
          maxWidth: "300px",
        }}
      >
        <Stack direction={"row"} spacing={2}>
          <Typography variant={"h6"}>{title}</Typography>
          <div onClick={() => router.push("/seller/post")}>
            <AddBoxOutlined sx={{ color: "#00a859", mt: 0.5 }} />
          </div>
        </Stack>
        <Card
          className={"package"}
          onClick={() => router.push("/seller/post")}
          sx={{
            height: { xs: "150px", sm: "170px" },
            borderRadius: "2px solid #00a859",
            p: 2,
            color: "#00a859",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant={"body1"} component={"h6"} mt={5}>
              {t("seller.add_your_first_item")}
            </Typography>
            <AddTask />
          </Box>
        </Card>
      </Box>
    </>
  );
};
export default AddItemCards;
