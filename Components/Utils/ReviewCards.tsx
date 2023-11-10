import {
  Avatar,
  Box,
  Card,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

interface Ireviews {
  rate: number;
  description: string;
  name: string;
}
const ReviewCards: React.JSXElementConstructor<Ireviews> = ({
  rate,
  description,
  name,
}) => {
  const isMobile: boolean = useMediaQuery("(max-width:400px)");
  return (
    <Box sx={{ minWidth: 100, backgroundColor: "transparent" }}>
      <Card sx={{ boxShadow: "none" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: isMobile ? 1 : 2,
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <Avatar variant="circular" sx={{ mr: 2, bgcolor: "var(--primary)" }}>
            {name.split("")[0]}
          </Avatar>
          <Stack>
            <Stack
              direction={"column"}
              justifyContent={"space-between"}
              sx={{ maxWidth: "200px" }}
            >
              <Typography variant="body1">{name}</Typography>
              <Rating name="product_rating" value={rate} readOnly />
            </Stack>
          </Stack>
        </Box>
            <Typography variant="subtitle2" px={2} fontWeight={500}>{description}</Typography>
      </Card>
    </Box>
  );
};
export default ReviewCards;
